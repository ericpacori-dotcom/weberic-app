// functions/index.js
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const admin = require('firebase-admin');
const functions = require('firebase-functions'); 

// INICIALIZAR FIREBASE ADMIN
admin.initializeApp();
const db = admin.firestore();

// --- 1. CONFIGURACIÓN SEGURA (CORREGIDO: LAZY LOADING) ---
// En lugar de crear la conexión aquí fuera (que causa el error),
// creamos una función que la crea solo cuando se necesita.
const getMpClient = () => {
    return new MercadoPagoConfig({ 
        accessToken: functions.config().mercadopago.token 
    });
};

// === HELPER: Desbloquear curso en la base de datos ===
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

// === 2. CREAR ORDEN (MERCADO PAGO) ===
exports.createOrder = onRequest({ cors: true }, async (req, res) => {
    try {
        const { title, price, id, userId } = req.body;

        if (!title || !price) {
            res.status(400).json({ error: "Faltan datos" });
            return;
        }

        const courseIdParam = id || "general";
        
        // URL DE TU PROYECTO
        const DOMAIN = "https://weberic-25da5.web.app"; 

        const backUrls = {
            success: `${DOMAIN}/?status=approved&course_id=${courseIdParam}`,
            failure: `${DOMAIN}/?status=failure`,
            pending: `${DOMAIN}/?status=pending`
        };

        const webhookUrl = `https://us-central1-weberic-25da5.cloudfunctions.net/mpWebhook`;

        // USAMOS LA NUEVA FUNCIÓN GETMPCLIENT AQUÍ
        const preference = new Preference(getMpClient());
        
        const result = await preference.create({
            body: {
                items: [{
                    id: courseIdParam,
                    title: title,
                    unit_price: Number(price),
                    quantity: 1,
                    currency_id: "USD"
                }],
                metadata: {
                    user_id: userId,
                    course_id: courseIdParam
                },
                back_urls: backUrls,
                auto_return: "approved",
                notification_url: webhookUrl
            }
        });

        res.status(200).json({ id: result.id });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "Error interno" });
    }
});

// === 3. WEBHOOK MERCADO PAGO ===
exports.mpWebhook = onRequest({ cors: true }, async (req, res) => {
    const paymentId = req.query.id || req.query['data.id'];
    const topic = req.query.topic || req.query.type;

    if (topic === 'payment' && paymentId) {
        try {
            // USAMOS LA NUEVA FUNCIÓN GETMPCLIENT AQUÍ TAMBIÉN
            const payment = await new Payment(getMpClient()).get({ id: paymentId });
            
            if (payment.status === 'approved') {
                const { user_id, course_id } = payment.metadata;
                
                if (user_id) {
                    logger.info(`💰 Pago MP recibido de ${user_id}`);
                    await unlockContentForUser(user_id, course_id);
                }
            }
        } catch (error) {
            logger.error("Error webhook MP:", error);
        }
    }
    res.sendStatus(200);
});

// === 4. VERIFICAR PAYPAL (SEGURIDAD) ===
exports.verifyPayPalEndpoint = onRequest({ cors: true }, async (req, res) => {
    const { orderID, subscriptionID, courseId, userId, isSubscription } = req.body;
    
    if (!userId) return res.status(400).send("Falta userId");

    const CLIENT_ID = functions.config().paypal.client_id;
    const APP_SECRET = functions.config().paypal.client_secret;
    const BASE_URL = "https://api-m.paypal.com"; 

    try {
        const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
        const tokenParams = new URLSearchParams();
        tokenParams.append('grant_type', 'client_credentials');
        
        const tokenRes = await fetch(`${BASE_URL}/v1/oauth2/token`, {
            method: 'POST',
            body: tokenParams,
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) throw new Error("No se pudo obtener token de PayPal");

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
            return res.json({ success: true, message: "Curso desbloqueado" });
        } else {
            return res.status(400).json({ error: "Pago no válido" });
        }

    } catch (error) {
        logger.error("Error verificando PayPal:", error);
        return res.status(500).json({ error: "Error de servidor" });
    }
});