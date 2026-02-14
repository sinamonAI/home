
import React, { useEffect, useRef } from 'react';

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const characters = '01$₿¥€£📈📉'.split('');
    const fontSize = 16;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    // Grid pulse animation state
    let pulse = 0;

    const draw = (time: number) => {
      // Clear with slight trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Layer 1: Perspective Grid
      ctx.strokeStyle = `rgba(0, 209, 255, ${0.05 + Math.sin(time / 1000) * 0.02})`;
      ctx.lineWidth = 1;
      
      const horizon = canvas.height * 0.6;
      const numLines = 20;
      
      // Vertical lines from horizon
      for (let i = -numLines; i <= numLines; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 + i * 50, horizon);
        ctx.lineTo(canvas.width / 2 + i * 200, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines with perspective
      for (let i = 0; i < 10; i++) {
        const y = horizon + (i * i * (canvas.height - horizon) / 81);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Layer 2: Digital Rain
      ctx.fillStyle = '#00FF41';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        if (Math.random() > 0.95) { // Sparsity
          const text = characters[Math.floor(Math.random() * characters.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Glowing character
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00FF41';
          ctx.fillText(text, x, y);
          ctx.shadowBlur = 0;

          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black overflow-hidden">
        {/* Abstract Glow Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00FF41]/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00D1FF]/5 blur-[150px] rounded-full animate-pulse delay-700"></div>
        
        <canvas ref={canvasRef} className="opacity-40" />
    </div>
  );
};

export default MatrixBackground;
