const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true }); // Permite que tu web se conecte
const { MercadoPagoConfig, Preference } = require("mercadopago");

admin.initializeApp();

// Configuración de Mercado Pago con tu ACCESS TOKEN
const client = new MercadoPagoConfig({ 
  accessToken: "APP_USR-7059676066598760-103011-a9baf76ca7324a612654055a3219912c-2956386505" 
});

exports.createOrder = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Solo aceptamos peticiones POST
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const { title, price, id } = req.body;

      const preference = new Preference(client);
      const result = await preference.create({
        body: {
          items: [
            {
              id: id,
              title: title,
              unit_price: Number(price), // Aseguramos que sea número
              quantity: 1,
              currency_id: "PEN", // Soles
            },
          ],
          // Redirección al terminar el pago
          back_urls: {
            success: "https://weberic-25da5.web.app/", 
            failure: "https://weberic-25da5.web.app/",
            pending: "https://weberic-25da5.web.app/",
          },
          auto_return: "approved",
        },
      });

      // Devolvemos el ID de preferencia al Frontend para mostrar el botón
      res.json({ id: result.id });
    } catch (error) {
      console.error("Error MP:", error);
      res.status(500).json({ error: error.message });
    }
  });
});