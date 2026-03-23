/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Background } from './components/Background';
import { LandingPage } from './components/LandingPage';
import { Store } from './components/Store';
import { AdminPanel } from './components/AdminPanel';
import { Settings as SettingsIcon, LogIn } from 'lucide-react';
import { db, auth } from './firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  addDoc, 
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  sizes: string[];
  isComingSoon?: boolean;
}

interface AppSettings {
  etransferEmail: string;
  showComingSoonBox: boolean;
  brandName: string;
  brandSubtitle: string;
  landingTitle: string;
  landingSubtitle: string;
  successTitle: string;
  successSubtitle: string;
  isLocked: boolean;
  lockMessage: string;
}

export default function App() {
  const [isMember, setIsMember] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    etransferEmail: 'PAYMENTS@HELLTEC.STUDIOS',
    showComingSoonBox: true,
    brandName: 'HELL TEC',
    brandSubtitle: 'STUDIOS',
    landingTitle: 'HELL TEC',
    landingSubtitle: 'STUDIOS',
    successTitle: 'WELCOME TO THE FAMILY',
    successSubtitle: 'ACCESSING HELL TEC STUDIOS...',
    isLocked: false,
    lockMessage: 'STORE IS NOW LOCKED',
  });
  const [members, setMembers] = useState<any[]>([]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Listeners
  useEffect(() => {
    if (!isAuthReady) return;

    // Products Listener
    const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      if (snapshot.empty && user?.email === 'eliturnbull948@gmail.com') {
        // Add a default product for the owner to edit
        addDoc(collection(db, 'products'), {
          name: 'HELL TEC CORE HOODIE',
          price: 85,
          description: 'Heavyweight oversized hoodie with reflective logo.',
          images: ['https://picsum.photos/seed/hoodie/800/1000'],
          sizes: ['S', 'M', 'L', 'XL'],
          createdAt: serverTimestamp()
        });
      }
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    }, (error) => {
      console.error("Firestore Products Error:", error);
    });

    // Settings Listener
    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as AppSettings);
      } else if (user?.email === 'eliturnbull948@gmail.com') {
        // Initialize default settings
        setDoc(doc(db, 'settings', 'global'), {
          etransferEmail: 'PAYMENTS@HELLTEC.STUDIOS',
          showComingSoonBox: true,
          brandName: 'HELL TEC',
          brandSubtitle: 'STUDIOS',
          landingTitle: 'HELL TEC',
          landingSubtitle: 'STUDIOS',
          successTitle: 'WELCOME TO THE FAMILY',
          successSubtitle: 'ACCESSING HELL TEC STUDIOS...',
          isLocked: false,
          lockMessage: 'STORE IS NOW LOCKED',
        });
      }
    });

    // Members Listener (Admin Only)
    let unsubscribeMembers = () => {};
    if (user?.email === 'eliturnbull948@gmail.com') {
      unsubscribeMembers = onSnapshot(collection(db, 'members'), (snapshot) => {
        setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    }

    return () => {
      unsubscribeProducts();
      unsubscribeSettings();
      unsubscribeMembers();
    };
  }, [isAuthReady, user]);

  const handleMembership = async (phone: string) => {
    try {
      await addDoc(collection(db, 'members'), {
        phoneNumber: phone,
        joinedAt: serverTimestamp()
      });
      setIsMember(true);
      localStorage.setItem('helltec_member', 'true');
    } catch (error) {
      console.error("Error joining membership:", error);
    }
  };

  useEffect(() => {
    const savedMember = localStorage.getItem('helltec_member');
    if (savedMember === 'true') {
      setIsMember(true);
    }
  }, []);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount + 1 >= 5) {
      if (!user) {
        handleLogin();
      } else {
        setShowAdmin(true);
      }
      setClickCount(0);
    }
    setTimeout(() => setClickCount(0), 2000);
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const saveProduct = async (product: Partial<Product>) => {
    try {
      const { id, ...rest } = product;
      const productData: any = {
        ...rest,
      };
      
      if (!id) {
        productData.createdAt = serverTimestamp();
      }
      
      // Clean up undefined values
      Object.keys(productData).forEach(key => {
        if (productData[key] === undefined) {
          delete productData[key];
        }
      });

      if (id) {
        await setDoc(doc(db, 'products', id), productData, { merge: true });
      } else {
        await addDoc(collection(db, 'products'), productData);
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const updateSettings = async (newSettings: AppSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'global'), newSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const isAdmin = user?.email === 'eliturnbull948@gmail.com';

  return (
    <div className="relative min-h-screen chrome-marble selection:bg-black selection:text-white">
      <Background />
      
      <AnimatePresence mode="wait">
        {!isMember ? (
          <LandingPage 
            key="landing" 
            onComplete={handleMembership} 
            settings={settings}
          />
        ) : (
          <motion.main
            key="store"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Store 
              products={products} 
              settings={settings} 
              onJoinMembership={handleMembership}
            />
            
            {/* Hidden Admin Trigger */}
            <div 
              id="admin-trigger"
              onClick={handleLogoClick}
              className="fixed top-0 left-1/2 h-20 w-40 -translate-x-1/2 cursor-default z-50"
            />
            
            {/* Admin Toggle Button */}
            {isAdmin && (
              <button
                id="admin-toggle"
                onClick={() => setShowAdmin(true)}
                className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-zinc-600 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
              >
                <SettingsIcon className="h-5 w-5" />
              </button>
            )}

            {!user && (
              <button
                id="login-trigger"
                onClick={handleLogin}
                className="fixed bottom-6 left-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-zinc-600 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
              >
                <LogIn className="h-5 w-5" />
              </button>
            )}
          </motion.main>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdmin && isAdmin && (
          <AdminPanel
            products={products}
            settings={settings}
            members={members}
            onSaveProduct={saveProduct}
            onDeleteProduct={deleteProduct}
            onUpdateSettings={updateSettings}
            onClose={() => setShowAdmin(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

