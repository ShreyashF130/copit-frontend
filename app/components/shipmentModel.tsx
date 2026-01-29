'use client'

import { useState } from 'react'
import { X, Rocket, Link as LinkIcon, Loader2, Lock, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface Order {
  id: number
  shops?: {
    plan_type?: string
    is_shiprocket_enabled?: boolean
  }
}

export default function ShipmentModal({ order, onClose, onSuccess }: { order: Order, onClose: () => void, onSuccess: () => void }) {
  const [mode, setMode] = useState<'rocket' | 'manual'>('rocket')
  const [loading, setLoading] = useState(false)
  

  const [courierName, setCourierName] = useState('')
  const [trackingLink, setTrackingLink] = useState('')

  const isPro = (order.shops?.plan_type || 'free') === 'pro'
  const isEnabled = order.shops?.is_shiprocket_enabled

  async function handleShip() {
    setLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL 
      
      let url = ''
      let body = {}

      if (mode === 'rocket') {
        url = `${baseUrl}/api/ship/rocket`
        body = { order_id: order.id }
      } else {
        url = `${baseUrl}/api/ship/manual`
        body = { 
          order_id: order.id, 
          courier_name: courierName, 
          tracking_link: trackingLink 
        }
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()

      if (data.status === 'success') {
        toast.success(mode === 'rocket' ? "Rocket Launched! 🚀" : "Manual Shipment Updated!")
        
        // --- 🚀 FIX: AUTO OPEN PDF LABEL ---
        if (data.label_url) {
            window.open(data.label_url, '_blank')
        }
        
        onSuccess() 
        onClose()   
      } else {
        if (data.message.includes("Pincode")) {
          toast.error("STOP: Customer address is missing Pincode!", {
            description: "Please edit the order address in the database first."
          })
        } else {
          toast.error(data.message)
        }
      }
    } catch (e) {
      console.error(e)
      toast.error("Connection Error. Is the backend running?")
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative overflow-hidden border border-slate-100">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-900 z-10 hover:rotate-90 transition-all"><X size={20} /></button>
        
        <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-2">
          Ship Order <span className="text-blue-600">#{order.id}</span>
        </h2>

        {/* TABS */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 relative z-10">
          <button 
            onClick={() => setMode('rocket')}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'rocket' ? 'bg-white shadow-md text-blue-600 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Rocket size={16} /> Automated
          </button>
          <button 
            onClick={() => setMode('manual')}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'manual' ? 'bg-white shadow-md text-slate-900 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LinkIcon size={16} /> Manual Link
          </button>
        </div>

        {/* --- MODE: SHIPROCKET --- */}
        {mode === 'rocket' && (
          <div className="relative">
            {!isPro && (
              <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-4 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="bg-slate-900 text-white p-4 rounded-full mb-3 shadow-xl ring-4 ring-slate-100">
                    <Lock size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900">PRO FEATURE</h3>
                <p className="text-xs text-slate-500 font-bold mt-1 mb-4 max-w-[220px]">
                  Connect Shiprocket accounts and automate labels instantly.
                </p>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200 hover:scale-105 transition-all">
                  Upgrade Now
                </button>
              </div>
            )}

            <div className={`bg-blue-50/50 p-8 rounded-3xl border border-blue-100 text-center space-y-4 ${!isPro ? 'opacity-40 blur-sm' : ''}`}>
              <div className="w-20 h-20 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-sm border border-blue-100">
                <Rocket size={40} className="ml-1" />
              </div>
              <div>
                <h3 className="font-black text-blue-900 text-lg">One-Click Dispatch</h3>
                <p className="text-sm text-blue-800/60 mt-2 font-medium leading-relaxed">
                  We will request a pickup from your <strong>"Primary"</strong> location, generate the <strong>Shipping Label</strong>, and WhatsApp the tracking link.
                </p>
              </div>
              
              {!isEnabled && isPro && (
                <div className="bg-amber-100 text-amber-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2 justify-center">
                   <AlertTriangle size={14}/> Enable Shiprocket in Settings first.
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- MODE: MANUAL --- */}
        {mode === 'manual' && (
          <div className="space-y-4 animate-in slide-in-from-right-8 fade-in duration-300">
             <div className="group">
               <label className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-1 block group-focus-within:text-blue-600 transition-colors">Courier Name</label>
               <input 
                 value={courierName}
                 onChange={(e) => setCourierName(e.target.value)}
                 placeholder="e.g. DTDC / Local Guy"
                 className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-300"
               />
             </div>
             <div className="group">
               <label className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-1 block group-focus-within:text-blue-600 transition-colors">Tracking Link</label>
               <input 
                 value={trackingLink}
                 onChange={(e) => setTrackingLink(e.target.value)}
                 placeholder="https://..."
                 className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-300"
               />
             </div>
          </div>
        )}

        <button 
          onClick={handleShip}
          disabled={loading || (mode === 'manual' && (!courierName || !trackingLink)) || (mode === 'rocket' && (!isPro || !isEnabled))}
          className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-slate-900"
        >
          {loading ? <Loader2 className="animate-spin" /> : (mode === 'rocket' ? "🚀 LAUNCH SHIPMENT" : "💾 UPDATE ORDER")}
        </button>

      </div>
    </div>
  )
}