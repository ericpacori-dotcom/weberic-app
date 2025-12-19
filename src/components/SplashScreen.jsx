import React from 'react';

const SplashScreen = ({ finishAnimation }) => {
  return (
    // Contenedor principal: Fondo oscuro #334E68, cubre toda la pantalla, Z-index máximo
    // finishAnimation controla la transición de salida (fade-out) cuando la App ya cargó
    <div className={`fixed inset-0 z-[100] bg-[#334E68] flex items-center justify-center transition-opacity duration-500 ${finishAnimation ? 'animate-fade-out' : 'animate-fade-in'}`}>
      
      {/* Contenedor del Logo Animado */}
      <div className="relative">
        
        {/* El Cuadrado Inclinado Naranja (#F9703E) 
            - animate-zoom-in-elastic: Efecto de rebote al entrar.
            - rotate-[-3deg]: La inclinación ligera que pediste.
        */}
        <div className="w-32 h-32 bg-[#F9703E] rounded-3xl shadow-[0_0_30px_rgba(249,112,62,0.5)] flex items-center justify-center transform rotate-[-3deg] animate-zoom-in-elastic relative overflow-hidden">
          
          {/* Brillo decorativo en la esquina superior derecha */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 blur-xl rounded-full transform translate-x-1/2 -translate-y-1/2"></div>

          {/* Las letras "ha" en el centro */}
          <span className="text-[#F0F4F8] font-black text-6xl tracking-tighter leading-none drop-shadow-lg relative z-10 select-none">
            ha
          </span>
        </div>
             
         {/* Sombra/Reflejo debajo del logo para dar profundidad (aparece con retraso) */}
         <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-black/20 blur-md rounded-full animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}></div>
      </div>
    </div>
  );
};

export default SplashScreen;