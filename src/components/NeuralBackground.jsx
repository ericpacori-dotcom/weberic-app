// src/components/NeuralBackground.jsx
import React, { useRef, useEffect, memo } from 'react';

// --- FONDO NEURONAL (OPTIMIZADO E INTOCABLE) --- 
const NeuralBackground = memo(() => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    // CORRECCIÓN: Fondo transparente mantenido
    const ctx = canvas.getContext('2d'); 
    let animationFrameId;
    let particles = [];
    
    // Detección de móvil para rendimiento
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 25 : 60; 
    const connectionDistance = isMobile ? 100 : 160; 
    const moveSpeed = 0.4; 

    const resizeCanvas = () => { 
        canvas.width = window.innerWidth; 
        canvas.height = window.innerHeight; 
        initParticles(); 
    };
    
    window.addEventListener('resize', resizeCanvas); 
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width; 
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * moveSpeed; 
        this.vy = (Math.random() - 0.5) * moveSpeed;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() { 
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); 
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; 
        ctx.fill(); 
      }
    }

    const initParticles = () => {
        particles = [];
        for (let i = 0; i < particleCount; i++) { 
            particles.push(new Particle()); 
        }
    };

    resizeCanvas(); 
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.update(); 
        particle.draw();
        
        for (let j = index; j < particles.length; j++) {
          const dx = particles[j].x - particle.x; 
          const dy = particles[j].y - particle.y;
          
          if (dx > connectionDistance || dx < -connectionDistance || dy > connectionDistance || dy < -connectionDistance) continue;

          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < connectionDistance) { 
            ctx.beginPath(); 
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * (1 - distance / connectionDistance)})`; 
            ctx.lineWidth = 0.8; 
            ctx.moveTo(particle.x, particle.y); 
            ctx.lineTo(particles[j].x, particles[j].y); 
            ctx.stroke(); 
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => { 
        window.removeEventListener('resize', resizeCanvas); 
        cancelAnimationFrame(animationFrameId); 
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'transparent' }} />;
}, () => true);

export default NeuralBackground;