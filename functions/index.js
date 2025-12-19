const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { MercadoPagoConfig, Preference } = require('mercadopago');

// ==========================================
// 1. CONFIGURACIÓN DE MERCADO PAGO (PRODUCCIÓN)
// ==========================================
const mpClient = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-4746731218403713-092514-08fc48a44097fcff0ff347c161166c48-2695806238' 
});

// ==========================================
// 2. CONFIGURACIÓN DE PAYPAL (REFERENCIA)
// ==========================================
const PAYPAL_CLIENT_ID = "AeRiOKZeVpLALmFN9P1uv05j6ERrkj7LAcoMkTLax9H3RphI6x8Zbh9q_m3dM55TaJ1dd_G2kZihRhy6";
const PAYPAL_SECRET_KEY = "EELH4YnS4IbPAOVRAc7KRRUkRrvmgXX21GP8OCCd7spvmu-vRolGW4jfseSCrDwhic1JD5syogLn2grd";

// ==========================================
// 3. FUNCIÓN PRINCIPAL (CREATE ORDER)
// ==========================================
exports.createOrder = onRequest({ cors: true }, async (req, res) => {
    
    logger.info("Solicitud de pago recibida", req.body);

    try {
        const { title, price, id } = req.body;

        if (!title || !price) {
            res.status(400).json({ error: "Faltan datos obligatorios (title o price)" });
            return;
        }

        const unitPrice = Number(price);
        const courseId = id || "general"; // Guardamos el ID para la URL

        // URL base de tu web (asegúrate de que esta sea la correcta)
        // Puedes cambiar esto manualmente si usas otro dominio en el futuro
        const baseUrl = "https://haeric.com"; 

        const preference = new Preference(mpClient);

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: courseId,
                        title: title,
                        quantity: 1,
                        unit_price: unitPrice,
                        currency_id: "USD" 
                    }
                ],
                // ⚠️ AQUÍ ESTÁ EL CAMBIO CLAVE:
                // Agregamos ?course_id=ID al final de la URL para saber qué desbloquear
                back_urls: {
                    success: `${baseUrl}/?status=approved&course_id=${courseId}`,
                    failure: `${baseUrl}/?status=failure`,
                    pending: `${baseUrl}/?status=pending`
                },
                auto_return: "approved",
                statement_descriptor: "HAERIC ACTIVOS" 
            }
        });

        res.status(200).json({ id: result.id });

    } catch (error) {
        logger.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error interno procesando el pago" });
    }
});