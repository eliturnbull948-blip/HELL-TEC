import React from 'react';
import { cn } from '../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, id }) => {
  return (
    <div
      id={id}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-black/5 bg-white/40 p-6 backdrop-blur-2xl shadow-xl",
        className
      )}
    >
      {/* Subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
