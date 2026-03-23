import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductCard } from './ProductCard';
import { GlassCard } from './GlassCard';
import { RotatingLogo } from './RotatingLogo';
import { ShoppingCart, X, CreditCard, Mail, CheckCircle2, User, Hash, Lock, Phone, ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  sizes: string[];
  isComingSoon?: boolean;
}

interface StoreProps {
  products: Product[];
  settings: {
    etransferEmail: string;
    showComingSoonBox: boolean;
    brandName: string;
    brandSubtitle: string;
    isLocked: boolean;
    lockMessage: string;
    successTitle: string;
    successSubtitle: string;
  };
  onJoinMembership: (phone: string) => Promise<void>;
}

export const Store: React.FC<StoreProps> = ({ products, settings, onJoinMembership }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [email, setEmail] = useState('');
  const [hasConfirmedPayment, setHasConfirmedPayment] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [enteredOrderNumber, setEnteredOrderNumber] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (memberPhone.length >= 10) {
      setIsJoining(true);
      await onJoinMembership(memberPhone);
      setIsJoining(false);
      setHasJoined(true);
      setMemberPhone('');
    }
  };

  const handleBuy = (product: Product) => {
    const randomOrderNum = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderNumber(randomOrderNum);
    setEnteredOrderNumber('');
    setSelectedProduct(product);
    setIsCheckingOut(true);
  };

  const handleCompleteOrder = () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    if (enteredOrderNumber !== orderNumber) {
      alert('Please enter the correct order number to verify you have noted it down.');
      return;
    }
    if (!hasConfirmedPayment) {
      alert('Please confirm that you have sent the e-transfer payment.');
      return;
    }
    setIsOrderComplete(true);
    setTimeout(() => {
      setIsOrderComplete(false);
      setIsCheckingOut(false);
      setSelectedProduct(null);
      setEmail('');
      setHasConfirmedPayment(false);
      setOrderNumber('');
      setEnteredOrderNumber('');
    }, 4000);
  };

  return (
    <div id="store-container" className="min-h-screen p-6 md:p-12">
      <header className="mb-16 flex flex-col items-center justify-center text-center">
        <RotatingLogo
          id="store-title"
          text={settings.brandName}
          className="text-7xl font-black italic tracking-tighter chrome-text uppercase md:text-9xl"
        />
        <motion.div
          id="store-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 flex items-center gap-4 text-sm font-medium uppercase tracking-[0.4em] text-zinc-500"
        >
          <div className="h-[1px] w-12 bg-zinc-300" />
          {settings.brandSubtitle}
          <div className="h-[1px] w-12 bg-zinc-300" />
        </motion.div>
      </header>

      {settings.isLocked ? (
        <div className="flex flex-col items-center gap-12">
          <motion.div
            id="locked-store-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/5 p-12 text-center backdrop-blur-md"
          >
            <div className="mb-6 rounded-full bg-red-500 p-4 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-black chrome-text uppercase italic tracking-tighter">
              {settings.lockMessage}
            </h2>
            <p className="mt-4 text-sm font-medium text-zinc-500 uppercase tracking-widest">
              {settings.brandName} {settings.brandSubtitle} IS TEMPORARILY CLOSED.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-md"
          >
            <GlassCard className="p-8 text-center">
              {!hasJoined ? (
                <>
                  <h3 className="mb-2 text-xl font-black chrome-text uppercase italic tracking-tighter">
                    STILL WANT TO JOIN THE FAMILY?
                  </h3>
                  <p className="mb-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    BECOME A MEMBER FOR EXCLUSIVE DROPS
                  </p>
                  <form onSubmit={handleJoin} className="space-y-4">
                    <div className="relative">
                      <Phone className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="tel"
                        placeholder="ENTER PHONE NUMBER"
                        value={memberPhone}
                        onChange={(e) => setMemberPhone(e.target.value)}
                        className="w-full rounded-xl border border-black/5 bg-black/5 py-4 pl-12 pr-4 chrome-text placeholder:text-zinc-400 focus:border-black/10 focus:outline-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isJoining}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl chrome-bg py-4 font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {isJoining ? 'JOINING...' : 'BECOME A MEMBER'}
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-4">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-black p-3">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black chrome-text uppercase italic tracking-tighter">
                    {settings.successTitle}
                  </h3>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    {settings.successSubtitle}
                  </p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      ) : (
        <div id="product-grid" className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onBuy={() => handleBuy(product)}
            />
          ))}

          {settings.showComingSoonBox && (
            <ProductCard
              id="coming-soon"
              name="COMING SOON"
              price={0}
              description="Next drop coming soon."
              images={[]}
              sizes={[]}
              isComingSoon={true}
            />
          )}
        </div>
      )}

      <AnimatePresence>
        {isCheckingOut && selectedProduct && (
          <motion.div
            id="checkout-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 p-6 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg"
            >
              <GlassCard className="relative p-10">
                <button
                  id="close-checkout"
                  onClick={() => setIsCheckingOut(false)}
                  className="absolute top-6 right-6 text-zinc-500 transition-colors hover:text-black"
                >
                  <X className="h-6 w-6" />
                </button>

                {!isOrderComplete ? (
                  <>
                    <div className="mb-8 flex items-center gap-6">
                      <div className="h-24 w-24 overflow-hidden rounded-2xl bg-zinc-100">
                        <img
                          id="checkout-product-image"
                          src={selectedProduct.images[0] || "https://picsum.photos/seed/clothing/200/200"}
                          alt={selectedProduct.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 id="checkout-product-name" className="text-2xl font-black chrome-text uppercase italic tracking-tighter">
                          {selectedProduct.name}
                        </h3>
                        <p id="checkout-product-price" className="text-lg font-bold text-zinc-500">
                          ${selectedProduct.price}
                        </p>
                      </div>
                    </div>

                    <div className="mb-8 space-y-6">
                      <div className="rounded-2xl border border-black/5 bg-black/5 p-6">
                        <div className="mb-4 flex items-center gap-3 chrome-text">
                          <Hash className="h-5 w-5 text-zinc-400" />
                          <span className="font-bold uppercase tracking-widest text-xs">ORDER NUMBER</span>
                        </div>
                        <div className="mb-4 flex items-center justify-between rounded-xl bg-black/5 p-4 border border-black/5">
                          <span className="text-2xl font-black chrome-text tracking-[0.2em]">{orderNumber}</span>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">SAVE THIS</span>
                        </div>
                        <input
                          id="checkout-order-number"
                          type="text"
                          placeholder="ENTER ORDER # TO VERIFY"
                          value={enteredOrderNumber}
                          onChange={(e) => setEnteredOrderNumber(e.target.value)}
                          className="w-full rounded-xl border border-black/5 bg-black/5 p-4 chrome-text placeholder:text-zinc-400 focus:border-black/10 focus:outline-none text-center font-black tracking-[0.2em]"
                          required
                        />
                        <p className="mt-4 text-[10px] uppercase tracking-widest text-zinc-500 text-center">
                          YOU MUST INCLUDE THIS ORDER # IN YOUR E-TRANSFER MESSAGE
                        </p>
                      </div>

                      <div className="rounded-2xl border border-black/5 bg-black/5 p-6">
                        <div className="mb-4 flex items-center gap-3 chrome-text">
                          <User className="h-5 w-5 text-zinc-400" />
                          <span className="font-bold uppercase tracking-widest text-xs">CONTACT EMAIL</span>
                        </div>
                        <input
                          id="checkout-email"
                          type="email"
                          placeholder="YOUR@EMAIL.COM"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-black/5 bg-black/5 p-4 chrome-text placeholder:text-zinc-400 focus:border-black/10 focus:outline-none"
                          required
                        />
                      </div>

                      <div className="rounded-2xl border border-black/5 bg-black/5 p-6">
                        <div className="mb-4 flex items-center gap-3 chrome-text">
                          <CreditCard className="h-5 w-5 text-zinc-400" />
                          <span className="font-bold uppercase tracking-widest text-xs">PAYMENT METHOD</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-zinc-600">INTERAC E-TRANSFER</span>
                          <div className="rounded-full bg-black/10 px-3 py-1 text-[10px] font-bold chrome-text">ACTIVE</div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-black/5 bg-black/5 p-6">
                        <div className="mb-4 flex items-center gap-3 chrome-text">
                          <Mail className="h-5 w-5 text-zinc-400" />
                          <span className="font-bold uppercase tracking-widest text-xs">SEND PAYMENT TO</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span id="etransfer-email" className="text-sm font-bold chrome-text select-all">
                            {settings.etransferEmail || "PAYMENTS@HELLTEC.STUDIOS"}
                          </span>
                          <button className="text-[10px] font-bold text-zinc-500 uppercase hover:chrome-text">COPY</button>
                        </div>
                        <p className="mt-4 text-[10px] uppercase tracking-widest text-zinc-500">
                          PLEASE INCLUDE YOUR ORDER # IN THE MESSAGE
                        </p>
                      </div>

                      <div className="flex flex-col gap-4 px-2">
                        <label className="flex cursor-pointer items-start gap-3 group">
                          <div className="relative mt-1">
                            <input
                              type="checkbox"
                              checked={hasConfirmedPayment}
                              onChange={(e) => setHasConfirmedPayment(e.target.checked)}
                              className="peer sr-only"
                            />
                            <div className="h-5 w-5 rounded border border-black/10 bg-black/5 transition-all peer-checked:bg-black peer-checked:border-black" />
                            <CheckCircle2 className="absolute inset-0 h-5 w-5 scale-0 text-white transition-transform peer-checked:scale-100" />
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-700 transition-colors">
                            I CONFIRM THAT I HAVE SENT THE E-TRANSFER PAYMENT
                          </span>
                        </label>

                        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 leading-relaxed">
                            WARNING: ORDERS WILL NOT BE PROCESSED OR SHIPPED UNTIL THE E-TRANSFER PAYMENT IS VERIFIED.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      id="complete-order-button"
                      onClick={handleCompleteOrder}
                      disabled={!hasConfirmedPayment || !email.includes('@') || enteredOrderNumber !== orderNumber}
                      className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold transition-all active:scale-[0.98] ${
                        hasConfirmedPayment && email.includes('@') && enteredOrderNumber === orderNumber
                          ? "chrome-bg text-white"
                          : "bg-black/5 text-zinc-400 cursor-not-allowed"
                      }`}
                    >
                      I HAVE SENT THE PAYMENT
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center py-10 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12, stiffness: 200 }}
                      className="mb-6 rounded-full bg-black p-4"
                    >
                      <CheckCircle2 className="h-12 w-12 text-white" />
                    </motion.div>
                    <h2 id="order-complete-title" className="text-3xl font-black chrome-text uppercase italic tracking-tighter">
                      ORDER PENDING
                    </h2>
                    <p id="order-complete-subtitle" className="mt-4 max-w-xs text-sm font-medium text-zinc-500 uppercase tracking-widest leading-relaxed">
                      WE WILL VERIFY YOUR E-TRANSFER AND SEND A CONFIRMATION TEXT SHORTLY.
                    </p>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
