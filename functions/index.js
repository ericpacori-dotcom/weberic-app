// functions/index.js
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const admin = require('firebase-admin');

// INICIALIZAR FIREBASE ADMIN
admin.initializeApp();
const db = admin.firestore();

// CONFIGURACIÓN
// Asegúrate de que este Access Token sea el de PRODUCCIÓN o PRUEBAS según lo que estés usando
const mpClient = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-4746731218403713-092514-08fc48a44097fcff0ff347c161166c48-2695806238' 
});

// === HELPER: Desbloquear curso en la base de datos ===
async function unlockContentForUser(userId, courseId) {
    try {
        const userRef = db.collection("users").doc(userId);
        
        // Verificamos si es suscripción o curso único
        if (courseId === 'SUB-PREMIUM-MONTHLY') {
            await userRef.set({ 
                isSubscribed: true,
                subscriptionSource: 'mercadopago',
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

// === 1. CREAR ORDEN ===
exports.createOrder = onRequest({ cors: true }, async (req, res) => {
    try {
        const { title, price, id, userId } = req.body;

        if (!title || !price) {
            res.status(400).json({ error: "Faltan datos" });
            return;
        }

        const courseIdParam = id || "general";
        
        // URL DE TU PROYECTO (Asegúrate de que 'haeric.com' es tu dominio real o usa el de firebase hosting)
        // Si no tienes dominio propio aún, usa: https://weberic-25da5.web.app
        const DOMAIN = "https://weberic-25da5.web.app"; 

        const backUrls = {
            success: `${DOMAIN}/?status=approved&course_id=${courseIdParam}`,
            failure: `${DOMAIN}/?status=failure`,
            pending: `${DOMAIN}/?status=pending`
        };

        // URL DEL WEBHOOK (Automática según tu proyecto)
        // Esto le dice a MP: "Avisa aquí cuando paguen"
        const webhookUrl = `https://us-central1-weberic-25da5.cloudfunctions.net/mpWebhook`;

        const preference = new Preference(mpClient);
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
                notification_url: webhookUrl // <--- ¡CLAVE PARA LA SEGURIDAD!
            }
        });

        res.status(200).json({ id: result.id });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "Error interno" });
    }
});

// === 2. WEBHOOK (El Guardián de la Seguridad) ===
exports.mpWebhook = onRequest({ cors: true }, async (req, res) => {
    const paymentId = req.query.id || req.query['data.id'];
    const topic = req.query.topic || req.query.type;

    // Solo nos interesan los pagos (no las creaciones de usuarios, etc.)
    if (topic === 'payment' && paymentId) {
        try {
            const payment = await new Payment(mpClient).get({ id: paymentId });
            
            if (payment.status === 'approved') {
                const { user_id, course_id } = payment.metadata;
                
                if (user_id) {
                    logger.info(`💰 Pago recibido de ${user_id} por ${course_id}`);
                    await unlockContentForUser(user_id, course_id);
                } else {
                    logger.warn("⚠️ Pago sin metadata de usuario:", paymentId);
                }
            }
        } catch (error) {
            logger.error("Error webhook:", error);
        }
    }
    res.sendStatus(200);
});