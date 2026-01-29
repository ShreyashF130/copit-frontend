'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { toast } from 'sonner'
import { Save, Lock, MapPin, Rocket, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ShippingSettings() {
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
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    // Safety: Only Pro users can enable
    const isEnabled = shop.plan_type === 'pro' ? (formData.get('sr_enabled') === 'on') : false

    const updates = {
      shiprocket_email: formData.get('sr_email'),
      shiprocket_password: formData.get('sr_password'),
      // We store the pickup alias so the backend knows where to ship from
      pickup_address: formData.get('sr_pickup'), 
      is_shiprocket_enabled: isEnabled
    }

    const { error } = await supabase.from('shops').update(updates).eq('id', shop.id)
    if (error) toast.error("Failed to save")
    else {
        toast.success("Shipping logistics updated!")
        fetchSettings()
    }
    setLoading(false)
  }

  if (!shop) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
  const isPro = shop.plan_type === 'pro'

  return (
    <form onSubmit={handleSave} className="animate-in fade-in slide-in-from-bottom-4">
      
      <div className={`bg-card p-8 rounded-[2.5rem] border border-border shadow-sm relative overflow-hidden transition-all ${!isPro ? 'opacity-80' : ''}`}>
        
        {/* LOCK SCREEN */}
        {!isPro && (
            <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                <div className="bg-foreground text-card p-3 rounded-full mb-3 shadow-xl"><Lock size={24} /></div>
                <h3 className="text-lg font-black text-foreground">UPGRADE TO AUTOMATE</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1 mb-4">Unlock 1-Click Shipping with Shiprocket.</p>
                <Link href='/dashboard/billing' className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-black text-xs uppercase hover:opacity-90 transition-all">Get Pro</Link>
            </div>
        )}

        <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-[var(--warning)]/10 text-[var(--warning)] rounded-xl"><Rocket size={24} /></div>
                <div>
                    <h3 className="font-black text-lg text-foreground">Shiprocket Integration</h3>
                    <p className="text-xs text-muted-foreground font-bold">Auto-generate labels & tracking links.</p>
                </div>
            </div>
            {/* TOGGLE */}
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="sr_enabled" defaultChecked={shop.is_shiprocket_enabled} disabled={!isPro} className="sr-only peer" />
                <div className="w-14 h-7 bg-muted/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[var(--warning)]"></div>
            </label>
        </div>

        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">Shiprocket Email</label>
                    <input 
                        name="sr_email" 
                        type="email" 
                        defaultValue={shop.shiprocket_email} 
                        disabled={!isPro} 
                        className="w-full p-4 mt-2 bg-secondbg rounded-2xl font-bold text-foreground outline-none focus:ring-2 focus:ring-[var(--warning)] border border-transparent focus:bg-card transition-all placeholder:text-muted-foreground/50" 
                    />
                </div>
                <div>
                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">Shiprocket Password</label>
                    <input 
                        name="sr_password" 
                        type="password" 
                        defaultValue={shop.shiprocket_password} 
                        disabled={!isPro} 
                        className="w-full p-4 mt-2 bg-secondbg rounded-2xl font-bold text-foreground outline-none focus:ring-2 focus:ring-[var(--warning)] border border-transparent focus:bg-card transition-all placeholder:text-muted-foreground/50" 
                    />
                </div>
            </div>

            {/* CRITICAL FIELD: PICKUP LOCATION */}
            <div className="bg-[var(--warning)]/5 p-6 rounded-2xl border border-[var(--warning)]/20">
                <div className="flex items-center gap-2 mb-2 text-[var(--warning)] font-black text-sm uppercase">
                    <MapPin size={16} /> Pickup Location Alias
                </div>
                <p className="text-xs text-muted-foreground mb-4 font-medium leading-relaxed">
                    <strong className="text-foreground">Important:</strong> Enter the exact "Nickname" of your pickup address as saved in your Shiprocket account (e.g., "Home", "Warehouse1"). If this is wrong, booking will fail.
                </p>
                <input 
                    name="sr_pickup" 
                    defaultValue={shop.pickup_address || "Primary"} 
                    placeholder="e.g. Primary" 
                    disabled={!isPro}
                    className="w-full p-4 bg-card rounded-xl font-black text-foreground outline-none focus:ring-2 focus:ring-[var(--warning)] border border-border" 
                />
            </div>
        </div>

      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className="w-full mt-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : <><Save size={18} /> Save Logistics</>}
      </button>
    </form>
  )
}