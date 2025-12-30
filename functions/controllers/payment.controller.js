// functions/controllers/payment.controller.js
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export const createSubscription = async (req, res) => {
  try {
    const { userId, email, planType } = req.body; 

    // ASIGNACIÓN DE IDS DE PLANES (Los que me pasaste)
    // Mensual: 3bac21d11f4047be91016c280dc0bb33
    // Anual: ddd5afaea20940fca33e7e60e65df62d
    const planId = planType === 'yearly' 
      ? "ddd5afaea20940fca33e7e60e65df62d" 
      : "3bac21d11f4047be91016c280dc0bb33";

    const preapproval = new PreApproval(client);

    const result = await preapproval.create({
      body: {
        preapproval_plan_id: planId, // Usamos el Plan pre-configurado
        payer_email: email, 
        external_reference: userId, // Para saber qué usuario pagó
        back_url: "https://weberic-app.web.app/perfil", 
        status: "pending"
      }
    });

    res.json({ init_point: result.init_point }); 

  } catch (error) {
    console.error("Error al crear la suscripción:", error);
    res.status(500).json({ error: "Error interno al crear la suscripción" });
  }
};