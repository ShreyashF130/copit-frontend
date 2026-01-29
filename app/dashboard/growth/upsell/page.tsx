'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { toast } from 'sonner'
import { Zap, Save, CheckCircle, Search, ArrowUpDown, AlertCircle, Loader2 } from 'lucide-react'

export default function UpsellPage() {
  const [shop, setShop] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  // Search & Sort State
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest')
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: shopData } = await supabase.from('shops').select('*').eq('owner_id', user.id).single()
    if (shopData) {
        setShop(shopData)
        if(shopData.upsell_item_id) setSelectedItemId(shopData.upsell_item_id)
    }

    const { data: itemsData } = await supabase.from('items')
      .select('id, name, price, image_url')
      .eq('shop_id', shopData.id)
      .order('id', { ascending: false }) 
      
    setItems(itemsData || [])
  }

  const filteredItems = items
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'latest') return b.id - a.id
      return a.id - b.id
    })

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if(!selectedItemId) { toast.error("Please select a product first!"); return; }
    
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const updates = {
      is_upsell_enabled: formData.get('enabled') === 'on',
      upsell_item_id: selectedItemId,
      upsell_discount: formData.get('discount')
    }

    const { error } = await supabase.from('shops').update(updates).eq('id', shop.id)
    if (error) toast.error(error.message)
    else toast.success("Upsell Strategy Saved! 🚀")
    
    setLoading(false)
  }

  if (!shop) return (
    <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
    </div>
  )

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* MAIN CARD */}
      <div className="bg-card p-8 md:p-10 rounded-[2.5rem] border border-border relative overflow-hidden shadow-sm transition-colors">
        
        {/* HEADER */}
        <div className="relative z-10 mb-8 border-b border-border pb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                <div className="p-2 bg-[var(--warning)]/10 rounded-xl text-[var(--warning)]">
                   <Zap size={24} fill="currentColor" />
                </div>
                VISUAL UPSELL ENGINE
              </h1>
              <p className="text-sm text-muted-foreground font-bold mt-2 ml-1">
                Select the product image to pitch automatically 10s after a sale.
              </p>
            </div>
            
            {/* Status Badge */}
            <div className={`px-4 py-2 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 border ${shop.is_upsell_enabled ? 'bg-[var(--success)]/10 border-[var(--success)]/20 text-[var(--success)]' : 'bg-secondbg border-border text-muted-foreground'}`}>
               <span className={`w-2 h-2 rounded-full ${shop.is_upsell_enabled ? 'bg-[var(--success)]' : 'bg-muted'}`} />
               {shop.is_upsell_enabled ? 'Engine Active' : 'Engine Sleeping'}
            </div>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--warning)]/20 rounded-full blur-3xl opacity-30 pointer-events-none" />

        <form onSubmit={handleSave} className="space-y-10 relative z-10">
          
          {/* TOGGLE SWITCH */}
          <div className="flex items-center justify-between bg-secondbg p-5 rounded-2xl border border-border">
            <div className="flex items-center gap-3">
               <Zap className={shop.is_upsell_enabled ? "text-[var(--warning)]" : "text-muted-foreground"} />
               <span className="font-bold text-foreground text-lg">Enable Engine</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="enabled" defaultChecked={shop.is_upsell_enabled} className="sr-only peer" />
              <div className="w-14 h-8 bg-muted/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[var(--warning)]"></div>
            </label>
          </div>

          {/* SEARCH & GRID */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Select Pitch Product</label>
                <span className="text-xs font-bold text-muted-foreground">{filteredItems.length} Products Found</span>
             </div>

             <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                   <input 
                      type="text" 
                      placeholder="Search by name..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-secondbg rounded-xl font-bold text-foreground outline-none focus:ring-2 focus:ring-primary border border-transparent transition-all placeholder:text-muted-foreground"
                   />
                </div>
                <div className="relative min-w-[180px]">
                   <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                   <select 
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'latest' | 'oldest')}
                      className="w-full pl-12 pr-4 py-4 bg-secondbg rounded-xl font-bold text-foreground outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer border border-transparent"
                   >
                      <option value="latest">Latest First</option>
                      <option value="oldest">Oldest First</option>
                   </select>
                </div>
             </div>

             {/* PRODUCT GRID */}
             <input type="hidden" name="item_id" value={selectedItemId || ''} />
             
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto p-4 bg-secondbg/50 rounded-2xl border border-border">
                {filteredItems.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-muted-foreground font-bold opacity-60 flex flex-col items-center gap-2">
                      <Search size={32} />
                      No products found.
                  </div>
                ) : filteredItems.map(item => {
                    const isSelected = selectedItemId === item.id
                    return (
                    <div 
                        key={item.id} 
                        onClick={() => setSelectedItemId(item.id)}
                        className={`relative cursor-pointer group rounded-2xl overflow-hidden border-2 transition-all duration-200 
                            ${isSelected 
                                ? 'border-[var(--warning)] shadow-xl scale-[1.02] z-10' 
                                : 'border-transparent bg-card hover:border-border hover:shadow-md'
                            }`}
                    >
                        <div className="aspect-square bg-secondbg relative">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Zap size={24}/></div>
                            )}
                            <div className={`absolute inset-0 bg-[var(--warning)]/20 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                        <div className="p-3 bg-card text-center">
                             <p className="font-bold text-sm text-foreground truncate">{item.name}</p>
                             <p className="text-xs font-bold text-muted-foreground mt-1">₹{item.price}</p>
                        </div>
                        {isSelected && (
                            <div className="absolute top-2 right-2 bg-[var(--warning)] text-white rounded-full p-1.5 shadow-lg animate-in zoom-in">
                                <CheckCircle size={16} fill="white" className="text-[var(--warning)]" />
                            </div>
                        )}
                    </div>
                    )
                })}
             </div>
          </div>

          {/* FOOTER */}
          <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-border">
            <div className="space-y-2 md:col-span-1">
              <label className="text-xs font-black uppercase text-muted-foreground">Discount Offer (%)</label>
              <div className="relative group">
                <input 
                  type="number" 
                  name="discount" 
                  defaultValue={shop.upsell_discount} 
                  min="5" max="90"
                  className="w-full p-4 bg-secondbg rounded-xl font-bold text-foreground outline-none focus:ring-2 focus:ring-primary border border-border group-hover:border-primary/50 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground group-hover:text-primary">% OFF</span>
              </div>
            </div>

            <div className="md:col-span-2 flex items-end">
              <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={18} />}
                {loading ? "Saving Strategy..." : "Save Visual Strategy"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* HOW IT WORKS */}
      <div className="bg-[var(--warning)]/5 p-6 rounded-2xl border border-[var(--warning)]/20 flex items-start gap-4">
         <AlertCircle className="text-[var(--warning)] flex-shrink-0" />
         <div>
           <h4 className="font-black text-[var(--warning)] text-sm uppercase">How it works</h4>
           <p className="text-xs text-foreground/80 mt-1 leading-relaxed">
             When a customer completes an order, the bot waits 10 seconds, then sends:
             <br />
             <em className="block mt-2 font-medium">
               "Wait! 🔥 Exclusive Deal: Get <strong>[Product Name]</strong> for <strong>[Discount]% OFF</strong>! Reply 'YES' to add to your order."
             </em>
           </p>
         </div>
       </div>
    </div>
  )
}