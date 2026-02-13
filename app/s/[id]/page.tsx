// 'use client'

// import { useState, useEffect, useMemo } from 'react'
// import { createClient } from '@/app/lib/supabase-browser'
// import { 
//   ShoppingBag, Search, Plus, Minus, X, Loader2, 
//   Trash2, Star, CheckCircle, Heart, AlignLeft,
//   Ticket, PackageOpen, ArrowRight, MessageSquare, Store
// } from 'lucide-react'
// import { toast } from 'sonner'
// import PublicHeader from '@/app/components/publicheader'
// import PincodeChecker from '@/app/components/Pincodechecker'

// // --- TYPES ---
// type Variant = { title: string; price: number; stock: number; image: string; }
// type Item = {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   category: string; 
//   image_url: string;
//   stock_quantity: number; 
//   attributes?: { specs: { name: string; options: string[] }[]; variants: Variant[]; has_complex_variants: boolean; };
// }
// type Review = { rating: number; comment: string; customer_name: string; created_at: string }

// export default function CompleteShopPage({ params }: { params: Promise<{ id: string }> }) {
//   // --- STATE ---
//   const [shop, setShop] = useState<any>(null)
//   const [items, setItems] = useState<Item[]>([])
//   const [reviews, setReviews] = useState<Review[]>([]) 
//   const [loading, setLoading] = useState(true)
  
//   // UI State
//   const [isCartOpen, setIsCartOpen] = useState(false)
//   const [showReviewsModal, setShowReviewsModal] = useState(false)
//   const [selectedItem, setSelectedItem] = useState<Item | null>(null)
//   const [searchQuery, setSearchQuery] = useState('')
//   const [activeCategory, setActiveCategory] = useState('All')
//   const [wishlist, setWishlist] = useState<number[]>([])

//   // Cart & Product Logic
//   const [selections, setSelections] = useState<Record<string, string>>({})
//   const [cart, setCart] = useState<{ id: string; item: Item; variant?: Variant; qty: number }[]>([])

//   // Coupon State
//   const [couponInput, setCouponInput] = useState('')
//   const [appliedCoupon, setAppliedCoupon] = useState<{code: string, value: number, type: 'percent' | 'flat'} | null>(null)
//   const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

//   // --- DATA FETCHING ---
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const resolvedParams = await params
//         const id = resolvedParams.id
        
//         // Fetch from API
//         const res = await fetch(`${apiUrl}/api/storefront/${id}`)
        
//         if (!res.ok) throw new Error("Shop not found")
        
//         const data = await res.json()
//         setShop(data.shop)
//         setItems(data.products || [])
//         setReviews(data.reviews || []) 
//       } catch (e) {
//         console.error("Shop Load Error:", e)
//         // Do NOT toast here, just let the UI handle the null shop
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [])

//   // ... (Derived State & Actions remain exactly the same as your code) ...
//   const categories = useMemo(() => {
//     const cats = new Set(items.map(i => i.category || 'General'))
//     return ['All', ...Array.from(cats)]
//   }, [items])

//   const filteredItems = useMemo(() => {
//     return items.filter(item => {
//       const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                             item.description?.toLowerCase().includes(searchQuery.toLowerCase())
//       const matchesCategory = activeCategory === 'All' || (item.category || 'General') === activeCategory
//       return matchesSearch && matchesCategory
//     })
//   }, [items, searchQuery, activeCategory])

//   const activeVariant = useMemo(() => {
//     if (!selectedItem?.attributes?.has_complex_variants) return null
//     const specValues = selectedItem.attributes.specs.map(s => selections[s.name]).filter(Boolean)
//     if (specValues.length < selectedItem.attributes.specs.length) return null
//     const targetTitle = specValues.join(' / ') 
//     return selectedItem.attributes.variants.find(v => v.title === targetTitle) || null
//   }, [selectedItem, selections])

//   const currentPrice = activeVariant ? activeVariant.price : selectedItem?.price || 0
//   const currentImage = activeVariant?.image || selectedItem?.image_url
//   const currentStock = activeVariant ? activeVariant.stock : selectedItem?.stock_quantity || 0
//   const isOutOfStock = currentStock <= 0

//   const toggleWishlist = (e: React.MouseEvent, id: number) => {
//     e.stopPropagation()
//     setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
//     toast.success(wishlist.includes(id) ? "Removed from favorites" : "Added to favorites")
//   }

//   const addToCart = () => {
//     if (!selectedItem) return
//     if (selectedItem.attributes?.has_complex_variants && !activeVariant) {
//       toast.error("Please select all options (Color, Size, etc.)")
//       return
//     }
//     if (isOutOfStock) {
//       toast.error("Sorry, this item is out of stock")
//       return
//     }
//     const cartItemId = activeVariant ? `${selectedItem.id}-${activeVariant.title}` : `${selectedItem.id}-base`
//     setCart(prev => {
//       const exists = prev.find(i => i.id === cartItemId)
//       if (exists) {
//         if (exists.qty + 1 > currentStock) {
//           toast.error(`Only ${currentStock} available in stock`)
//           return prev
//         }
//         return prev.map(i => i.id === cartItemId ? { ...i, qty: i.qty + 1 } : i)
//       }
//       return [...prev, { id: cartItemId, item: selectedItem, variant: activeVariant || undefined, qty: 1 }]
//     })
//     toast.success("Added to bag")
//     setSelectedItem(null)
//     setSelections({})
//     setIsCartOpen(true) 
//   }

//   const updateQty = (cartId: string, delta: number, maxStock: number) => {
//     setCart(prev => prev.map(i => {
//       if (i.id === cartId) {
//         const newQty = i.qty + delta
//         if (newQty > maxStock) {
//           toast.error(`Max stock reached`)
//           return i
//         }
//         return { ...i, qty: Math.max(1, newQty) }
//       }
//       return i
//     }))
//   }

