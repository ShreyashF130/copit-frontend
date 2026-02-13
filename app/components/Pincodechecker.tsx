'use client'

import { useState } from 'react'
import { MapPin, Loader2, CheckCircle2, XCircle, Truck } from 'lucide-react'
import { toast } from 'sonner' // Assuming you use sonner or similar for toasts

interface ServiceabilityResult {
  status: 'available' | 'unavailable' | 'error'
  message: string
  cod_available?: boolean
  etd?: string
}

export default function PincodeChecker({ shopId }: { shopId: number }) {
  const [pincode, setPincode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ServiceabilityResult | null>(null)

  const checkServiceability = async () => {
    if (!pincode || pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit Pincode")
      return
    }

    setLoading(true)
    setResult(null)

    try {
      // Replace with your actual backend URL
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/check-pincode?shop_id=${shopId}&pincode=${pincode}`)
      const data = await res.json()

      if (data.status === 'available') {
        setResult({
          status: 'available',
          message: data.message,
          cod_available: data.cod_available,
          etd: data.etd
        })
      } else {
        setResult({
          status: 'unavailable',
          message: data.message || "Delivery not available here."
        })
      }
    } catch (error) {
      setResult({
        status: 'error',
        message: "Network error. Please try again."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border p-4 mt-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-3 text-sm font-bold text-muted-foreground uppercase tracking-wider">
        <Truck size={14} /> Check Delivery Availability
      </div>

      {/* INPUT GROUP */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Enter Pincode" 
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-border rounded-lg text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            onKeyDown={(e) => e.key === 'Enter' && checkServiceability()}
          />
        </div>
        <button 
          onClick={checkServiceability}
          disabled={loading || pincode.length !== 6}
          className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Check"}
        </button>
      </div>

      {/* RESULT DISPLAY */}
      {result && (
        <div className={`mt-4 p-3 rounded-lg border flex items-start gap-3 text-sm animate-in slide-in-from-top-2 duration-200 ${
          result.status === 'available' 
            ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
        }`}>
          
          <div className="mt-0.5">
            {result.status === 'available' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          </div>
          
          <div className="flex-1 space-y-1">
            <p className="font-bold">
              {result.status === 'available' ? "Delivery Available!" : "Not Serviceable"}
            </p>
            
            {result.status === 'available' && (
              <div className="text-xs opacity-90 flex flex-col gap-1 mt-1">
                <span>🚚 Est. Delivery: <b>{result.etd || '3-5 Days'}</b></span>
                <span className={`flex items-center gap-1.5 ${result.cod_available ? 'text-green-600' : 'text-orange-600'}`}>
                   • {result.cod_available ? "Cash on Delivery Available" : "Prepaid Only (No COD)"}
                </span>
              </div>
            )}
            
            {result.status !== 'available' && (
              <p className="text-xs opacity-90">{result.message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}