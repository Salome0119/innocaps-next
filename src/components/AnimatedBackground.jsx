'use client';

// Pure CSS animated background — no framer-motion needed

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      
      {/* --- BLOB 1: Verde/Turquesa (Superior Izquierda) --- */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full top-[-200px] left-[-200px]"
        style={{
          background: 'radial-gradient(circle, rgba(45, 212, 190, 1) 0%, rgba(16, 185, 129, 0.3) 60%, transparent 70%)',
          filter: 'blur(90px)',
          mixBlendMode: 'screen',
          animation: 'blob-1 12s ease-in-out infinite alternate',
          willChange: 'transform',
        }}
      />

      {/* --- BLOB 2: Morado/Azul (Inferior Derecha) --- */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full bottom-[-150px] right-[-150px]"
        style={{
          background: 'radial-gradient(circle, rgba(138, 92, 246, 0.95) 0%, rgba(59, 130, 246, 0.25) 60%, transparent 70%)',
          filter: 'blur(100px)',
          mixBlendMode: 'screen',
          animation: 'blob-2 15s ease-in-out 2s infinite alternate',
          willChange: 'transform',
        }}
      />

    </div>
  );
}