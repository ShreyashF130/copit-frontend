'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { 
  Ticket, Plus, Trash2, Loader2, Percent, Coins 
} from 'lucide-react'
import { toast } from 'sonner'

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [shopId, setShopId] = useState<number | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchCoupons()
  }, [])

  async function fetchCoupons() {
    // 1. Get Shop ID First
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: shop } = await supabase.from('shops').select('id').eq('owner_id', user.id).single()
    if (!shop) return
    setShopId(shop.id)

    // 2. Fetch Coupons
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('shop_id', shop.id)
      .order('created_at', { ascending: false })

    if (error) toast.error(error.message)
    else setCoupons(data || [])
    setLoading(false)
  }

  async function handleAddCoupon(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!shopId) return
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const newCoupon = {
      shop_id: shopId,
      code: (formData.get('code') as string).toUpperCase().trim(),
      discount_type: formData.get('type'),
      value: parseFloat(formData.get('value') as string),
      is_active: true
    }

    const { error } = await supabase.from('coupons').insert([newCoupon])

    if (error) {
      toast.error("Failed: " + error.message)
    } else {
      toast.success("Coupon created!")
      setIsAdding(false)
      fetchCoupons()
    }
    setLoading(false)
  }

  async function deleteCoupon(id: number) {
    if (!confirm("Delete this coupon? Users won't be able to use it anymore.")) return
    await supabase.from('coupons').delete().eq('id', id)
    fetchCoupons()
    toast.success("Coupon deleted")
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 min-h-screen animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-6 rounded-[2rem] shadow-sm border border-border">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
            <Ticket className="text-primary" /> COUPON MANAGER
          </h1>
          <p className="text-muted-foreground font-bold text-sm mt-1">Create discounts to boost conversion</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-foreground text-card dark:bg-primary dark:text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-muted/20"
        >
          <Plus size={18} /> CREATE CODE
        </button>
      </div>

      {/* COUPON GRID */}
      {loading && !isAdding ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
              {/* Ticket Notch Design - Background color matches body background */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border border-border" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border border-border" />

              <div className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                  {coupon.discount_type === 'percent' ? <Percent size={24} /> : <Coins size={24} />}
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-foreground tracking-widest">{coupon.code}</h3>
                  <p className="text-sm font-bold text-muted-foreground mt-1 uppercase">
                    {coupon.discount_type === 'percent' ? `${coupon.value}% OFF` : `₹${coupon.value} FLAT OFF`}
                  </p>
                </div>

                <div className="w-full pt-4 border-t border-dashed border-border flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded">Active</span>
                  <button 
                    onClick={() => deleteCoupon(coupon.id)}
                    className="text-destructive hover:text-red-600 p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {coupons.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground font-bold opacity-50 flex flex-col items-center gap-2">
              <Ticket size={40} className="mb-2 opacity-20" />
              No coupons yet. Create your first one!
            </div>
          )}
        </div>
      )}

      {/* ADD MODAL */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative animate-in zoom-in-95 border border-border">
            <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-foreground">New Coupon</h2>
            
            <form onSubmit={handleAddCoupon} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Coupon Code</label>
                <input name="code" required placeholder="SUMMER20" className="w-full p-3 bg-secondbg text-foreground rounded-xl font-bold outline-none focus:ring-2 focus:ring-primary uppercase border border-transparent focus:bg-card transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">Type</label>
                  <select name="type" className="w-full p-3 bg-secondbg text-foreground rounded-xl font-bold outline-none border border-transparent focus:ring-2 focus:ring-primary">
                    <option value="percent">Percent (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">Value</label>
                  <input name="value" type="number" required placeholder="20" className="w-full p-3 bg-secondbg text-foreground rounded-xl font-bold outline-none focus:ring-2 focus:ring-primary border border-transparent focus:bg-card" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 font-bold text-muted-foreground hover:bg-secondbg rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground font-black rounded-xl hover:opacity-90 shadow-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}