//   const handleApplyCoupon = async () => {
//     if(!couponInput.trim()) return;
//     setIsValidatingCoupon(true);
//     const supabase = createClient();
//     const { data, error } = await supabase.from('coupons').select('*').eq('shop_id', shop.id).eq('code', couponInput.toUpperCase().trim()).eq('is_active', true).single();
//     if(error || !data) {
//       toast.error("Invalid or expired coupon code");
//       setAppliedCoupon(null);
//     } else {
//       setAppliedCoupon({ code: data.code, value: data.value, type: data.discount_type });
//       toast.success("Coupon applied!");
//     }
//     setIsValidatingCoupon(false);
//   }

//   const subtotal = cart.reduce((acc, curr) => acc + ((curr.variant?.price || curr.item.price) * curr.qty), 0)
//   let discountAmount = 0;
//   if (appliedCoupon) {
//     discountAmount = appliedCoupon.type === 'percent' ? (subtotal * appliedCoupon.value) / 100 : appliedCoupon.value;
//   }
//   const finalTotal = Math.max(0, subtotal - discountAmount);
//   const FREE_SHIPPING_THRESHOLD = 1500
//   const progressToFreeShipping = Math.min(100, (finalTotal / FREE_SHIPPING_THRESHOLD) * 100)

//   const handleCheckout = () => {
//     const orderLines = cart.map(c => `• ${c.item.name} ${c.variant ? `(${c.variant.title})` : ''} x${c.qty}`).join('\n')
//     let bulkRef = cart.map(c => `${c.item.id}:${c.qty}`).join(',')
//     if (appliedCoupon) bulkRef += `_COUPON:${appliedCoupon.code}`
//     let msg = `Hi ${shop.name}! I'd like to place an order:\n\n${orderLines}\n\n`
//     if (appliedCoupon) {
//       msg += `📝 Subtotal: ₹${subtotal}\n🏷️ Coupon (${appliedCoupon.code}): -₹${discountAmount}\n`
//     }
//     msg += `💰 *Final Total: ₹${finalTotal}*\n\n(Ref: buy_bulk_${bulkRef})`
//     window.location.href = `https://wa.me/${shop.phone_number}?text=${encodeURIComponent(msg)}`
//   }
//   // ... (End of Actions)

//   // --- RENDER ---

//   if (loading) return (
//     <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
//       <Loader2 className="animate-spin text-primary w-10 h-10" />
//       <p className="text-muted-foreground font-bold animate-pulse">Loading Store...</p>
//     </div>
//   )

//   // ⚠️ CRITICAL FIX: The "Safety Net"
//   // If loading is done, but shop is null, DO NOT try to render <PublicHeader>.
//   // Instead, show a 404 UI.
//   if (!shop) {
//     return (
//       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
//         <Store size={64} className="text-muted-foreground mb-4 opacity-50" />
//         <h1 className="text-2xl font-black text-foreground">Shop Not Found</h1>
//         <p className="text-muted-foreground mt-2">The store you are looking for does not exist or has been removed.</p>
//         <a href="/" className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity">
//           Return Home
//         </a>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background pb-32 font-sans selection:bg-primary/20 animate-in fade-in duration-500">
      
//       {/* ⚠️ This line caused the crash. Now it's safe because of the 'if (!shop)' check above */}
//       <PublicHeader shop={shop} storeLink={`/s/${shop.id}`} />

//       {/* --- SEARCH & CATEGORIES --- */}
//       <div className="sticky top-[73px] z-30 bg-background/80 backdrop-blur-md border-b border-border pb-4 pt-2">
//          <div className="max-w-5xl mx-auto px-4 space-y-4">
//             <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
//                 <input 
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder={`Search ${shop?.name}...`} 
//                     className="w-full pl-10 pr-4 py-2.5 bg-secondbg rounded-full text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground"
//                 />
//                 <button onClick={() => setIsCartOpen(true)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-colors">
//                     <ShoppingBag size={16} />
//                     {cart.length > 0 && (
//                     <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-background animate-bounce">
//                         {cart.length}
//                     </span>
//                     )}
//                 </button>
//             </div>

//             <div className="overflow-x-auto no-scrollbar flex gap-2">
//                 {categories.map(cat => (
//                     <button 
//                     key={cat}
//                     onClick={() => setActiveCategory(cat)}
//                     className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-black uppercase tracking-wide transition-all border ${
//                         activeCategory === cat 
//                         ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' 
//                         : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground'
//                     }`}
//                     >
//                     {cat}
//                     </button>
//                 ))}
//             </div>
//          </div>
//       </div>

//       {/* --- MAIN CONTENT --- */}
//       <main className="px-4 mt-8 max-w-5xl mx-auto min-h-[60vh]">
//         {/* REVIEW TOGGLE BUTTON */}
//         {reviews.length > 0 && (
//             <div className="mb-8 flex justify-center">
//                 <button onClick={() => setShowReviewsModal(true)} className="group bg-card border border-border rounded-full px-6 py-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-95 hover:border-primary/30">
//                     <div className="flex -space-x-1">
//                         {[...Array(Math.min(3, reviews.length))].map((_, i) => (
//                              <div key={i} className="w-6 h-6 rounded-full bg-secondbg border-2 border-card flex items-center justify-center text-[8px] font-bold text-muted-foreground">
//                                  {reviews[i].customer_name[0]}
//                              </div>
//                         ))}
//                     </div>
//                     <div className="flex flex-col items-start">
//                          <div className="flex text-[var(--warning)] gap-0.5">
//                              {[...Array(5)].map((_,i) => <Star key={i} size={12} fill="currentColor" />)}
//                          </div>
//                          <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">See all {reviews.length} Reviews</span>
//                     </div>
//                 </button>
//             </div>
//         )}

