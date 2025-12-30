import { MercadoPagoConfig, PreApproval } from 'mercadopago';

// Configuración del cliente con tu Access Token
const client = new MercadoPagoConfig({ accessToken: 'TU_ACCESS_TOKEN' });

export const createSubscription = async (req, res) => {
  try {
    // Recibimos datos del usuario desde el Frontend
    const { userId, email } = req.body; 

    // Inicializamos la clase PreApproval (Suscripciones)
    const preapproval = new PreApproval(client);

    const result = await preapproval.create({
      body: {
        reason: "Suscripción Mensual - Haeric Activos", // Título en el resumen de tarjeta
        external_reference: userId, // VITAL: Vincula el pago al ID de usuario en Firebase
        payer_email: email, // Email del pagador
        auto_recurring: {
          frequency: 1,            // Cada 1
          frequency_type: "months", // Meses
          transaction_amount: 29.90, // Precio a cobrar
          currency_id: "PEN"       // Moneda (Soles)
        },
        back_url: "https://tudominio.com/perfil", // URL de retorno tras pagar
        status: "pending"
      }
    });

    // Devolvemos el link de inicio de suscripción (init_point)
    console.log("Suscripción creada exitosamente:", result.init_point);
    res.json({ init_point: result.init_point }); 

  } catch (error) {
    console.error("Error al crear la suscripción:", error);
    res.status(500).json({ error: "Error interno al crear la suscripción" });
  }
};