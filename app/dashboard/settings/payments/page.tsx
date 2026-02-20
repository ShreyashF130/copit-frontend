'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { toast } from 'sonner'
import Link from 'next/link'
import { Save, Lock, CreditCard, Smartphone } from 'lucide-react'

export default function PaymentSettings() {
  const [shop, setShop] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => { fetchSettings() }, [])

  async function fetchSettings() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('shops').select('*').eq('owner_id', user.id).single()
    setShop(data)
  }

async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    // 👈 1. CAPTURE THE FORM IMMEDIATELY BEFORE ANY AWAIT
    const form = e.currentTarget 
    
    setLoading(true)
    const formData = new FormData(form)
    
    const useRazorpay = formData.get('rzp_toggle') === 'on'
    const method = useRazorpay ? 'razorpay' : 'upi'

    try {
      const res = await fetch('/api/settings/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shop_id: shop.id,
          upi_id: formData.get('upi_id'),
          rzp_key: formData.get('rzp_key'), 
          rzp_secret: formData.get('rzp_secret'), 
          active_method: method
        })
      })

      if (!res.ok) throw new Error("Failed to save")
      
      toast.success("Payment settings securely updated!")
      fetchSettings() 
      
      // 👈 2. USE THE CAPTURED VARIABLE HERE
      form.reset() 
      
    } catch (err) {
      console.error(err) // Added so you can see actual errors in the console
      toast.error("Error updating settings")
    } finally {
      setLoading(false)
    }
  }

  if (!shop) return <div className="p-10 text-muted-foreground font-bold">Loading...</div>
  const isPro = shop.plan_type === 'pro'

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      
      {/* 1. UPI SECTION */}
      <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><Smartphone size={24} /></div>
            <div>
                <h3 className="font-black text-lg text-foreground">Manual UPI</h3>
                <p className="text-xs text-muted-foreground font-bold">Accept payments directly to your VPA.</p>
            </div>
        </div>
        <div>
            <label className="text-xs font-black uppercase text-muted-foreground ml-2">Your UPI ID</label>
            <input 
                name="upi_id" 
                defaultValue={shop.upi_id} 
                placeholder="shop@okhdfcbank" 
                className="w-full p-4 mt-2 bg-secondary rounded-2xl font-bold text-foreground outline-none focus:ring-2 focus:ring-green-500 border border-transparent transition-all placeholder:text-muted-foreground/50"
            />
        </div>
      </div>

      {/* 2. RAZORPAY SECTION */}
      <div className={`bg-card p-8 rounded-[2.5rem] border border-border shadow-sm relative overflow-hidden transition-all ${!isPro ? 'opacity-80' : ''}`}>
        
        {/* LOCK SCREEN */}
        {!isPro && (
            <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                <div className="bg-foreground text-background p-3 rounded-full mb-3 shadow-xl"><Lock size={24} /></div>
                <h3 className="text-lg font-black text-foreground">PRO FEATURE LOCKED</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1 mb-4">Automate payments with Razorpay integration.</p>
                <Link href='/dashboard/billing' className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-black text-xs uppercase hover:opacity-90 transition-opacity">Get Pro</Link>
            </div>
        )}

        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 text-primary rounded-xl"><CreditCard size={24} /></div>
                <div>
                    <h3 className="font-black text-lg text-foreground">Razorpay Gateway</h3>
                    <p className="text-xs text-muted-foreground font-bold">Zero-friction payments. No screenshots.</p>
                </div>
            </div>
            {/* TOGGLE */}
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="rzp_toggle" defaultChecked={shop.active_payment_method === 'razorpay'} disabled={!isPro} className="sr-only peer" />
                <div className="w-14 h-7 bg-muted/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
            </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="text-xs font-black uppercase text-muted-foreground ml-2 flex justify-between">
                  Key ID {shop.razorpay_key_id && <span className="text-green-500">(Saved)</span>}
                </label>
                {/* ⚠️ Notice we removed defaultValue so encrypted strings aren't shown */}
                <input 
                    name="rzp_key" 
                    type="password" 
                    placeholder={shop.razorpay_key_id ? "••••••••••••••••" : "rzp_live_XXXXX"}
                    disabled={!isPro} 
                    className="w-full p-4 mt-2 bg-secondary rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary border border-transparent transition-all text-foreground placeholder:text-muted-foreground/40" 
                />
            </div>
            <div>
                <label className="text-xs font-black uppercase text-muted-foreground ml-2 flex justify-between">
                  Key Secret {shop.razorpay_key_secret && <span className="text-green-500">(Saved)</span>}
                </label>
                <input 
                    name="rzp_secret" 
                    type="password" 
                    placeholder={shop.razorpay_key_secret ? "••••••••••••••••" : "Paste Secret Here"}
                    disabled={!isPro} 
                    className="w-full p-4 mt-2 bg-secondary rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary border border-transparent transition-all text-foreground placeholder:text-muted-foreground/40" 
                />
            </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-4 font-medium">* Leave Key fields blank if you do not want to change your existing saved keys.</p>
      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl"
      >
        {loading ? "Saving..." : <><Save size={18} /> Save Settings</>}
      </button>
    </form>
  )
}