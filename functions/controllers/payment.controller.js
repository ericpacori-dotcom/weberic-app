// functions/controllers/payment.controller.js
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

// Usamos tus credenciales del entorno
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export const createSubscription = async (req, res) => {
  try {
    const { userId, email } = req.body; 

    const preapproval = new PreApproval(client);

    const result = await preapproval.create({
      body: {
        reason: "Suscripción Mensual - Haeric Activos",
        external_reference: userId, // VINCULA EL PAGO AL USUARIO
        payer_email: email, 
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 29.90, // PRECIO MENSUAL
          currency_id: "PEN"
        },
        back_url: "https://tudominio.com/perfil", 
        status: "pending"
      }
    });

    res.json({ init_point: result.init_point }); 

  } catch (error) {
    console.error("Error al crear la suscripción:", error);
    res.status(500).json({ error: "Error interno al crear la suscripción" });
  }
};