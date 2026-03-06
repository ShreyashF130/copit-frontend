'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, ShieldCheck,AlignLeft, Zap, ArrowRight, Package, Loader2, Plus, Minus } from 'lucide-react'
import PublicHeader from '@/app/components/publicheader'
import { toast } from 'sonner'

// --- TYPES ---
type Variant = { title: string; price: number; stock: number; image: string; }
type Item = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string; 
  image_url: string;
  stock_count: number; 
  attributes?: { 
    specs?: { name: string; options: string[] }[]; 
    variants?: Variant[]; 
    has_complex_variants?: boolean; 
  };
}

export default function PublicProductPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  
  const shop_slug = (params?.slug || params?.shop_slug) as string
  const product_slug = params?.product_slug as string
  
  const ref = searchParams?.get('ref')
  const source = ref ? ref.toUpperCase() : 'DIRECT'

  // --- STATE DECLARATIONS ---
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [imgError, setImgError] = useState(false) 

  // 🚨 THE FIX: Variant & Quantity State
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const apiUrl = rawApiUrl.replace(/\/$/, '')

  // --- DATA FETCHING ---
  useEffect(() => {
    if (!shop_slug || !product_slug) return
    const fetchItem = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/storefront/${shop_slug}/products/${product_slug}`)
        if (!res.ok) throw new Error("Item not found")
        const json = await res.json()
        setData(json)
      } catch (e) {
        console.error("Fetch error:", e)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [shop_slug, product_slug, apiUrl])

  // --- COMPUTED STATE (The Engine) ---
  const item: Item | undefined = data?.item;
  const shop = data?.shop;
  const more_items = data?.more_items;

  // 1. Calculate Active Variant
  const activeVariant = useMemo(() => {
    const specs = item?.attributes?.specs;
    const variants = item?.attributes?.variants;
    
    if (!specs || !Array.isArray(specs) || specs.length === 0) return null;
    if (!variants || !Array.isArray(variants)) return null;

    const specValues = specs.map(s => selections[s.name]).filter(Boolean);
    if (specValues.length < specs.length) return null; 

    const targetTitle = specValues.join(' / ');
    return variants.find(v => v.title === targetTitle) || null;
  }, [item, selections])

  // 2. Resolve Dynamic Pricing and Stock
  const currentPrice = activeVariant ? activeVariant.price : item?.price || 0
  const currentStock = activeVariant ? activeVariant.stock : item?.stock_count || 0
  const isOutOfStock = currentStock <= 0

  // 3. Reset quantity if variant changes to prevent buying more than stock
  useEffect(() => {
      setQuantity(1)
  }, [activeVariant])

  // --- RENDER GUARDS ---
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8"/></div>
  if (error || !data) return <div className="min-h-screen flex items-center justify-center font-black text-2xl">Item Not Found</div>

  const storeLink = `/shop/${shop.slug}?ref=${source.toLowerCase()}` 
  
  // 🚨 THE FIX: Checkout Button Logic
  const hasSpecs = Array.isArray(item?.attributes?.specs) && item.attributes!.specs.length > 0;
  const needsSelection = hasSpecs && !activeVariant;
  const canCheckout = !isOutOfStock && !needsSelection;

  // --- WHATSAPP PAYLOAD GENERATION ---
  const variantText = activeVariant ? ` (${activeVariant.title})` : '';
  const totalPrice = currentPrice * quantity;
  const message = `Hi ${shop.name}! I want to buy:\n\n📦 *${item?.name}${variantText}*\n🔢 Quantity: ${quantity}\n💰 Total: ₹${totalPrice}\n🔗 Source: ${source}\n\n(Ref: buy_item_${item?.id}_${source.toLowerCase()})`;
  const waLink = `https://wa.me/${process.env.NEXT_PUBLIC_BOT_PHONE}?text=${encodeURIComponent(message)}`

  // --- HANDLERS ---
  const handleCheckoutClick = (e: React.MouseEvent) => {
      if (needsSelection) {
          e.preventDefault();
          toast.error("Please select all options before checkout.");
      }
  }

  return (
    <div className="min-h-screen bg-background pb-32 font-sans text-foreground selection:bg-primary/20 animate-in fade-in">
      <PublicHeader shop={shop} storeLink={storeLink} />

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* PRODUCT IMAGE */}
        <div className="relative aspect-square sm:aspect-[4/3] w-full bg-card rounded-[2.5rem] overflow-hidden shadow-2xl border border-border md:sticky md:top-24 group flex items-center justify-center bg-black/5">
            {item?.image_url && !imgError ? (
               <img 
                 src={activeVariant?.image || item.image_url} 
                 alt={item.name} 
                 onError={() => setImgError(true)} 
                 className={`w-full h-full object-contain p-6 transition-transform duration-700 hover:scale-105 ${isOutOfStock ? 'grayscale opacity-50' : ''}`} 
               />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 font-black text-9xl uppercase italic bg-secondbg">
                 {item?.name[0]}
               </div>
            )}
            <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest border border-border shadow-sm">
                {item?.category || 'Product'}
            </div>
            {isOutOfStock && <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px] z-10"><span className="bg-foreground text-background px-8 py-3 rounded-full font-black uppercase text-xl shadow-xl">Sold Out</span></div>}
        </div>

        {/* DETAILS */}
        <div className="space-y-8 pt-4">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">{item?.name}</h1>
                <div className="flex items-center gap-4">
                    <p className="text-4xl font-black text-primary tracking-tighter transition-all">₹{currentPrice}</p>
                    {ref && <div className="bg-secondbg px-3 py-1 rounded-lg text-[10px] font-bold uppercase border border-border">Via {source}</div>}
                </div>
                {currentStock > 0 && currentStock < 5 && <p className="text-xs text-destructive font-bold animate-pulse">Only {currentStock} left in stock!</p>}
            </div>

            {/* 🚨 THE FIX: Variant Selection UI */}
            {hasSpecs && (
                <div className="space-y-5 pt-2">
                  {item.attributes!.specs!.map((spec) => (
                    <div key={spec.name} className="space-y-3">
                      <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">{spec.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(spec.options) && spec.options.map(opt => {
                          const isSelected = selections[spec.name] === opt;
                          return (
                            <button 
                              key={opt} 
                              onClick={() => setSelections(prev => ({ ...prev, [spec.name]: opt }))} 
                              className={`px-5 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all duration-200 ${
                                isSelected 
                                ? 'border-primary bg-primary text-primary-foreground shadow-md scale-[1.02]' 
                                : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondbg'
                              }`}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
            )}

            {/* 🚨 THE FIX: Quantity Selector */}
            {!isOutOfStock && (!hasSpecs || activeVariant) && (
              <div className="space-y-3 pt-2">
                 <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Quantity</p>
                 <div className="flex items-center gap-4 bg-secondbg w-fit p-1 rounded-2xl border border-border">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      disabled={quantity <= 1}
                      className="p-3 bg-card rounded-xl hover:bg-border disabled:opacity-50 text-foreground transition-colors"
                    >
                      <Minus size={16}/>
                    </button>
                    <span className="font-black text-lg w-8 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))} 
                      disabled={quantity >= currentStock}
                      className="p-3 bg-card rounded-xl hover:bg-border disabled:opacity-50 text-foreground transition-colors"
                    >
                      <Plus size={16}/>
                    </button>
                 </div>
              </div>
            )}

            <div className="p-5 bg-secondbg rounded-3xl space-y-2 border border-border">
                <p className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                   <AlignLeft size={10} /> Description
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                  {item?.description || "This exclusive item is available directly through our WhatsApp store."}
                </p>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-2xl border border-border shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary"><Zap size={20} fill="currentColor" /></div>
                    <div>
                        <p className="text-xs font-bold uppercase">Instant</p>
                        <p className="text-[10px] font-medium text-muted-foreground">WhatsApp Checkout</p>
                    </div>
                </div>
                <div className="p-4 bg-card rounded-2xl border border-border shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--success)]/10 rounded-full flex items-center justify-center text-[var(--success)]"><ShieldCheck size={20} /></div>
                    <div>
                        <p className="text-xs font-bold uppercase">Secure</p>
                        <p className="text-[10px] font-medium text-muted-foreground">Verified Merchant</p>
                    </div>
                </div>
            </div>

            <div className="h-px bg-border w-full" />

            {/* MORE FROM STORE */}
            {more_items && more_items.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h3 className="font-black text-lg">More from {shop.name}</h3>
                        <Link href={storeLink} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">View All <ArrowRight size={12} /></Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {more_items.map((prod: any) => (
                            <Link key={prod.id} href={`/shop/${shop.slug}/products/${prod.slug}?ref=${source.toLowerCase()}`} className="group bg-card p-3 rounded-2xl border border-border hover:shadow-lg hover:border-primary/20 transition-all">
                                <div className="aspect-square bg-secondbg rounded-xl mb-3 overflow-hidden">
                                    {prod.image_url ? (
                                      <img src={prod.image_url} onError={(e) => { e.currentTarget.style.display = 'none' }} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Package size={16}/></div>
                                    )}
                                </div>
                                <p className="font-bold text-sm truncate">{prod.name}</p>
                                <p className="text-xs font-black text-primary">₹{prod.price}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-card/80 backdrop-blur-xl border-t border-border flex justify-center z-50">
        <a 
          href={canCheckout ? waLink : '#'} 
          onClick={handleCheckoutClick}
          target={canCheckout ? "_blank" : "_self"} 
          className={`w-full max-w-lg py-4 md:py-5 rounded-[2rem] font-black text-lg tracking-wide text-center flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 ${
             isOutOfStock 
             ? 'bg-muted text-muted-foreground cursor-not-allowed' 
             : needsSelection
             ? 'bg-foreground text-background shadow-lg'
             : 'bg-[#25D366] hover:bg-[#1fb355] text-white shadow-green-500/20'
          }`}
        >
          {isOutOfStock ? "SOLD OUT" : needsSelection ? "SELECT OPTIONS" : <><ShoppingCart size={24} strokeWidth={3} /> CHECKOUT ON WHATSAPP</>}
        </a>
      </div>
    </div>
  )
}