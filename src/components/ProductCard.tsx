import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { ShoppingCart, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  sizes: string[];
  isComingSoon?: boolean;
  onBuy?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  description,
  images,
  sizes,
  isComingSoon,
  onBuy,
}) => {
  if (isComingSoon) {
    return (
      <motion.div
        id="coming-soon-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, scale: 1.01 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <GlassCard className="group relative flex aspect-[4/5] flex-col items-center justify-center border-dashed border-black/10 bg-black/[0.02] p-10 text-center transition-all duration-500 hover:bg-black/[0.04] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-black/20">
          <motion.div
            initial={{ scale: 0.9 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-black/5 text-6xl font-black text-zinc-300"
          >
            ?
          </motion.div>
          <h3 id={`coming-soon-title-${id}`} className="text-2xl font-black chrome-text uppercase italic tracking-tighter">
            COMING SOON
          </h3>
          <p id={`coming-soon-subtitle-${id}`} className="mt-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
            HELL TEC STUDIOS
          </p>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      id={`product-card-${id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard className="group relative flex h-full flex-col overflow-hidden p-0 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:border-black/10">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            id={`product-image-${id}`}
            src={images[0] || "https://picsum.photos/seed/clothing/800/1000"}
            alt={name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          
          <button
            id={`view-details-${id}`}
            className="absolute top-4 right-4 rounded-full bg-black/10 p-2 chrome-text backdrop-blur-md transition-all hover:bg-black hover:text-white"
          >
            <ArrowUpRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 id={`product-name-${id}`} className="text-2xl font-black chrome-text uppercase italic tracking-tighter">
                {name}
              </h3>
              <p id={`product-brand-${id}`} className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                HELL TEC STUDIOS
              </p>
            </div>
            <span id={`product-price-${id}`} className="text-xl font-bold chrome-text">
              ${price}
            </span>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {sizes.map((size) => (
              <span
                key={size}
                className="rounded-lg border border-black/10 bg-black/5 px-3 py-1 text-[10px] font-bold text-zinc-500 transition-colors hover:border-black/30 chrome-text"
              >
                {size}
              </span>
            ))}
          </div>

          <button
            id={`buy-button-${id}`}
            onClick={onBuy}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl chrome-bg py-4 font-bold text-white opacity-0 translate-y-2 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto active:scale-[0.98]"
          >
            <ShoppingCart className="h-5 w-5" />
            BUY NOW
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
};