//         {/* --- PRODUCTS GRID --- */}
//         {filteredItems.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
//             <PackageOpen size={64} className="text-muted-foreground mb-4" />
//             <h3 className="text-xl font-bold text-foreground">No products found</h3>
//             <p className="text-sm text-muted-foreground">Try changing your search or category.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {filteredItems.map(item => {
//               const isBaseOOS = !item.attributes?.has_complex_variants && (item.stock_quantity || 0) <= 0;
//               return (
//                 <div key={item.id} onClick={() => { setSelectedItem(item); setSelections({}); }} className="group bg-card rounded-[2rem] p-3 pb-5 flex flex-col gap-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative border border-border hover:border-primary/20">
//                   <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-secondbg relative">
//                       {item.image_url ? (
//                         <img src={item.image_url} className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${isBaseOOS ? 'grayscale opacity-50' : ''}`} />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-secondbg text-muted-foreground/30 font-bold">No Image</div>
//                       )}
//                       <button onClick={(e) => toggleWishlist(e, item.id)} className="absolute top-2 right-2 p-2 bg-card/80 backdrop-blur-sm rounded-full text-destructive hover:bg-card hover:scale-110 transition-all z-10 shadow-sm">
//                         <Heart size={16} fill={wishlist.includes(item.id) ? "currentColor" : "none"} />
//                       </button>
//                       {item.attributes?.has_complex_variants && <span className="absolute bottom-2 left-2 bg-foreground/80 backdrop-blur-md text-background text-[9px] font-black px-2 py-1 rounded-lg uppercase">Options</span>}
//                       {isBaseOOS && <div className="absolute inset-0 bg-background/60 flex items-center justify-center text-foreground font-black text-lg uppercase tracking-widest backdrop-blur-[2px]">Sold Out</div>}
//                   </div>
//                   <div className="px-1 space-y-1">
//                     <p className="font-bold text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">{item.name}</p>
//                     <div className="flex items-center justify-between pt-1">
//                       <p className="text-primary font-black text-lg">₹{item.price}</p>
//                       <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isBaseOOS ? 'bg-secondbg text-muted-foreground' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'}`}>
//                         <Plus size={16} strokeWidth={3} />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         )}
//       </main>

//       {/* --- REVIEWS MODAL --- */}
//       {showReviewsModal && (
//         <div className="fixed inset-0 z-[70] flex justify-center items-center p-4">
//              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowReviewsModal(false)} />
//              <div className="bg-card w-full max-w-lg rounded-[2rem] p-6 relative z-10 animate-in zoom-in-95 max-h-[80vh] flex flex-col shadow-2xl border border-border">
//                 <div className="flex justify-between items-center mb-6">
//                    <h3 className="text-xl font-black text-foreground flex items-center gap-2">
//                      <MessageSquare className="text-primary" /> Customer Reviews
//                    </h3>
//                    <button onClick={() => setShowReviewsModal(false)} className="p-2 bg-secondbg rounded-full hover:bg-border text-muted-foreground"><X size={20} /></button>
//                 </div>
//                 <div className="overflow-y-auto space-y-4 custom-scrollbar pr-2">
//                     {reviews.map((r, i) => (
//                         <div key={i} className="bg-secondbg p-5 rounded-2xl border border-border">
//                             <div className="flex justify-between items-start mb-2">
//                                 <div className="flex text-[var(--warning)] gap-0.5">
//                                     {[...Array(r.rating)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
//                                 </div>
//                                 <span className="text-[10px] text-muted-foreground font-bold">{new Date(r.created_at).toLocaleDateString()}</span>
//                             </div>
//                             <p className="text-sm font-medium text-foreground/80 italic mb-3 leading-relaxed">"{r.comment}"</p>
//                             <div className="flex items-center gap-2">
//                                 <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
//                                     {r.customer_name[0]}
//                                 </div>
//                                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">{r.customer_name}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//              </div>
//         </div>
//       )}

