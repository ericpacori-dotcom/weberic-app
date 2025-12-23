// src/utils/constants.js

export const COLORS = {
  bgMain: "bg-[#334E68]",       
  bgCard: "bg-[#486581]",       
  bgLighter: "bg-[#627D98]",    
  accentOrange: "bg-[#F9703E]", 
  textOrange: "text-[#F9703E]", 
  textLight: "text-[#F0F4F8]",  
  textMuted: "text-[#BCCCDC]",  
  borderSoft: "border-[#486581]", 
};

export const COURSE_PRICE = 0.50; // PRECIO EN USD
export const ORIGINAL_PRICE = 15.00;

export const formatCurrency = (amountInUSD) => {
  return `$${amountInUSD.toFixed(2)}`;
};