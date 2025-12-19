const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const admin = require('firebase-admin');

// INICIALIZAR FIREBASE ADMIN (Para desbloquear el curso en la BD)
admin.initializeApp();
const db = admin.firestore();

// CONFIGURACIÓN
const mpClient = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-4746731218403713-092514-08fc48a44097fcff0ff347c161166c48-2695806238' 
});

// === HELPER: Desbloquear curso en la base de datos ===
async function unlockContentForUser(userId, courseId) {
    try {
        const userRef = db.collection("users").doc(userId);
        if (courseId === 'SUB-PREMIUM-MONTHLY') {
            await userRef.set({ isSubscribed: true }, { merge: true });
        } else {
            await userRef.set({ 
                purchasedCourses: admin.firestore.FieldValue.arrayUnion(courseId) 
            }, { merge: true });
        }
        logger.info(`✅ Curso ${courseId} desbloqueado para ${userId}`);
        return true;
    } catch (error) {
        logger.error("Error en desbloqueo:", error);
        return false;
    }
}

// === 1. CREAR ORDEN (ACTUALIZADA: Ahora envía el ID del curso de regreso) ===
exports.createOrder = onRequest({ cors: true }, async (req, res) => {
    try {
        const { title, price, id, userId } = req.body; // Necesitamos recibir el userId

        if (!title || !price) {
            res.status(400).json({ error: "Faltan datos" });
            return;
        }

        // --- CORRECCIÓN: Capturamos el ID para usarlo en la URL ---
        const courseIdParam = id || "general";

        // --- CORRECCIÓN: Inyectamos course_id en la URL de success ---
        const backUrls = {
            success: `https://haeric.com/?status=approved&course_id=${courseIdParam}`,
            failure: "https://haeric.com/?status=failure",
            pending: "https://haeric.com/?status=pending"
        };

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
                // 🔐 GUARDAMOS EL USUARIO EN LA METADATA DEL PAGO
                metadata: {
                    user_id: userId,
                    course_id: courseIdParam
                },
                back_urls: backUrls, // Usamos la nueva variable con la URL dinámica
                auto_return: "approved"
            }
        });

        res.status(200).json({ id: result.id });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "Error interno" });
    }
});

// === 2. WEBHOOK (Se mantiene igual, para procesar pagos en segundo plano) ===
exports.mpWebhook = onRequest({ cors: true }, async (req, res) => {
    const paymentId = req.query.id || req.query['data.id'];
    const topic = req.query.topic || req.query.type;

    if (topic === 'payment' && paymentId) {
        try {
            const payment = await new Payment(mpClient).get({ id: paymentId });
            
            if (payment.status === 'approved') {
                // Recuperamos quién compró desde la metadata
                const { user_id, course_id } = payment.metadata;
                
                if (user_id) {
                    await unlockContentForUser(user_id, course_id);
                    logger.info(`💰 Pago verificado para usuario ${user_id}`);
                }
            }
        } catch (error) {
            logger.error("Error webhook:", error);
        }
    }
    res.sendStatus(200);
});