// functions/index.js
import { onRequest } from "firebase-functions/v2/https";
import logger from "firebase-functions/logger";
import admin from "firebase-admin";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import express from "express";
import cors from "cors";

// Rutas de suscripción (Asegúrate de que el archivo exista en functions/routes/)
import paymentRoutes from "./routes/payment.routes.js"; 

admin.initializeApp();
const db = admin.firestore();

// --- CREDENCIALES ---
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN 
});

// --- HELPER ---
async function unlockContentForUser(userId, courseId) {
    try {
        const userRef = db.collection("users").doc(userId);
        if (courseId === 'SUB-PREMIUM-MONTHLY') {
            await userRef.set({ 
                isSubscribed: true,
                subscriptionSource: 'backend_verified', 
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

// ==========================================
//  1. NUEVA API (Suscripciones)
// ==========================================
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use("/payment", paymentRoutes);

export const api = onRequest(app);


// ==========================================
//  2. FUNCIONES DE PAGO ÚNICO
// ==========================================

export const createOrder = onRequest({ cors: true }, async (req, res) => {
    try {
        const { title, price, id, userId, email } = req.body;
        if (!title || !price) return res.status(400).json({ error: "Faltan datos" });

        const courseIdParam = id || "general";
        const DOMAIN = process.env.APP_DOMAIN || "http://localhost:5173"; 

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                // 1. ELIMINAMOS 'payer' (Ya estaba comentado, perfecto)
                // payer: { email: email }, 

                // 2. AGREGAMOS ESTO: BINARY MODE (Clave para pagos como invitado)
                binary_mode: true, 
                
                items: [{
                    id: courseIdParam,
                    title: title,
                    unit_price: Number(price),
                    quantity: 1,
                    currency_id: "PEN" 
                }],
                metadata: { user_id: userId, course_id: courseIdParam },
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
        logger.error("Error MP:", error);
        res.status(500).json({ error: "Error creando orden" });
    }
});

// Webhook
export const mpWebhook = onRequest({ cors: true }, async (req, res) => {
    const paymentId = req.query.id || req.query['data.id'];
    const topic = req.query.topic || req.query.type;

    if ((topic === 'payment' || topic === 'merchant_order') && paymentId) {
        try {
            const payment = await new Payment(client).get({ id: paymentId });
            
            if (payment.status === 'approved') {
                const userId = payment.metadata?.user_id || payment.external_reference;
                const courseId = payment.metadata?.course_id || 'SUB-PREMIUM-MONTHLY';

                if (userId) await unlockContentForUser(userId, courseId);
            }
        } catch (error) {
            logger.error("Error Webhook:", error);
        }
    }
    res.sendStatus(200);
});

// Verificación PayPal
export const verifyPayPalEndpoint = onRequest({ cors: true }, async (req, res) => {
    const { orderID, subscriptionID, courseId, userId, isSubscription } = req.body;
    const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const APP_SECRET = process.env.PAYPAL_SECRET;
    const BASE_URL = "https://api-m.paypal.com"; 

    try {
        const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
        const tokenRes = await fetch(`${BASE_URL}/v1/oauth2/token`, {
            method: 'POST', 
            body: 'grant_type=client_credentials', 
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const { access_token } = await tokenRes.json();
        if (!access_token) throw new Error("No token PayPal");

        const finalCourseId = isSubscription ? 'SUB-PREMIUM-MONTHLY' : courseId;
        await unlockContentForUser(userId, finalCourseId);
        return res.json({ success: true });

    } catch (error) {
        logger.error("Error PayPal:", error);
        return res.status(500).json({ error: "Error verificando pago" });
    }
});