import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { Plus, X, Save, Trash2, Settings, Package, Image as ImageIcon, CheckCircle2, Lock, Unlock } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  sizes: string[];
  isComingSoon?: boolean;
}

interface AdminPanelProps {
  products: Product[];
  settings: {
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
  };
  members: any[];
  onSaveProduct: (product: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateSettings: (settings: any) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  settings,
  members,
  onSaveProduct,
  onDeleteProduct,
  onUpdateSettings,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [managingImagesProduct, setManagingImagesProduct] = useState<Product | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddProduct = () => {
    setEditingProduct({
      name: '',
      price: 0,
      description: '',
      images: [],
      sizes: ['S', 'M', 'L', 'XL'],
      isComingSoon: false,
    });
  };

  const handleSave = async () => {
    if (editingProduct) {
      setIsSaving(true);
      await onSaveProduct(editingProduct);
      setIsSaving(false);
      setEditingProduct(null);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    // In a real app, we'd upload these to Firebase Storage
    // For now, we'll use object URLs as placeholders
    const newImages = acceptedFiles.map(file => URL.createObjectURL(file));
    setEditingProduct(prev => ({
      ...prev,
      images: [...(prev?.images || []), ...newImages]
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop } as any);

  return (
    <motion.div
      id="admin-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 p-6 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="h-full w-full max-w-5xl overflow-hidden"
      >
        <GlassCard className="flex h-full flex-col p-0 bg-white/90 border-black/5">
          <div className="flex items-center justify-between border-b border-black/5 p-6">
            <div className="flex items-center gap-8">
              <h2 id="admin-title" className="text-2xl font-black chrome-text uppercase italic tracking-tighter">
                HELL TEC ADMIN
              </h2>
              <nav className="flex gap-4">
                <button
                  id="tab-products"
                  onClick={() => setActiveTab('products')}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === 'products' ? 'bg-black text-white' : 'text-zinc-500 hover:text-black'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  PRODUCTS
                </button>
                <button
                  id="tab-members"
                  onClick={() => setActiveTab('members' as any)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === ('members' as any) ? 'bg-black text-white' : 'text-zinc-500 hover:text-black'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  MEMBERS
                </button>
                <button
                  id="tab-settings"
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === 'settings' ? 'bg-black text-white' : 'text-zinc-500 hover:text-black'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  SETTINGS
                </button>
              </nav>
            </div>
            <button
              id="close-admin"
              onClick={onClose}
              className="rounded-full bg-black/5 p-2 text-zinc-500 transition-colors hover:bg-black/10 hover:text-black"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === 'products' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">MANAGE INVENTORY</h3>
                  <button
                    id="add-product-button"
                    onClick={handleAddProduct}
                    className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-zinc-200"
                  >
                    <Plus className="h-4 w-4" />
                    ADD PRODUCT
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="group relative rounded-2xl border border-black/5 bg-black/5 p-4 transition-all hover:border-black/10 hover:bg-black/[0.08]"
                    >
                      <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-zinc-100 relative">
                        <img
                          src={product.images[0] || "https://picsum.photos/seed/clothing/200/200"}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                        {product.isComingSoon && (
                          <div className="absolute top-2 left-2 rounded-lg bg-black px-2 py-1 text-[8px] font-black text-white uppercase tracking-widest">
                            COMING SOON
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold chrome-text uppercase italic tracking-tighter">{product.name}</h4>
                      <p className="text-xs font-bold text-zinc-500">${product.price}</p>
                      
                      <div className="mt-4 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="flex-1 rounded-lg bg-black/5 py-2 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-black/10"
                          >
                            EDIT INFO
                          </button>
                          <button
                            onClick={() => setManagingImagesProduct(product)}
                            className="flex-1 rounded-lg bg-black/5 py-2 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-black/10"
                          >
                            IMAGES
                          </button>
                        </div>
                        <button
                          onClick={() => onDeleteProduct(product.id)}
                          className="w-full rounded-lg bg-red-500/10 py-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/20"
                        >
                          DELETE PRODUCT
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === ('members' as any) ? (
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">MEMBERSHIP LEADS</h3>
                <div className="rounded-2xl border border-black/5 bg-black/5 overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-black/5 bg-black/5">
                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">PHONE NUMBER</th>
                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">JOINED AT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.length > 0 ? members.map((member) => (
                        <tr key={member.id} className="border-b border-black/5">
                          <td className="p-4 text-sm chrome-text">{member.phoneNumber}</td>
                          <td className="p-4 text-sm text-zinc-500">
                            {member.joinedAt?.toDate ? member.joinedAt.toDate().toLocaleString() : 'JUST NOW'}
                          </td>
                        </tr>
                      )) : (
                        <tr className="border-b border-black/5">
                          <td colSpan={2} className="p-8 text-center text-sm text-zinc-600 uppercase tracking-widest">
                            NO MEMBERS YET
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="max-w-xl space-y-12">
                <div>
                  <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">STORE CONFIGURATION</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">E-TRANSFER EMAIL</label>
                      <input
                        id="settings-email"
                        type="email"
                        value={settings.etransferEmail}
                        onChange={(e) => onUpdateSettings({ ...settings, etransferEmail: e.target.value })}
                        className="w-full rounded-xl border border-black/5 bg-black/5 p-4 text-black focus:border-black/10 focus:outline-none"
                        placeholder="payments@helltec.studios"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-black/5 p-6">
                      <div>
                        <h4 className="font-bold chrome-text uppercase tracking-widest text-xs">COMING SOON BOX</h4>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">SHOW PLACEHOLDER IN STORE</p>
                      </div>
                      <button
                        id="toggle-coming-soon"
                        onClick={() => onUpdateSettings({ ...settings, showComingSoonBox: !settings.showComingSoonBox })}
                        className={`h-6 w-12 rounded-full transition-all ${
                          settings.showComingSoonBox ? 'bg-black' : 'bg-zinc-200'
                        }`}
                      >
                        <div className={`h-4 w-4 rounded-full transition-all ${
                          settings.showComingSoonBox ? 'ml-7 bg-white' : 'ml-1 bg-zinc-400'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                      <div className="flex items-center gap-4">
                        <div className={`rounded-full p-2 ${settings.isLocked ? 'bg-red-500 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                          {settings.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </div>
                        <div>
                          <h4 className="font-bold chrome-text uppercase tracking-widest text-xs">LOCK STORE</h4>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">PREVENT ALL PURCHASES</p>
                        </div>
                      </div>
                      <button
                        id="toggle-lock-store"
                        onClick={() => onUpdateSettings({ ...settings, isLocked: !settings.isLocked })}
                        className={`h-6 w-12 rounded-full transition-all ${
                          settings.isLocked ? 'bg-red-500' : 'bg-zinc-200'
                        }`}
                      >
                        <div className={`h-4 w-4 rounded-full transition-all ${
                          settings.isLocked ? 'ml-7 bg-white' : 'ml-1 bg-zinc-400'
                        }`} />
                      </button>
                    </div>

                    {settings.isLocked && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">LOCK MESSAGE</label>
                        <input
                          id="settings-lock-message"
                          type="text"
                          value={settings.lockMessage}
                          onChange={(e) => onUpdateSettings({ ...settings, lockMessage: e.target.value })}
                          className="w-full rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-white focus:border-red-500/40 focus:outline-none"
                          placeholder="STORE IS NOW LOCKED"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">BRANDING & TEXT</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">STORE NAME</label>
                        <input
                          type="text"
                          value={settings.brandName}
                          onChange={(e) => onUpdateSettings({ ...settings, brandName: e.target.value })}
                          className="w-full rounded-xl border border-black/5 bg-black/5 p-4 text-black focus:border-black/10 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">STORE SUBTITLE</label>
                        <input
                          type="text"
                          value={settings.brandSubtitle}
                          onChange={(e) => onUpdateSettings({ ...settings, brandSubtitle: e.target.value })}
                          className="w-full rounded-xl border border-black/5 bg-black/5 p-4 text-black focus:border-black/10 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">LANDING TITLE</label>
                        <input
                          type="text"
                          value={settings.landingTitle}
                          onChange={(e) => onUpdateSettings({ ...settings, landingTitle: e.target.value })}
                          className="w-full rounded-xl border border-black/5 bg-black/5 p-4 text-black focus:border-black/10 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">LANDING SUBTITLE</label>
                        <input
                          type="text"
                          value={settings.landingSubtitle}
                          onChange={(e) => onUpdateSettings({ ...settings, landingSubtitle: e.target.value })}
                          className="w-full rounded-xl border border-black/5 bg-black/5 p-4 text-black focus:border-black/10 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">SUCCESS TITLE</label>
                        <input
                          type="text"
                          value={settings.successTitle}
                          onChange={(e) => onUpdateSettings({ ...settings, successTitle: e.target.value })}
                          className="w-full rounded-xl border border-black/5 bg-black/5 p-4 text-black focus:border-black/10 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">SUCCESS SUBTITLE</label>
                        <input
                          type="text"
                          value={settings.successSubtitle}
                          onChange={(e) => onUpdateSettings({ ...settings, successSubtitle: e.target.value })}
                          className="w-full rounded-xl border border-black/5 bg-black/5 p-4 text-black focus:border-black/10 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        <AnimatePresence>
          {managingImagesProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-6 backdrop-blur-3xl"
            >
              <GlassCard className="w-full max-w-2xl p-8">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                      MANAGE IMAGES
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      {managingImagesProduct.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setManagingImagesProduct(null)}
                    className="text-zinc-500 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">ADD IMAGE BY URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4 text-white focus:border-white/20 focus:outline-none"
                      />
                      <button
                        onClick={async () => {
                          if (!imageUrlInput) return;
                          const updatedImages = [...managingImagesProduct.images, imageUrlInput];
                          await onSaveProduct({ ...managingImagesProduct, images: updatedImages });
                          setManagingImagesProduct({ ...managingImagesProduct, images: updatedImages });
                          setImageUrlInput('');
                        }}
                        className="rounded-xl bg-white px-6 font-bold text-black hover:bg-zinc-200"
                      >
                        ADD
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">UPLOAD IMAGES</label>
                    <div
                      {...getRootProps()}
                      className={`flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
                        isDragActive ? 'border-white bg-white/10' : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <ImageIcon className="mb-2 h-8 w-8 text-zinc-600" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">DRAG & DROP OR CLICK</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {managingImagesProduct.images.map((img, i) => (
                      <div key={i} className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-900 border border-white/10">
                        <img src={img} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        <button
                          onClick={async () => {
                            const updatedImages = managingImagesProduct.images.filter((_, idx) => idx !== i);
                            await onSaveProduct({ ...managingImagesProduct, images: updatedImages });
                            setManagingImagesProduct({ ...managingImagesProduct, images: updatedImages });
                          }}
                          className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setManagingImagesProduct(null)}
                  className="mt-8 w-full rounded-2xl border border-white/10 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/5"
                >
                  DONE
                </button>
              </GlassCard>
            </motion.div>
          )}

          {editingProduct && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed inset-y-0 right-0 z-[110] w-full max-w-md bg-white p-8 shadow-2xl backdrop-blur-3xl"
            >
              <div className="flex h-full flex-col">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-xl font-black chrome-text uppercase italic tracking-tighter">
                    {editingProduct.id ? 'EDIT PRODUCT' : 'NEW PRODUCT'}
                  </h3>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="text-zinc-500 hover:text-black"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">PRODUCT NAME</label>
                    <input
                      id="edit-name"
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full rounded-xl border border-black/5 bg-black/5 p-4 text-black focus:border-black/10 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">PRICE ($)</label>
                    <input
                      id="edit-price"
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full rounded-xl border border-black/5 bg-black/5 p-4 text-black focus:border-black/10 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">DESCRIPTION</label>
                    <textarea
                      id="edit-description"
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      rows={4}
                      className="w-full rounded-xl border border-black/5 bg-black/5 p-4 text-black focus:border-black/10 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">IMAGES</label>
                    <div
                      {...getRootProps()}
                      className={`flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
                        isDragActive ? 'border-black bg-black/5' : 'border-black/5 bg-black/[0.02]'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <ImageIcon className="mb-2 h-8 w-8 text-zinc-400" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">DRAG & DROP OR CLICK</p>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {editingProduct.images?.map((img, i) => (
                        <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100">
                          <img src={img} alt="" className="h-full w-full object-cover" />
                          <button
                            onClick={() => setEditingProduct({
                              ...editingProduct,
                              images: editingProduct.images?.filter((_, idx) => idx !== i)
                            })}
                            className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-black"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">SIZES (COMMA SEPARATED)</label>
                    <input
                      id="edit-sizes"
                      type="text"
                      value={editingProduct.sizes?.join(', ')}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sizes: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full rounded-xl border border-black/5 bg-black/5 p-4 text-black focus:border-black/10 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-black/5 p-6">
                    <div>
                      <h4 className="font-bold chrome-text uppercase tracking-widest text-xs">COMING SOON</h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">MARK AS COMING SOON</p>
                    </div>
                    <button
                      id="edit-is-coming-soon"
                      type="button"
                      onClick={() => setEditingProduct({ ...editingProduct, isComingSoon: !editingProduct.isComingSoon })}
                      className={`h-6 w-12 rounded-full transition-all ${
                        editingProduct.isComingSoon ? 'bg-black' : 'bg-zinc-200'
                      }`}
                    >
                      <div className={`h-4 w-4 rounded-full transition-all ${
                        editingProduct.isComingSoon ? 'ml-7 bg-white' : 'ml-1 bg-zinc-400'
                      }`} />
                    </button>
                  </div>
                </div>

                <button
                  id="save-product-button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-4 font-bold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSaving ? 'SAVING...' : (
                    <>
                      <Save className="h-5 w-5" />
                      SAVE PRODUCT
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
