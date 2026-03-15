import { createClient } from '@/app/lib/supabase-browser'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, ShieldCheck, ArrowRight, Package, BadgeCheck, Lock, MessageCircle, Instagram } from 'lucide-react'
import PublicHeader from '@/app/components/publicheader'

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
    .select('id, name, phone_number, logo_url, instagram_handle') 
    .eq('id', item.shop_id)
    .single()

  if (shopError || !shop) return notFound()

  const { data: moreItems } = await supabase
    .from('items')
    .select('id, name, price, image_url')
    .eq('shop_id', shop.id)
    .neq('id', item.id)
    .limit(4)

  // 3. INJECT SOURCE INTO WHATSAPP MESSAGE (Upgraded for Trust)
  const message = `Hi ${shop.name}! I am ready to checkout securely for:
  
📦 *${item.name}*
💰 Price: ₹${item.price}
🔗 Source: ${source}

(Ref: buy_item_${item.id}_${source.toLowerCase()})`

  const waLink = `https://wa.me/${process.env.NEXT_PUBLIC_BOT_PHONE}?text=${encodeURIComponent(message)}`
  const storeLink = `/s/${shop.id}?ref=${source.toLowerCase()}` 

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-40 font-sans text-slate-900 dark:text-slate-50 selection:bg-blue-500/20">
      
      {/* 🛡️ TRUST HEADER: Chameleon Mode */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {shop.logo_url ? (
                    <img src={shop.logo_url} alt={shop.name} className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400">
                        {shop.name[0]}
                    </div>
                )}
                <div>
                    <h1 className="font-black text-sm flex items-center gap-1">
                        {shop.name}
                        <BadgeCheck size={16} className="text-blue-500" fill="currentColor" stroke="white" />
                    </h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Official Storefront</p>
                </div>
            </div>
            {shop.instagram_handle && (
                <a href={`https://instagram.com/${shop.instagram_handle}`} target="_blank" className="text-slate-400 hover:text-pink-600 transition-colors">
                    <Instagram size={20} />
                </a>
            )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-start animate-in fade-in duration-500">
        
        {/* PRODUCT IMAGE */}
        <div className="relative aspect-[4/5] w-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 md:sticky md:top-24 group">
            {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-200 dark:text-slate-800 font-black text-9xl uppercase italic bg-slate-50 dark:bg-slate-950">
                {item.name[0]}
            </div>
            )}
        </div>

        {/* DETAILS & TRUST BOX */}
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                        {item.category}
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                    {item.name}
                </h1>
                <div className="flex items-end gap-3">
                    <p className="text-4xl font-black text-slate-900 dark:text-white">₹{item.price}</p>
                    <p className="text-sm font-bold text-slate-400 line-through mb-1">₹{Math.round(item.price * 1.2)}</p>
                </div>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    {item.description || "This exclusive item is available directly through our secure WhatsApp checkout."}
                </p>
            </div>

            {/* 🛡️ THE TRUST BOX (Critical for Conversions) */}
            <div className="bg-[#25D366]/5 border border-[#25D366]/20 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3 text-[#1da851] font-black text-sm uppercase tracking-wide">
                    <Lock size={18} /> 100% Secure Checkout
                </div>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                        <MessageCircle size={16} className="text-[#25D366]" /> Chat & Buy directly on WhatsApp
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                        <ShieldCheck size={16} className="text-[#25D366]" /> Verified Merchant Identity
                    </li>
                </ul>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-800 w-full" />

            {/* MORE FROM STORE */}
            {moreItems && moreItems.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h3 className="font-black text-lg">More from {shop.name}</h3>
                        <Link href={storeLink} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                            View Store <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {moreItems.map((prod) => (
                            <Link key={prod.id} href={`/product/${prod.id}?ref=${source.toLowerCase()}`} className="group bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-blue-500/30 transition-all">
                                <div className="aspect-square bg-slate-50 dark:bg-slate-950 rounded-xl mb-3 overflow-hidden border border-slate-100 dark:border-slate-800">
                                    {prod.image_url ? (
                                      <img src={prod.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-slate-300"><Package size={20}/></div>
                                    )}
                                </div>
                                <p className="font-bold text-sm truncate">{prod.name}</p>
                                <p className="text-sm font-black text-slate-900 dark:text-white mt-1">₹{prod.price}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* STICKY CTA BUTTON & WATERMARK */}
      <div className="fixed bottom-0 left-0 right-0 pt-6 pb-4 px-4 md:px-6 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 z-50 flex flex-col items-center">
        <a 
          href={waLink}
          target="_blank"
          className="w-full max-w-lg bg-[#25D366] hover:bg-[#1fb355] text-white py-4 rounded-2xl font-black text-lg tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-[#25D366]/20 hover:-translate-y-1 transition-all active:scale-95 border border-[#1da851]"
        >
          <MessageCircle size={24} fill="white" className="text-[#25D366]" />
          Buy securely on WhatsApp
        </a>
        
        {/* The "Quiet" CopIt Watermark */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <ShieldCheck size={12} /> Powered by CopIt OS
        </div>
      </div>
    </div>
  )
}