'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, ShieldCheck, Zap, ArrowRight, Package, Loader2 } from 'lucide-react'
import PublicHeader from '@/app/components/publicheader'

export default function PublicProductPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  
  const shop_slug = params?.shop_slug as string
  const product_slug = params?.product_slug as string
  const ref = searchParams?.get('ref')
  const source = ref ? ref.toUpperCase() : 'DIRECT'

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const apiUrl = rawApiUrl.replace(/\/$/, '')

  useEffect(() => {
    if (!shop_slug || !product_slug) return

    const fetchItem = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/storefront/${shop_slug}/item/${product_slug}`)
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8"/></div>
  if (error || !data) return <div className="min-h-screen flex items-center justify-center font-black text-2xl">Item Not Found</div>

  const { shop, item, more_items } = data
  const storeLink = `/shop/${shop.slug}?ref=${source.toLowerCase()}` 

  // Format WhatsApp Message
  const message = `Hi ${shop.name}! I want to buy:\n\n📦 *${item.name}*\n💰 Price: ₹${item.price}\n🔗 Source: ${source}\n\n(Ref: buy_item_${item.id}_${source.toLowerCase()})`
  const waLink = `https://wa.me/${process.env.NEXT_PUBLIC_BOT_PHONE}?text=${encodeURIComponent(message)}`

  return (
    <div className="min-h-screen bg-background pb-32 font-sans text-foreground selection:bg-primary/20 animate-in fade-in">
      <PublicHeader shop={shop} storeLink={storeLink} />

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* PRODUCT IMAGE */}
        <div className="relative aspect-square w-full bg-card rounded-[2.5rem] overflow-hidden shadow-2xl border border-border md:sticky md:top-24 group">
            {item.image_url ? (
               <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 font-black text-9xl uppercase italic bg-secondbg">{item.name[0]}</div>
            )}
            <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest border border-border">
                {item.category || 'Product'}
            </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-8 pt-4">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">{item.name}</h1>
                <div className="flex items-center gap-4">
                    <p className="text-4xl font-black text-primary tracking-tighter">₹{item.price}</p>
                    {ref && <div className="bg-secondbg px-3 py-1 rounded-lg text-[10px] font-bold uppercase border border-border">Via {source}</div>}
                </div>
            </div>

            <p className="text-lg text-muted-foreground font-medium leading-relaxed whitespace-pre-line">
                {item.description || "This exclusive item is available directly through our WhatsApp store."}
            </p>

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
                                      <img src={prod.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
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
        <a href={waLink} target="_blank" className="w-full max-w-lg bg-[#25D366] hover:bg-[#1fb355] text-white py-4 md:py-5 rounded-[2rem] font-black text-lg tracking-wide text-center flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95">
          <ShoppingCart size={24} strokeWidth={3} /> CHECKOUT ON WHATSAPP
        </a>
      </div>
    </div>
  )
}