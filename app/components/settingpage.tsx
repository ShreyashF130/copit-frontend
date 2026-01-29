'use client'

import { useState } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { Save, Globe, MapPin, ShieldCheck, Loader2, Info } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsClient({ shopData }: { shopData: any }) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleUpdateSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    const updates = {
      display_name: formData.get('display_name'),
      city: formData.get('city'),
      address: formData.get('address'),
      is_public: formData.get('is_public') === 'on', // Checkbox logic
    }

    const { error } = await supabase
      .from('shops')
      .update(updates)
      .eq('id', shopData.id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Store configuration updated!")
    }
    setLoading(false)
  }

  // RUTHLESS GUARD: If data is somehow missing, show a fallback
  if (!shopData) return <div className="p-10 text-center italic">Loading shop data...</div>

  const inputStyle = "w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-border dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-600 dark:text-white transition-all"

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="space-y-1">
        <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Settings</h1>
        <p className="text-slate-500 text-sm font-medium">Control your store's visibility and regional discovery.</p>
      </header>

      <form onSubmit={handleUpdateSettings} className="space-y-6">
        
        {/* DISCOVERY & PRIVACY CARD */}
        <div className="bg-card dark:bg-slate-900 border border-border dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="font-black dark:text-white uppercase text-sm tracking-widest">Store Discovery</h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  When enabled, users searching for "Shops near me" can find your store in the Zenith catalog.
                </p>
              </div>
            </div>
            
            {/* THE TOGGLE */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="is_public" 
                defaultChecked={shopData?.is_public ?? false} // Defensive fix
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                Display Name <Info size={10} />
              </label>
              <input 
                name="display_name" 
                defaultValue={shopData?.display_name || ''} 
                placeholder="The name customers see"
                className={inputStyle} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                City / Region <MapPin size={10} />
              </label>
              <input 
                name="city" 
                defaultValue={shopData?.city || ''} 
                placeholder="e.g. Pune, Maharashtra"
                className={inputStyle} 
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                Full Address (For Delivery/Pickup) <ShieldCheck size={10} className="text-emerald-500" />
              </label>
              <textarea 
                name="address" 
                defaultValue={shopData?.address || ''} 
                rows={3} 
                placeholder="Enter full address only if you offer local pickup..."
                className={inputStyle} 
              />
              <p className="text-[9px] text-slate-400 italic mt-1">
                * Note: Your full address is only shared with customers AFTER a successful order.
              </p>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <><Save size={20} /> Update Configuration</>
          )}
        </button>
      </form>
    </div>
  )
}