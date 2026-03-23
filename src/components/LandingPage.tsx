import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { RotatingLogo } from './RotatingLogo';
import { Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onComplete: (phoneNumber: string) => void;
  settings: {
    landingTitle: string;
    landingSubtitle: string;
    successTitle: string;
    successSubtitle: string;
    isLocked?: boolean;
    lockMessage?: string;
  };
}

export const LandingPage: React.FC<LandingPageProps> = ({ onComplete, settings }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setIsSubmitted(true);
      setTimeout(() => {
        onComplete(phoneNumber);
      }, 2000);
    }
  };

  return (
    <div id="landing-page" className="flex min-h-screen items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, blur: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard className="w-full max-w-md p-10 text-center">
              <RotatingLogo
                id="brand-title"
                text={settings.landingTitle}
                className="mb-2 font-sans text-5xl font-black tracking-tighter chrome-text uppercase italic"
              />
              <motion.p
                id="brand-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8 text-sm font-medium uppercase tracking-widest text-zinc-500"
              >
                {settings.landingSubtitle}
              </motion.p>

              {settings.isLocked && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center"
                >
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
                    {settings.lockMessage || "STORE IS CURRENTLY LOCKED"}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    WE ARE TEMPORARILY CLOSED FOR PURCHASES, BUT YOU CAN STILL JOIN THE FAMILY.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Phone className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                  <input
                    id="phone-input"
                    type="tel"
                    placeholder="ENTER PHONE NUMBER"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-2xl border border-black/5 bg-black/5 py-4 pl-12 pr-4 chrome-text placeholder:text-zinc-400 focus:border-black/20 focus:outline-none focus:ring-1 focus:ring-black/20"
                    required
                  />
                </div>
                <button
                  id="join-button"
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl chrome-bg py-4 font-bold text-white transition-all active:scale-[0.98]"
                >
                  BECOME A MEMBER
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
              
              <p className="mt-6 text-[10px] uppercase tracking-widest text-zinc-600">
                BY JOINING YOU AGREE TO EXCLUSIVE ACCESS
              </p>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mb-6 flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="rounded-full bg-black p-4"
              >
                <CheckCircle2 className="h-12 w-12 text-white" />
              </motion.div>
            </div>
            <h2 id="success-title" className="text-3xl font-black chrome-text uppercase italic tracking-tighter">
              {settings.successTitle}
            </h2>
            <p id="success-subtitle" className="mt-2 text-zinc-500 uppercase tracking-widest">
              {settings.successSubtitle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
