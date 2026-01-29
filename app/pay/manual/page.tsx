'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react' // <--- IMPORT SUSPENSE
import { createClient } from '@/app/lib/supabase-browser' 
import { Loader2, CheckCircle, Copy } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react' 
import { toast } from 'sonner'

// ----------------------------------------------------------------------
// 1. THE LOGIC COMPONENT (Renamed)
// ----------------------------------------------------------------------
function ManualPaymentContent() {
  const searchParams = useSearchParams()
  const shopId = searchParams.get('shop')
  const amount = searchParams.get('amount')
  
  const [shop, setShop] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    if (shopId) fetchShop()
  }, [shopId])

  async function fetchShop() {
    const { data } = await supabase.from('shops').select('name, upi_id').eq('id', shopId).single()
    setShop(data)
    setLoading(false)
  }

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>
  if (!shop || !shop.upi_id) return <div className="p-10 text-center font-bold text-white">Invalid Payment Link</div>

  const upiLink = `upi://pay?pa=${shop.upi_id}&pn=${encodeURIComponent(shop.name)}&am=${amount}&cu=INR`

  const handleCopy = () => {
    navigator.clipboard.writeText(shop.upi_id)
    toast.success("UPI ID Copied!")
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-600/30">
          <span className="font-black text-2xl">₹</span>
        </div>

        <h1 className="text-3xl font-black mb-2">₹{amount}</h1>
        <p className="text-slate-300 text-sm font-medium mb-8">Paying to <span className="text-white font-bold">{shop.name}</span></p>

        {/* --- MOBILE: ONE TAP BUTTONS --- */}
        <div className="md:hidden space-y-4">
          <a href={upiLink} className="block w-full py-4 bg-white text-slate-900 rounded-xl font-black text-lg hover:scale-[1.02] transition-transform active:scale-95 shadow-xl">
            PAY VIA UPI APP
          </a>
          <p className="text-[10px] text-slate-400 font-medium">Tap to open GPay / PhonePe / Paytm</p>
        </div>

        {/* --- DESKTOP: QR CODE --- */}
        <div className="hidden md:flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-2xl">
            <QRCodeSVG value={upiLink} size={180} />
          </div>
          <p className="text-xs text-slate-400">Scan with any UPI App to Pay</p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Manual Copy</p>
          <div onClick={handleCopy} className="flex items-center justify-between bg-black/20 p-3 rounded-xl cursor-pointer hover:bg-black/30 transition-colors">
             <span className="font-mono text-sm text-blue-300">{shop.upi_id}</span>
             <Copy size={14} className="text-slate-400" />
          </div>
        </div>

        {/* --- INSTRUCTION --- */}
        <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-3">
          <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
          <p className="text-[10px] text-left text-emerald-200 leading-tight">
            <strong>Important:</strong> After paying, go back to WhatsApp and upload the screenshot.
          </p>
        </div>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------------
// 2. THE WRAPPER COMPONENT (Export Default)
// ----------------------------------------------------------------------
export default function ManualPaymentPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-slate-900 flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>}>
      <ManualPaymentContent />
    </Suspense>
  )
}