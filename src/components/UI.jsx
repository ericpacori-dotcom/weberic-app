// src/components/UI.jsx
import React from 'react';
import { COLORS } from '../utils/constants';

export const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-8 py-3 rounded-full font-bold transition-all duration-300 ease-out flex items-center justify-center gap-2 text-sm tracking-wide active:scale-95 shadow-lg hover:shadow-xl transform relative z-10 select-none";
  const variants = {
    primary: `${COLORS.accentOrange} text-white hover:bg-[#DE5E2E] hover:-translate-y-1`,
    secondary: `bg-transparent border-2 border-[#F9703E] ${COLORS.textOrange} hover:bg-[#F9703E]/10`,
    outline: `bg-transparent border-2 ${COLORS.borderSoft} ${COLORS.textMuted} hover:bg-[#486581] hover:text-white`,
    google: `bg-white text-[#334E68] hover:bg-gray-100 hover:-translate-y-1`, 
    danger: "bg-[#EF4444] text-white hover:bg-[#DC2626]",
  };
  return <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-60 cursor-not-allowed hover:translate-y-0' : ''} ${className}`}>{children}</button>;
};

export const Badge = ({ children, color = 'orange', className = '' }) => {
  const styles = { orange: `bg-[#F9703E]/20 ${COLORS.textOrange} border border-[#F9703E]/30`, blue: `bg-[#486581] ${COLORS.textMuted} border border-[#627D98]`, light: `bg-[#F0F4F8] text-[#334E68]` };
  const finalStyle = styles[color] || styles.orange;
  return <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase ${finalStyle} ${className} transition-transform hover:scale-105 cursor-default select-none`}>{children}</span>;
};