//       {/* --- PRODUCT DETAIL MODAL --- */}
//       {selectedItem && (
//         <div className="fixed inset-0 z-50 flex justify-center items-end sm:items-center p-0 sm:p-4">
//           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={() => setSelectedItem(null)} />
//           <div className="bg-card w-full max-w-lg sm:rounded-[2.5rem] rounded-t-[2.5rem] p-6 shadow-2xl relative animate-in slide-in-from-bottom-20 duration-300 flex flex-col max-h-[95vh] border border-border">
//             <button onClick={() => setSelectedItem(null)} className="absolute right-6 top-6 p-2 bg-secondbg rounded-full text-muted-foreground hover:text-foreground z-10"><X size={20} /></button>
//             <div className="w-full h-72 sm:h-80 bg-secondbg rounded-3xl mb-6 overflow-hidden flex-shrink-0 relative border border-border">
//                {currentImage ? (
//                    <img src={currentImage} className={`w-full h-full object-cover transition-all duration-500 ${isOutOfStock ? 'grayscale opacity-50' : ''}`} />
//                ) : (
//                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-bold">No Image</div>
//                )}
//                {isOutOfStock && <div className="absolute inset-0 flex items-center justify-center"><span className="bg-foreground text-background px-6 py-2 rounded-full font-black uppercase">Out of Stock</span></div>}
//             </div>
//             <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
//               <div>
//                 <div className="flex justify-between items-start">
//                   <h2 className="text-2xl font-black tracking-tight text-foreground leading-tight w-3/4">{selectedItem.name}</h2>
//                   <div className="text-right">
//                     <p className="text-3xl font-black text-primary">₹{currentPrice}</p>
//                     {currentStock > 0 && currentStock < 5 && <p className="text-[10px] text-destructive font-bold animate-pulse">Only {currentStock} left!</p>}
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-secondbg p-5 rounded-3xl space-y-2 border border-border">
//                 <p className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
//                    <AlignLeft size={10} /> Description
//                 </p>
//                 <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
//                   {selectedItem.description || "No description provided."}
//                 </p>
//               </div>
//               {selectedItem.attributes?.has_complex_variants && selectedItem.attributes.specs.map((spec) => (
//                 <div key={spec.name} className="space-y-3">
//                   <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">{spec.name}</p>
//                   <div className="flex flex-wrap gap-2">
//                     {spec.options.map(opt => {
//                       const isSelected = selections[spec.name] === opt
//                       return (
//                         <button key={opt} onClick={() => setSelections(prev => ({ ...prev, [spec.name]: opt }))} className={`px-6 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground hover:border-primary/50'}`}>
//                           {opt}
//                         </button>
//                       )
//                     })}
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="pt-6 mt-4 border-t border-border">
//                <button onClick={addToCart} disabled={isOutOfStock} className="w-full py-5 bg-primary disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-primary-foreground rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-transform flex items-center justify-center gap-2 hover:opacity-90">
//                  {isOutOfStock ? "SOLD OUT" : <><ShoppingBag size={20} /> ADD TO BAG</>}
//                </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- CART DRAWER --- */}
//       {isCartOpen && (
//         <div className="fixed inset-0 z-[60] flex justify-end">
//           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
//           <div className="relative w-full max-w-sm bg-card h-full p-0 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 border-l border-border">
//             <div className="p-6 pb-2">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-black uppercase text-foreground">Your Bag</h2>
//                 <button onClick={() => setIsCartOpen(false)} className="p-2 bg-secondbg rounded-full hover:bg-border text-foreground"><X size={18} /></button>
//               </div>
//               {cart.length > 0 && finalTotal < FREE_SHIPPING_THRESHOLD && (
//                 <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20 mb-2">
//                    <p className="text-xs font-bold text-primary mb-2 flex items-center gap-2"><PackageOpen size={14}/> Add ₹{FREE_SHIPPING_THRESHOLD - finalTotal} for <span className="uppercase">Free Shipping</span></p>
//                    <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
//                      <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressToFreeShipping}%` }} />
//                    </div>
//                 </div>
//               )}
//                {cart.length > 0 && finalTotal >= FREE_SHIPPING_THRESHOLD && (
//                 <div className="bg-[var(--success)]/10 p-3 rounded-2xl border border-[var(--success)]/20 mb-2 text-center">
//                    <p className="text-xs font-black text-[var(--success)] uppercase flex items-center justify-center gap-2"><CheckCircle size={14}/> You unlocked Free Shipping!</p>
//                 </div>
//               )}
//             </div>
//             <div className="flex-1 overflow-y-auto space-y-6 px-6 pb-6 custom-scrollbar">
//               {cart.length === 0 ? (
//                 <div className="h-full flex flex-col items-center justify-center opacity-40 space-y-4">
//                   <ShoppingBag size={64} className="text-muted-foreground" />
//                   <p className="font-bold text-muted-foreground">Your bag is empty.</p>
//                   <button onClick={() => setIsCartOpen(false)} className="text-primary font-bold text-sm hover:underline">Start Shopping</button>
//                 </div>
//               ) : cart.map(c => {
//                  const stockLimit = c.variant ? c.variant.stock : c.item.stock_quantity;
//                  return (
//                   <div key={c.id} className="flex gap-4 items-start py-2 border-b border-border last:border-0 pb-4">
//                     <div className="w-20 h-20 rounded-2xl bg-secondbg overflow-hidden flex-shrink-0 border border-border">
//                       {c.variant?.image || c.item.image_url ? (
//                         <img src={c.variant?.image || c.item.image_url} className="w-full h-full object-cover" />
//                       ) : (
//                          <div className="w-full h-full bg-secondbg flex items-center justify-center text-xs font-bold text-muted-foreground">IMG</div>
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-bold text-foreground text-sm truncate">{c.item.name}</p>
//                       {c.variant && <p className="text-xs font-bold text-muted-foreground mt-1">{c.variant.title}</p>}
//                       <p className="text-primary font-black mt-1">₹{c.variant?.price || c.item.price}</p>
//                     </div>
//                     <div className="flex flex-col items-center gap-2">
//                       <button onClick={() => updateQty(c.id, 1, stockLimit)} className="p-1 bg-secondbg rounded-lg hover:bg-border text-foreground"><Plus size={12}/></button>
//                       <span className="font-bold text-sm text-foreground">{c.qty}</span>
//                       <button onClick={() => updateQty(c.id, -1, stockLimit)} className="p-1 bg-secondbg rounded-lg hover:bg-border text-foreground"><Minus size={12}/></button>
//                     </div>
//                     <button onClick={() => setCart(prev => prev.filter(i => i.id !== c.id))} className="text-muted-foreground hover:text-destructive"><Trash2 size={16}/></button>
//                   </div>
//               )})}
//             </div>
//             {cart.length > 0 && (
//               <div className="bg-secondbg p-6 space-y-4 border-t border-border">
//                 {!appliedCoupon ? (
//                   <div className="flex gap-2">
//                     <div className="relative flex-1">
//                       <Ticket size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//                       <input 
//                         placeholder="COUPON CODE" 
//                         value={couponInput}
//                         onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
//                         className="w-full pl-9 pr-3 py-3 bg-card rounded-xl text-sm font-bold text-foreground outline-none border border-border focus:border-primary transition-all uppercase"
//                       />
//                     </div>
//                     <button onClick={handleApplyCoupon} disabled={!couponInput || isValidatingCoupon} className="px-4 bg-foreground text-background rounded-xl font-bold text-sm disabled:opacity-50">
//                       {isValidatingCoupon ? <Loader2 className="animate-spin" size={16}/> : "Apply"}
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-[var(--success)]/30 shadow-sm">
//                     <div className="flex items-center gap-2 text-[var(--success)]">
//                       <CheckCircle size={16} />
//                       <span className="font-bold text-sm">Code {appliedCoupon.code} applied!</span>
//                     </div>
//                     <button onClick={() => { setAppliedCoupon(null); setCouponInput(''); }} className="text-destructive hover:underline font-bold text-xs">Remove</button>
//                   </div>
//                 )}
//                 {/* <PincodeChecker shopId={shop?.id || 0}/> */}
//                 <div className="space-y-2 pt-2">
//                   <div className="flex justify-between text-sm font-bold text-muted-foreground"><span>Subtotal</span><span>₹{subtotal}</span></div>
//                   {appliedCoupon && <div className="flex justify-between text-sm font-bold text-[var(--success)]"><span>Discount</span><span>-₹{discountAmount}</span></div>}
//                   <div className="flex justify-between text-2xl font-black text-foreground pt-3 border-t border-border"><span>Total</span><span>₹{finalTotal}</span></div>
//                 </div>
//                 <button onClick={handleCheckout} className="w-full py-4 bg-[#25D366] text-white rounded-[2rem] font-black shadow-lg hover:shadow-green-500/20 transition-all flex items-center justify-center gap-2 text-lg active:scale-95 hover:opacity-90">
//                    CHECKOUT ON WHATSAPP <ArrowRight size={20} />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <div className="mt-12 mb-8 p-6 bg-secondbg rounded-[2.5rem] text-center max-w-lg mx-auto">
//          <p className="text-[10px] font-black uppercase text-muted-foreground mb-2 tracking-widest">Store Policy</p>
//          <p className="text-xs font-medium text-foreground/70 leading-relaxed">
//             {shop?.return_policy || "No returns or exchanges allowed."}
//          </p>
//          <div className="mt-6 pt-6 border-t border-border">
//              <p className="text-[10px] font-bold text-muted-foreground/50">Powered by CopIt</p>
//          </div>
//       </div>
//     </div>
//   )
// }




