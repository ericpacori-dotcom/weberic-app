// functions/controllers/payment.controller.js
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: "APP_USR-4746731218403713-092514-08fc48a44097fcff0ff347c161166c48-2695806238" 
});

export const createSubscription = async (req, res) => {
  try {
    const { userId, email, planType } = req.body; 

    // Estos IDs deben ser EXACTOS a los de tu captura de pantalla de Mercado Pago
    const planId = planType === 'yearly' 
      ? "ddd5afaea20940fca33e7e60e65df62d" 
      : "3bac21d11f4047be91016c280dc0bb33";

    const preapproval = new PreApproval(client);

    const result = await preapproval.create({
      body: {
        preapproval_plan_id: planId, // Vincula al plan existente
        payer_email: email, 
        external_reference: userId, 
        back_url: "https://weberic-app.web.app/perfil", 
        status: "pending",
        reason: planType === 'yearly' ? "Suscripción Super Premium Anual" : "Suscripción Premium Mensual"
      }
    });

    // IMPORTANTE: Para suscripciones por Plan, Mercado Pago usa result.init_point
    res.json({ init_point: result.init_point }); 

  } catch (error) {
    // Esto nos permite ver el error real en los logs de Firebase si vuelve a fallar
    console.error("ERROR DETALLADO MP:", error);
    res.status(500).json({ 
      error: "Error en el servidor", 
      details: error.message 
    });
  }
};