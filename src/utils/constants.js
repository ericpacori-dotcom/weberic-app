// src/utils/constants.js

// CAMBIO AQUÍ: Usamos el nombre comercial real para evitar confusiones
export const APP_NAME = "Haeric Academy";

// ==========================================
// PRECIOS Y PLANES (PROMOCIÓN ACTIVADA)
// ==========================================

// Precios "Ancla" (Originales, se mostrarán tachados en la UI)
export const ORIGINAL_MONTHLY_PRICE = 9.99; 
export const ORIGINAL_YEARLY_PRICE = 99.99; 

// Precios Reales de Cobro (Oferta actual por la que cobrará PayPal)
export const PLAN_MONTHLY_PRICE = 2.99;  
export const PLAN_YEARLY_PRICE = 29.99;

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