'use client'

import { useState, useEffect, useMemo, useRef } from 'react' // Added useRef
import { createClient } from '@/app/lib/supabase-browser'
import { 
  ShoppingBag, Search, Plus, Minus, X, Loader2, 
  Trash2, Star, CheckCircle, Heart, AlignLeft,
  Ticket, PackageOpen, ArrowRight, MessageSquare, Store
} from 'lucide-react'
import { toast } from 'sonner'
import PublicHeader from '@/app/components/publicheader'
// Fixed Import Casing
// import PincodeChecker from '@/app/components/PincodeChecker' 
import PincodeChecker from '@/app/components/Pincodechecker'

// --- TYPES ---
type Variant = { title: string; price: number; stock: number; image: string; }
type Item = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string; 
  image_url: string;
  stock_quantity: number; 
  attributes?: { specs: { name: string; options: string[] }[]; variants: Variant[]; has_complex_variants: boolean; };
}
type Review = { rating: number; comment: string; customer_name: string; created_at: string }

export default function CompleteShopPage({ params }: { params: Promise<{ id: string }> }) {
  // --- STATE ---
  const [shop, setShop] = useState<any>(null)
  const [items, setItems] = useState<Item[]>([])
  const [reviews, setReviews] = useState<Review[]>([]) 
  const [loading, setLoading] = useState(true)
  
  // UI State
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showReviewsModal, setShowReviewsModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  
  // 💾 PERSISTENCE STATE (Initialized empty, loaded later to prevent hydration mismatch)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [cart, setCart] = useState<{ id: string; item: Item; variant?: Variant; qty: number }[]>([])
  const [isStorageLoaded, setIsStorageLoaded] = useState(false) // Prevents overwriting storage on init

  // Cart & Product Logic
  const [selections, setSelections] = useState<Record<string, string>>({})

  // Coupon State
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, value: number, type: 'percent' | 'flat'} | null>(null)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params
        const id = resolvedParams.id
        
        const res = await fetch(`${apiUrl}/api/storefront/${id}`)
        
        if (!res.ok) throw new Error("Shop not found")
        
        const data = await res.json()
        setShop(data.shop)
        setItems(data.products || [])
        setReviews(data.reviews || []) 
      } catch (e) {
        console.error("Shop Load Error:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // --- 💾 PERSISTENCE LOGIC (THE FIX) ---
  
  // 1. Load from Storage when Shop ID is available
  useEffect(() => {
    if (!shop?.id) return;

    try {
        const localCart = localStorage.getItem(`copit-cart-${shop.id}`)
        const localWish = localStorage.getItem(`copit-wish-${shop.id}`)

        if (localCart) {
            const parsedCart = JSON.parse(localCart);
            if(parsedCart.length > 0) {
                setCart(parsedCart)
                // Optional: Notify user
                setTimeout(() => toast.info("Welcome back! We saved your bag."), 1000)
            }
        }
        if (localWish) setWishlist(JSON.parse(localWish))
    } catch (e) {
        console.error("Storage Load Error", e)
    } finally {
        setIsStorageLoaded(true)
    }
  }, [shop?.id])

  // 2. Save to Storage whenever Cart Changes (Only after initial load)
  useEffect(() => {
    if (!shop?.id || !isStorageLoaded) return;
    localStorage.setItem(`copit-cart-${shop.id}`, JSON.stringify(cart))
  }, [cart, shop?.id, isStorageLoaded])

  // 3. Save to Storage whenever Wishlist Changes
  useEffect(() => {
    if (!shop?.id || !isStorageLoaded) return;
    localStorage.setItem(`copit-wish-${shop.id}`, JSON.stringify(wishlist))
  }, [wishlist, shop?.id, isStorageLoaded])


  // --- COMPUTED STATE ---
  const categories = useMemo(() => {
    const cats = new Set(items.map(i => i.category || 'General'))
    return ['All', ...Array.from(cats)]
  }, [items])

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategory === 'All' || (item.category || 'General') === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [items, searchQuery, activeCategory])

  const activeVariant = useMemo(() => {
    if (!selectedItem?.attributes?.has_complex_variants) return null
    const specValues = selectedItem.attributes.specs.map(s => selections[s.name]).filter(Boolean)
    if (specValues.length < selectedItem.attributes.specs.length) return null
    const targetTitle = specValues.join(' / ') 
    return selectedItem.attributes.variants.find(v => v.title === targetTitle) || null
  }, [selectedItem, selections])

  const currentPrice = activeVariant ? activeVariant.price : selectedItem?.price || 0
  const currentImage = activeVariant?.image || selectedItem?.image_url
  const currentStock = activeVariant ? activeVariant.stock : selectedItem?.stock_quantity || 0
  const isOutOfStock = currentStock <= 0

  // --- ACTIONS ---

  const toggleWishlist = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    toast.success(wishlist.includes(id) ? "Removed from favorites" : "Added to favorites")
  }

  const addToCart = () => {
    if (!selectedItem) return
    if (selectedItem.attributes?.has_complex_variants && !activeVariant) {
      toast.error("Please select all options (Color, Size, etc.)")
      return
    }
    if (isOutOfStock) {
      toast.error("Sorry, this item is out of stock")
      return
    }
    const cartItemId = activeVariant ? `${selectedItem.id}-${activeVariant.title}` : `${selectedItem.id}-base`
    setCart(prev => {
      const exists = prev.find(i => i.id === cartItemId)
      if (exists) {
        if (exists.qty + 1 > currentStock) {
          toast.error(`Only ${currentStock} available in stock`)
          return prev
        }
        return prev.map(i => i.id === cartItemId ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { id: cartItemId, item: selectedItem, variant: activeVariant || undefined, qty: 1 }]
    })
    toast.success("Added to bag")
    setSelectedItem(null)
    setSelections({})
    setIsCartOpen(true) 
  }

  const updateQty = (cartId: string, delta: number, maxStock: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === cartId) {
        const newQty = i.qty + delta
        if (newQty > maxStock) {
          toast.error(`Max stock reached`)
          return i
        }
        return { ...i, qty: Math.max(1, newQty) }
      }
      return i
    }))
  }

  const handleApplyCoupon = async () => {
    if(!couponInput.trim()) return;
    setIsValidatingCoupon(true);
    const supabase = createClient();
    const { data, error } = await supabase.from('coupons').select('*').eq('shop_id', shop.id).eq('code', couponInput.toUpperCase().trim()).eq('is_active', true).single();
    if(error || !data) {
      toast.error("Invalid or expired coupon code");
      setAppliedCoupon(null);
    } else {
      setAppliedCoupon({ code: data.code, value: data.value, type: data.discount_type });
      toast.success("Coupon applied!");
    }
    setIsValidatingCoupon(false);
  }

  const subtotal = cart.reduce((acc, curr) => acc + ((curr.variant?.price || curr.item.price) * curr.qty), 0)
  let discountAmount = 0;
  if (appliedCoupon) {
    discountAmount = appliedCoupon.type === 'percent' ? (subtotal * appliedCoupon.value) / 100 : appliedCoupon.value;
  }
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const FREE_SHIPPING_THRESHOLD = 1500
  const progressToFreeShipping = Math.min(100, (finalTotal / FREE_SHIPPING_THRESHOLD) * 100)

  const handleCheckout = () => {
    const orderLines = cart.map(c => `• ${c.item.name} ${c.variant ? `(${c.variant.title})` : ''} x${c.qty}`).join('\n')
    let bulkRef = cart.map(c => `${c.item.id}:${c.qty}`).join(',')
    if (appliedCoupon) bulkRef += `_COUPON:${appliedCoupon.code}`
    
    let msg = `Hi ${shop.name}! I'd like to place an order:\n\n${orderLines}\n\n`
    if (appliedCoupon) {
      msg += `📝 Subtotal: ₹${subtotal}\n🏷️ Coupon (${appliedCoupon.code}): -₹${discountAmount}\n`
    }
    msg += `💰 *Final Total: ₹${finalTotal}*\n\n(Ref: buy_bulk_${bulkRef})`
    
    window.location.href = `https://wa.me/${process.env.NEXT_PUBLIC_BOT_PHONE}?text=${encodeURIComponent(msg)}`
  }


  // --- RENDER ---
  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-primary w-10 h-10" />
      <p className="text-muted-foreground font-bold animate-pulse">Loading Store...</p>
    </div>
  )

  if (!shop) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <Store size={64} className="text-muted-foreground mb-4 opacity-50" />
        <h1 className="text-2xl font-black text-foreground">Shop Not Found</h1>
        <p className="text-muted-foreground mt-2">The store you are looking for does not exist or has been removed.</p>
        <a href="/" className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity">Return Home</a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-32 font-sans selection:bg-primary/20 animate-in fade-in duration-500">
      
      <PublicHeader shop={shop} storeLink={`/s/${shop.id}`} />

      {/* --- SEARCH & CATEGORIES --- */}
      <div className="sticky top-[73px] z-30 bg-background/80 backdrop-blur-md border-b border-border pb-4 pt-2">
         <div className="max-w-5xl mx-auto px-4 space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${shop?.name}...`} 
                    className="w-full pl-10 pr-4 py-2.5 bg-secondbg rounded-full text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground"
                />
                <button onClick={() => setIsCartOpen(true)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-colors">
                    <ShoppingBag size={16} />
                    {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-background animate-bounce">
                        {cart.length}
                    </span>
                    )}
                </button>
            </div>

            <div className="overflow-x-auto no-scrollbar flex gap-2">
                {categories.map(cat => (
                    <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-black uppercase tracking-wide transition-all border ${
                        activeCategory === cat 
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' 
                        : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground'
                    }`}
                    >
                    {cat}
                    </button>
                ))}
            </div>
         </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="px-4 mt-8 max-w-5xl mx-auto min-h-[60vh]">
        {/* REVIEW TOGGLE BUTTON */}
        {reviews.length > 0 && (
            <div className="mb-8 flex justify-center">
                <button onClick={() => setShowReviewsModal(true)} className="group bg-card border border-border rounded-full px-6 py-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-95 hover:border-primary/30">
                    <div className="flex -space-x-1">
                        {[...Array(Math.min(3, reviews.length))].map((_, i) => (
                             <div key={i} className="w-6 h-6 rounded-full bg-secondbg border-2 border-card flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                                 {reviews[i].customer_name[0]}
                             </div>
                        ))}
                    </div>
                    <div className="flex flex-col items-start">
                         <div className="flex text-[var(--warning)] gap-0.5">
                             {[...Array(5)].map((_,i) => <Star key={i} size={12} fill="currentColor" />)}
                         </div>
                         <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">See all {reviews.length} Reviews</span>
                    </div>
                </button>
            </div>
        )}

        {/* --- PRODUCTS GRID --- */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <PackageOpen size={64} className="text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground">No products found</h3>
            <p className="text-sm text-muted-foreground">Try changing your search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map(item => {
              const isBaseOOS = !item.attributes?.has_complex_variants && (item.stock_quantity || 0) <= 0;
              return (
                <div key={item.id} onClick={() => { setSelectedItem(item); setSelections({}); }} className="group bg-card rounded-[2rem] p-3 pb-5 flex flex-col gap-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative border border-border hover:border-primary/20">
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-secondbg relative">
                      {item.image_url ? (
                        <img src={item.image_url} className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${isBaseOOS ? 'grayscale opacity-50' : ''}`} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondbg text-muted-foreground/30 font-bold">No Image</div>
                      )}
                      <button onClick={(e) => toggleWishlist(e, item.id)} className="absolute top-2 right-2 p-2 bg-card/80 backdrop-blur-sm rounded-full text-destructive hover:bg-card hover:scale-110 transition-all z-10 shadow-sm">
                        <Heart size={16} fill={wishlist.includes(item.id) ? "currentColor" : "none"} />
                      </button>
                      {item.attributes?.has_complex_variants && <span className="absolute bottom-2 left-2 bg-foreground/80 backdrop-blur-md text-background text-[9px] font-black px-2 py-1 rounded-lg uppercase">Options</span>}
                      {isBaseOOS && <div className="absolute inset-0 bg-background/60 flex items-center justify-center text-foreground font-black text-lg uppercase tracking-widest backdrop-blur-[2px]">Sold Out</div>}
                  </div>
                  <div className="px-1 space-y-1">
                    <p className="font-bold text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">{item.name}</p>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-primary font-black text-lg">₹{item.price}</p>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isBaseOOS ? 'bg-secondbg text-muted-foreground' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'}`}>
                        <Plus size={16} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* --- REVIEWS MODAL --- */}
      {showReviewsModal && (
        <div className="fixed inset-0 z-[70] flex justify-center items-center p-4">
             <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowReviewsModal(false)} />
             <div className="bg-card w-full max-w-lg rounded-[2rem] p-6 relative z-10 animate-in zoom-in-95 max-h-[80vh] flex flex-col shadow-2xl border border-border">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                     <MessageSquare className="text-primary" /> Customer Reviews
                   </h3>
                   <button onClick={() => setShowReviewsModal(false)} className="p-2 bg-secondbg rounded-full hover:bg-border text-muted-foreground"><X size={20} /></button>
                </div>
                <div className="overflow-y-auto space-y-4 custom-scrollbar pr-2">
                    {reviews.map((r, i) => (
                        <div key={i} className="bg-secondbg p-5 rounded-2xl border border-border">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex text-[var(--warning)] gap-0.5">
                                    {[...Array(r.rating)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                                </div>
                                <span className="text-[10px] text-muted-foreground font-bold">{new Date(r.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm font-medium text-foreground/80 italic mb-3 leading-relaxed">"{r.comment}"</p>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                    {r.customer_name[0]}
                                </div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">{r.customer_name}</p>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        </div>
      )}

      {/* --- PRODUCT DETAIL MODAL --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex justify-center items-end sm:items-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={() => setSelectedItem(null)} />
          <div className="bg-card w-full max-w-lg sm:rounded-[2.5rem] rounded-t-[2.5rem] p-6 shadow-2xl relative animate-in slide-in-from-bottom-20 duration-300 flex flex-col max-h-[95vh] border border-border">
            <button onClick={() => setSelectedItem(null)} className="absolute right-6 top-6 p-2 bg-secondbg rounded-full text-muted-foreground hover:text-foreground z-10"><X size={20} /></button>
            <div className="w-full h-72 sm:h-80 bg-secondbg rounded-3xl mb-6 overflow-hidden flex-shrink-0 relative border border-border">
               {currentImage ? (
                   <img src={currentImage} className={`w-full h-full object-cover transition-all duration-500 ${isOutOfStock ? 'grayscale opacity-50' : ''}`} />
               ) : (
                   <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-bold">No Image</div>
               )}
               {isOutOfStock && <div className="absolute inset-0 flex items-center justify-center"><span className="bg-foreground text-background px-6 py-2 rounded-full font-black uppercase">Out of Stock</span></div>}
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
              <div>
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-black tracking-tight text-foreground leading-tight w-3/4">{selectedItem.name}</h2>
                  <div className="text-right">
                    <p className="text-3xl font-black text-primary">₹{currentPrice}</p>
                    {currentStock > 0 && currentStock < 5 && <p className="text-[10px] text-destructive font-bold animate-pulse">Only {currentStock} left!</p>}
                  </div>
                </div>
              </div>
              <div className="bg-secondbg p-5 rounded-3xl space-y-2 border border-border">
                <p className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                   <AlignLeft size={10} /> Description
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                  {selectedItem.description || "No description provided."}
                </p>
              </div>
              {selectedItem.attributes?.has_complex_variants && selectedItem.attributes.specs.map((spec) => (
                <div key={spec.name} className="space-y-3">
                  <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">{spec.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {spec.options.map(opt => {
                      const isSelected = selections[spec.name] === opt
                      return (
                        <button key={opt} onClick={() => setSelections(prev => ({ ...prev, [spec.name]: opt }))} className={`px-6 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground hover:border-primary/50'}`}>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6 mt-4 border-t border-border">
               <button onClick={addToCart} disabled={isOutOfStock} className="w-full py-5 bg-primary disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-primary-foreground rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-transform flex items-center justify-center gap-2 hover:opacity-90">
                 {isOutOfStock ? "SOLD OUT" : <><ShoppingBag size={20} /> ADD TO BAG</>}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CART DRAWER --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-sm bg-card h-full p-0 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 border-l border-border">
            <div className="p-6 pb-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black uppercase text-foreground">Your Bag</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 bg-secondbg rounded-full hover:bg-border text-foreground"><X size={18} /></button>
              </div>
              {cart.length > 0 && finalTotal < FREE_SHIPPING_THRESHOLD && (
                <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20 mb-2">
                   <p className="text-xs font-bold text-primary mb-2 flex items-center gap-2"><PackageOpen size={14}/> Add ₹{FREE_SHIPPING_THRESHOLD - finalTotal} for <span className="uppercase">Free Shipping</span></p>
                   <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                     <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressToFreeShipping}%` }} />
                   </div>
                </div>
              )}
               {cart.length > 0 && finalTotal >= FREE_SHIPPING_THRESHOLD && (
                <div className="bg-[var(--success)]/10 p-3 rounded-2xl border border-[var(--success)]/20 mb-2 text-center">
                   <p className="text-xs font-black text-[var(--success)] uppercase flex items-center justify-center gap-2"><CheckCircle size={14}/> You unlocked Free Shipping!</p>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 px-6 pb-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40 space-y-4">
                  <ShoppingBag size={64} className="text-muted-foreground" />
                  <p className="font-bold text-muted-foreground">Your bag is empty.</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-primary font-bold text-sm hover:underline">Start Shopping</button>
                </div>
              ) : cart.map(c => {
                 const stockLimit = c.variant ? c.variant.stock : c.item.stock_quantity;
                 return (
                  <div key={c.id} className="flex gap-4 items-start py-2 border-b border-border last:border-0 pb-4">
                    <div className="w-20 h-20 rounded-2xl bg-secondbg overflow-hidden flex-shrink-0 border border-border">
                      {c.variant?.image || c.item.image_url ? (
                        <img src={c.variant?.image || c.item.image_url} className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full bg-secondbg flex items-center justify-center text-xs font-bold text-muted-foreground">IMG</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{c.item.name}</p>
                      {c.variant && <p className="text-xs font-bold text-muted-foreground mt-1">{c.variant.title}</p>}
                      <p className="text-primary font-black mt-1">₹{c.variant?.price || c.item.price}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <button onClick={() => updateQty(c.id, 1, stockLimit)} className="p-1 bg-secondbg rounded-lg hover:bg-border text-foreground"><Plus size={12}/></button>
                      <span className="font-bold text-sm text-foreground">{c.qty}</span>
                      <button onClick={() => updateQty(c.id, -1, stockLimit)} className="p-1 bg-secondbg rounded-lg hover:bg-border text-foreground"><Minus size={12}/></button>
                    </div>
                    <button onClick={() => setCart(prev => prev.filter(i => i.id !== c.id))} className="text-muted-foreground hover:text-destructive"><Trash2 size={16}/></button>
                  </div>
              )})}
            </div>
            {cart.length > 0 && (
              <div className="bg-secondbg p-6 space-y-4 border-t border-border">
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Ticket size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input 
                        placeholder="COUPON CODE" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="w-full pl-9 pr-3 py-3 bg-card rounded-xl text-sm font-bold text-foreground outline-none border border-border focus:border-primary transition-all uppercase"
                      />
                    </div>
                    <button onClick={handleApplyCoupon} disabled={!couponInput || isValidatingCoupon} className="px-4 bg-foreground text-background rounded-xl font-bold text-sm disabled:opacity-50">
                      {isValidatingCoupon ? <Loader2 className="animate-spin" size={16}/> : "Apply"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-[var(--success)]/30 shadow-sm">
                    <div className="flex items-center gap-2 text-[var(--success)]">
                      <CheckCircle size={16} />
                      <span className="font-bold text-sm">Code {appliedCoupon.code} applied!</span>
                    </div>
                    <button onClick={() => { setAppliedCoupon(null); setCouponInput(''); }} className="text-destructive hover:underline font-bold text-xs">Remove</button>
                  </div>
                )}
                
                {/* 🔒 INDUSTRIAL GRADE PINCODE CHECKER (Uncommented and Integrated) */}
                <PincodeChecker shopId={shop?.id || 0}/>
                
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm font-bold text-muted-foreground"><span>Subtotal</span><span>₹{subtotal}</span></div>
                  {appliedCoupon && <div className="flex justify-between text-sm font-bold text-[var(--success)]"><span>Discount</span><span>-₹{discountAmount}</span></div>}
                  <div className="flex justify-between text-2xl font-black text-foreground pt-3 border-t border-border"><span>Total</span><span>₹{finalTotal}</span></div>
                </div>
                <button onClick={handleCheckout} className="w-full py-4 bg-[#25D366] text-white rounded-[2rem] font-black shadow-lg hover:shadow-green-500/20 transition-all flex items-center justify-center gap-2 text-lg active:scale-95 hover:opacity-90">
                   CHECKOUT ON WHATSAPP <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-12 mb-8 p-6 bg-secondbg rounded-[2.5rem] text-center max-w-lg mx-auto">
         <p className="text-[10px] font-black uppercase text-muted-foreground mb-2 tracking-widest">Store Policy</p>
         <p className="text-xs font-medium text-foreground/70 leading-relaxed">
            {shop?.return_policy || "No returns or exchanges allowed."}
         </p>
         <div className="mt-6 pt-6 border-t border-border">
             <p className="text-[10px] font-bold text-muted-foreground/50">Powered by CopIt</p>
         </div>
      </div>
    </div>
  )
}