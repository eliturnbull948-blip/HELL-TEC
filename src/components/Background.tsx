import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export const Background: React.FC = () => {
  return (
    <div id="background-container" className="fixed inset-0 -z-10 overflow-hidden chrome-marble">
      {/* Animated Gradient Background */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #e5e7eb 50%, #d1d5db 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientMove 15s ease infinite alternate'
        }}
      />
      
      {/* Dynamic Floating Orbs for extra depth */}
      <motion.div
        id="orb-1"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-[10%] -left-[10%] h-[60%] w-[60%] rounded-full bg-zinc-200/50 blur-[100px]"
      />
      <motion.div
        id="orb-2"
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 120, -40, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-[10%] -right-[10%] h-[70%] w-[70%] rounded-full bg-zinc-300/40 blur-[120px]"
      />
      
      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />

      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
      `}</style>
    </div>
  );
};
