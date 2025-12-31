// functions/controllers/payment.controller.js
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

// AHORA LEE DEL ENV, NO ESTÁ ESCRITO A FUEGO
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN 
});

export const createSubscription = async (req, res) => {
  try {
    const { userId, email, planType } = req.body; 

    // Recuerda: Si cambias de cuenta MP, estos IDs de plan cambiarán
    const planId = planType === 'yearly' 
      ? "ddd5afaea20940fca33e7e60e65df62d" 
      : "3bac21d11f4047be91016c280dc0bb33";

    const preapproval = new PreApproval(client);
    
    // Usamos APP_DOMAIN del .env para la URL de retorno
    const domain = process.env.APP_DOMAIN || "https://weberic-app.web.app";

    const result = await preapproval.create({
      body: {
        preapproval_plan_id: planId,
        payer_email: email, 
        external_reference: userId, 
        back_url: `${domain}/perfil`, 
        status: "pending",
        reason: planType === 'yearly' ? "Suscripción Anual" : "Suscripción Mensual"
      }
    });

    res.json({ init_point: result.init_point }); 

  } catch (error) {
    console.error("ERROR MP:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};