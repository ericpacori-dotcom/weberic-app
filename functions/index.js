// functions/index.js
import { onRequest } from "firebase-functions/v2/https";
import logger from "firebase-functions/logger";
import admin from "firebase-admin";
import { MercadoPagoConfig, Preference, Payment, PreApproval } from "mercadopago";
import express from "express";
import cors from "cors";

// Rutas de suscripción
import paymentRoutes from "./routes/payment.routes.js"; 

admin.initializeApp();
const db = admin.firestore();

// --- CREDENCIALES ---
const client = new MercadoPagoConfig({ 
    accessToken: "APP_USR-4746731218403713-092514-08fc48a44097fcff0ff347c161166c48-2695806238" 
});

// --- HELPER PARA DESBLOQUEO ---
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
        logger.info(`✅ Contenido desbloqueado para ${userId}`);
        return true;
    } catch (error) {
        logger.error("Error en desbloqueo:", error);
        return false;
    }
}

// ==========================================
//  1. CONFIGURACIÓN DE EXPRESS (API)
// ==========================================
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// --- NUEVA RUTA DE WEBHOOK PARA SUSCRIPCIONES ---
app.post("/payment/webhook", async (req, res) => {
    const { query, body } = req;
    
    // Mercado Pago envía el tipo en 'type' (notificaciones v2) o 'topic'
    const type = body.type || query.type;
    const id = body.data?.id || query.id;

    try {
        // Manejamos específicamente suscripciones (PreApprovals)
        if (type === "subscription_preapproval" && id) {
            const preapproval = new PreApproval(client);
            const subDetails = await preapproval.get({ id });

            // 'authorized' indica que el pago de la suscripción fue exitoso
            if (subDetails.status === "authorized") {
                const userId = subDetails.external_reference;
                if (userId) {
                    await unlockContentForUser(userId, "SUB-PREMIUM-MONTHLY");
                    logger.info(`⭐ Membresía activada vía Webhook: ${userId}`);
                }
            }
        }
        
        // Responder siempre 200 para confirmar recepción
        res.status(200).send("OK");
    } catch (error) {
        logger.error("Error en Webhook de suscripción:", error);
        res.status(500).send("Error");
    }
});

// Rutas adicionales de pago
app.use("/payment", paymentRoutes);

// Exportar la API principal
export const api = onRequest(app);

// ==========================================
//  2. FUNCIONES DE PAGO ÚNICO (PREFERENCES)
// ==========================================

export const createOrder = onRequest({ cors: true }, async (req, res) => {
    try {
        const { title, price, id, userId } = req.body;
        if (!title || !price) return res.status(400).json({ error: "Faltan datos" });

        const courseIdParam = id || "general";
        const DOMAIN = "https://weberic-app.web.app"; 

        const preference = new Preference(client);
        const result = await preference.create({
            body: {
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
                    success: `${DOMAIN}/perfil`,
                    failure: `${DOMAIN}/`,
                    pending: `${DOMAIN}/`
                },
                auto_return: "approved",
                notification_url: `https://us-central1-weberic-25da5.cloudfunctions.net/mpWebhook`
            }
        });
        
        res.status(200).json({ id: result.id });
    } catch (error) {
        logger.error("Error MP Order:", error);
        res.status(500).json({ error: "Error creando orden" });
    }
});

// Webhook para pagos únicos (Preferencias)
export const mpWebhook = onRequest({ cors: true }, async (req, res) => {
    const paymentId = req.query.id || req.query['data.id'];
    const topic = req.query.topic || req.query.type;

    if ((topic === 'payment') && paymentId) {
        try {
            const payment = await new Payment(client).get({ id: paymentId });
            if (payment.status === 'approved') {
                const userId = payment.metadata?.user_id;
                const courseId = payment.metadata?.course_id;
                if (userId && courseId) await unlockContentForUser(userId, courseId);
            }
        } catch (error) {
            logger.error("Error Webhook Pago Único:", error);
        }
    }
    res.sendStatus(200);
});

// ==========================================
//  3. VERIFICACIÓN PAYPAL
// ==========================================
export const verifyPayPalEndpoint = onRequest({ cors: true }, async (req, res) => {
    const { userId, isSubscription } = req.body;
    try {
        // Lógica de validación simplificada (asumiendo aprobación previa en frontend)
        const finalCourseId = isSubscription ? 'SUB-PREMIUM-MONTHLY' : 'general';
        await unlockContentForUser(userId, finalCourseId);
        return res.json({ success: true });
    } catch (error) {
        logger.error("Error PayPal Verify:", error);
        return res.status(500).json({ error: "Error verificando" });
    }
});