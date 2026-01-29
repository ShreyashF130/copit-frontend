
import { createClient } from '@/app/lib/supabase-browser'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, ShieldCheck, Zap, ArrowRight, Package } from 'lucide-react'
import PublicHeader from '@/app/components/publicheader' // <--- Create this component (See Below)

// Force dynamic so we catch the searchParams every time
export const dynamic = 'force-dynamic'

export default async function PublicProductPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>, 
  searchParams: Promise<{ ref?: string }> 
}) {
  const { id } = await params
  const { ref } = await searchParams
  
  // 1. CAPTURE THE SOURCE (Default to 'Direct' if missing)
  const source = ref ? ref.toUpperCase() : 'DIRECT'

  const supabase = createClient()

  // 2. FETCH DATA
  const { data: item, error: itemError } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single()

  if (itemError || !item) return notFound()

  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .select('id, name, phone_number, logo_url') 
    .eq('id', item.shop_id)
    .single()

  if (shopError || !shop) return notFound()

  const { data: moreItems } = await supabase
    .from('items')
    .select('id, name, price, image_url')
    .eq('shop_id', shop.id)
    .neq('id', item.id)
    .limit(4)

  // 3. INJECT SOURCE INTO WHATSAPP MESSAGE
  const message = `Hi ${shop.name}! I want to buy:
  
📦 *${item.name}*
💰 Price: ₹${item.price}
🔗 Source: ${source}

(Ref: buy_item_${item.id}_${source.toLowerCase()})`

  const waLink = `https://wa.me/${shop.phone_number}?text=${encodeURIComponent(message)}`
  const storeLink = `/s/${shop.id}?ref=${source.toLowerCase()}` 

  return (
    <div className="min-h-screen bg-background pb-32 font-sans text-foreground selection:bg-primary/20">
      
      {/* HEADER (Client Component for Theme Toggle) */}
      <PublicHeader shop={shop} storeLink={storeLink} />

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-start animate-in fade-in duration-500">
        
        {/* PRODUCT IMAGE */}
        <div className="relative aspect-square w-full bg-card rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5 border border-border md:sticky md:top-24 group">
            {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 font-black text-9xl uppercase italic bg-secondbg">
                {item.name[0]}
            </div>
            )}
            <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest text-foreground shadow-sm border border-border">
                {item.category}
            </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-8 pt-4">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
                    {item.name}
                </h1>
                <div className="flex items-center gap-4">
                    <p className="text-4xl font-black text-primary tracking-tighter">₹{item.price}</p>
                    {/* Source Pill */}
                    {ref && (
                        <div className="bg-secondbg text-muted-foreground px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border border-border">
                            Via {source}
                        </div>
                    )}
                </div>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                    {item.description || "This exclusive item is available directly through our WhatsApp store."}
                </p>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-2xl border border-border shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary"><Zap size={20} fill="currentColor" /></div>
                    <div>
                        <p className="text-xs font-bold text-foreground uppercase">Instant</p>
                        <p className="text-[10px] font-medium text-muted-foreground">Checkout via WhatsApp</p>
                    </div>
                </div>
                <div className="p-4 bg-card rounded-2xl border border-border shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--success)]/10 rounded-full flex items-center justify-center text-[var(--success)]"><ShieldCheck size={20} /></div>
                    <div>
                        <p className="text-xs font-bold text-foreground uppercase">Secure</p>
                        <p className="text-[10px] font-medium text-muted-foreground">Verified Merchant</p>
                    </div>
                </div>
            </div>

            <div className="h-px bg-border w-full" />

            {/* MORE FROM STORE */}
            {moreItems && moreItems.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h3 className="font-black text-lg text-foreground">More from {shop.name}</h3>
                        <Link href={storeLink} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                            View All <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {moreItems.map((prod) => (
                            <Link key={prod.id} href={`/product/${prod.id}?ref=${source.toLowerCase()}`} className="group bg-card p-3 rounded-2xl border border-border hover:shadow-lg hover:border-primary/20 transition-all">
                                <div className="aspect-square bg-secondbg rounded-xl mb-3 overflow-hidden">
                                    {prod.image_url ? (
                                      <img src={prod.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Package size={16}/></div>
                                    )}
                                </div>
                                <p className="font-bold text-sm text-foreground truncate">{prod.name}</p>
                                <p className="text-xs font-black text-primary">₹{prod.price}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* STICKY CTA BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-card/80 backdrop-blur-xl border-t border-border flex justify-center z-50">
        <a 
          href={waLink}
          target="_blank"
          className="w-full max-w-lg bg-[#25D366] hover:bg-[#1fb355] text-white py-4 md:py-5 rounded-[2rem] font-black text-lg tracking-wide text-center flex items-center justify-center gap-3 shadow-2xl shadow-[#25D366]/20 hover:-translate-y-1 transition-all active:scale-95"
        >
          <ShoppingCart size={24} strokeWidth={3} />
            ON WHATSAPP
        </a>
      </div>
    </div>
  )
}