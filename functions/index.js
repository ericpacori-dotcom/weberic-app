// functions/index.js
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require('firebase-admin');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

admin.initializeApp();
const db = admin.firestore();

// TOKEN DE MERCADO PAGO
const MP_ACCESS_TOKEN = "APP_USR-4746731218403713-092514-08fc48a44097fcff0ff347c161166c48-2695806238";

const getMpClient = () => {
    return new MercadoPagoConfig({ 
        accessToken: MP_ACCESS_TOKEN
    });
};

async function unlockContentForUser(userId, courseId) {
    try {
        const userRef = db.collection("users").doc(userId);
        if (courseId === 'SUB-PREMIUM-MONTHLY') {
            await userRef.set({ 
                isSubscribed: true,
                subscriptionSource: 'paypal_or_mp', 
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } else {
            await userRef.set({ 
                purchasedCourses: admin.firestore.FieldValue.arrayUnion(courseId),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }
        logger.info(`✅ Curso ${courseId} desbloqueado para ${userId}`);
        return true;
    } catch (error) {
        logger.error("Error en desbloqueo:", error);
        return false;
    }
}

// 1. CREAR ORDEN (Mejorado para mostrar Yape y Tarjetas)
exports.createOrder = onRequest({ cors: true }, async (req, res) => {
    try {
        // AHORA RECIBIMOS EL EMAIL TAMBIÉN
        const { title, price, id, userId, email } = req.body;

        if (!title || !price) {
            res.status(400).json({ error: "Faltan datos: title o price" });
            return;
        }

        const courseIdParam = id || "general";
        const DOMAIN = "https://weberic-25da5.web.app"; 

        const preference = new Preference(getMpClient());

        const result = await preference.create({
            body: {
                // INFORMACIÓN DEL PAGADOR (CRUCIAL PARA MOSTRAR TARJETAS/INVITADO)
                payer: {
                    email: email || "usuario_anonimo@test.com"
                },
                items: [{
                    id: courseIdParam,
                    title: title,
                    unit_price: Number(price),
                    quantity: 1,
                    // IMPORTANTE: YAPE SOLO FUNCIONA CON 'PEN' (SOLES)
                    // Si pones 'USD', Yape desaparecerá.
                    currency_id: "PEN" 
                }],
                payment_methods: {
                    excluded_payment_types: [], // No excluimos nada
                    excluded_payment_methods: [], // No excluimos nada
                    installments: 12 // Permitimos cuotas
                },
                metadata: {
                    user_id: userId,
                    course_id: courseIdParam
                },
                back_urls: {
                    success: `${DOMAIN}/?status=approved`,
                    failure: `${DOMAIN}/?status=failure`,
                    pending: `${DOMAIN}/?status=pending`
                },
                auto_return: "approved",
                notification_url: `https://us-central1-weberic-25da5.cloudfunctions.net/mpWebhook`
            }
        });
        
        res.status(200).json({ id: result.id });

    } catch (error) {
        logger.error("Error MP CreateOrder:", error);
        res.status(500).json({ error: error.message || "Error interno MercadoPago" });
    }
});

// 2. WEBHOOK (IGUAL)
exports.mpWebhook = onRequest({ cors: true }, async (req, res) => {
    const paymentId = req.query.id || req.query['data.id'];
    const topic = req.query.topic || req.query.type;

    if (topic === 'payment' && paymentId) {
        try {
            const payment = await new Payment(getMpClient()).get({ id: paymentId });
            if (payment.status === 'approved') {
                const { user_id, course_id } = payment.metadata;
                if (user_id) {
                    await unlockContentForUser(user_id, course_id);
                }
            }
        } catch (error) {
            logger.error("Error Webhook:", error);
        }
    }
    res.sendStatus(200);
});

// 3. PAYPAL VERIFY (IGUAL)
exports.verifyPayPalEndpoint = onRequest({ cors: true }, async (req, res) => {
    const { orderID, subscriptionID, courseId, userId, isSubscription } = req.body;
    if (!userId) return res.status(400).send("Falta userId");

    const CLIENT_ID = "AeRiOKZeVpLALmFN9P1uv05j6ERrkj7LAcoMkTLax9H3RphI6x8Zbh9q_m3dM55TaJ1dd_G2kZihRhy6";
    const APP_SECRET = "EELH4YnS4IbPAOVRAc7KRRUkRrvmgXX21GP8OCCd7spvmu-vRolGW4jfseSCrDwhic1JD5syogLn2grd";
    const BASE_URL = "https://api-m.paypal.com"; 

    try {
        const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
        const tokenParams = new URLSearchParams();
        tokenParams.append('grant_type', 'client_credentials');
        
        const tokenRes = await fetch(`${BASE_URL}/v1/oauth2/token`, {
            method: 'POST', body: tokenParams, headers: { 'Authorization': `Basic ${auth}` }
        });
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) throw new Error("No token PayPal");

        let isValid = false;
        if (isSubscription && subscriptionID) {
            const subRes = await fetch(`${BASE_URL}/v1/billing/subscriptions/${subscriptionID}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const subData = await subRes.json();
            if (subData.status === 'ACTIVE') isValid = true;
        } else if (orderID) {
            const orderRes = await fetch(`${BASE_URL}/v2/checkout/orders/${orderID}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const orderData = await orderRes.json();
            if (orderData.status === 'COMPLETED' || orderData.status === 'APPROVED') isValid = true;
        }

        if (isValid) {
            const finalCourseId = isSubscription ? 'SUB-PREMIUM-MONTHLY' : courseId;
            await unlockContentForUser(userId, finalCourseId);
            return res.json({ success: true });
        } else {
            return res.status(400).json({ error: "Pago inválido" });
        }
    } catch (error) {
        logger.error("Error PayPal:", error);
        return res.status(500).json({ error: "Error servidor" });
    }
});