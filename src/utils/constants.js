// src/utils/constants.js

export const APP_NAME = "Weberic AI";

// PRECIOS ACTUALIZADOS
export const PLAN_MONTHLY_PRICE = 3.00;
export const PLAN_YEARLY_PRICE = 30.00; // Ahorro de $6 al año

// Colores del Tema (Slate & Orange)
export const COLORS = {
  bgMain: "bg-[#334E68]",       // Slate 800 - Fondo Principal
  bgCard: "bg-[#486581]",       // Slate 700 - Tarjetas
  bgLighter: "bg-[#627D98]",    // Slate 600 - Elementos claros
  textLight: "text-[#F0F4F8]",  // Slate 50 - Texto principal
  textMuted: "text-[#BCCCDC]",  // Slate 300 - Texto secundario
  textOrange: "text-[#F9703E]", // Naranja Vibrante - Acentos texto
  accentOrange: "bg-[#F9703E]", // Naranja Vibrante - Botones/Fondos
  border: "border-[#627D98]"    // Bordes
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};