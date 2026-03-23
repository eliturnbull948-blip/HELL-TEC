import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'motion/react';

interface RotatingLogoProps {
  text: string;
  className?: string;
  id?: string;
}

export const RotatingLogo: React.FC<RotatingLogoProps> = ({ text, className, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const rotateX = useSpring(0, { stiffness: 100, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 100, damping: 30 });
  const rotateZ = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsPressed(false);
      rotateX.set(0);
      rotateY.set(0);
      rotateZ.set(0);
    };

    if (isPressed) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isPressed, rotateX, rotateY, rotateZ]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isPressed) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate rotation based on distance from center
    // Max rotation of 30 degrees
    const factor = 45; // Increased factor for more dramatic effect when clicking
    const rotY = (mouseX / (rect.width / 2)) * factor;
    const rotX = -(mouseY / (rect.height / 2)) * factor;

    // Calculate angle for Z rotation
    const angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
    
    rotateX.set(rotX);
    rotateY.set(rotY);
    rotateZ.set(angle);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="perspective-1000 inline-block cursor-grab active:cursor-grabbing select-none"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          rotateZ,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.h1
          id={id}
          className={className}
        >
          {text}
        </motion.h1>
      </motion.div>
    </motion.div>
  );
};
