'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { Loader2, CheckCircle, Copy, AlertTriangle } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react' 
import { toast } from 'sonner'

// ----------------------------------------------------------------------
// 1. THE LOGIC COMPONENT
// ----------------------------------------------------------------------
function ManualPaymentContent() {
  const searchParams = useSearchParams()
  
  // 1. GET PARAMS DIRECTLY (Matches Backend Logic)
  const amount = searchParams.get('amount') || "0"
  const orderId = searchParams.get('order') || "Unknown"
  const vpa = searchParams.get('vpa') // The UPI ID passed from Backend

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Artificial delay just to ensure hydration, otherwise instant
    if (vpa) setLoading(false)
  }, [vpa])

  // 2. ERROR STATE
  if (!vpa) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h1 className="text-xl font-bold">Invalid Payment Link</h1>
      <p className="text-slate-400 mt-2 text-center">Missing UPI details. Please create a new order.</p>
    </div>
  )

  // 3. GENERATE LINKS
  // Standard UPI Deep Link Format
  const upiLink = `upi://pay?pa=${vpa}&pn=Merchant&am=${amount}&tr=${orderId}&tn=Order_${orderId}&cu=INR`

  const handleCopy = () => {
    navigator.clipboard.writeText(vpa)
    toast.success("UPI ID Copied!")
  }

  if (loading) return <div className="h-screen bg-slate-900 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 text-center shadow-2xl">
        
        {/* Header */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
          <span className="font-black text-2xl text-white">₹</span>
        </div>

        <h1 className="text-4xl font-black mb-2 tracking-tight">₹{amount}</h1>
        <p className="text-slate-400 text-sm font-medium mb-8">
          Order <span className="text-white font-mono">#{orderId}</span>
        </p>

        {/* --- MOBILE: ONE TAP BUTTONS --- */}
        <div className="md:hidden space-y-4">
          <a href={upiLink} className="block w-full py-4 bg-white text-slate-950 rounded-xl font-black text-lg hover:bg-slate-200 transition-colors shadow-lg active:scale-[0.98]">
            PAY VIA UPI APP
          </a>
          <p className="text-[10px] text-slate-500 font-medium">Tap to open GPay / PhonePe / Paytm</p>
        </div>

        {/* --- DESKTOP: QR CODE --- */}
        <div className="hidden md:flex flex-col items-center gap-6">
          <div className="bg-white p-4 rounded-3xl shadow-inner">
            <QRCodeSVG value={upiLink} size={180} />
          </div>
          <p className="text-xs text-slate-400 font-medium">Scan with any UPI App to Pay</p>
        </div>

        {/* --- MANUAL COPY SECTION --- */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-3 font-bold">Pay Manually to VPA</p>
          <button 
            onClick={handleCopy} 
            className="w-full flex items-center justify-between bg-black/40 border border-white/5 p-4 rounded-xl cursor-pointer hover:bg-black/60 transition-all group"
          >
             <span className="font-mono text-sm text-blue-400 group-hover:text-blue-300 transition-colors">{vpa}</span>
             <Copy size={16} className="text-slate-500 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* --- INSTRUCTION --- */}
        <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-start gap-3">
          <CheckCircle size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-xs text-emerald-200 font-bold leading-tight">Payment Step 2:</p>
            <p className="text-[11px] text-emerald-400/80 leading-tight mt-1">
              Take a screenshot of your successful payment and send it to the WhatsApp bot.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

// ----------------------------------------------------------------------
// 2. THE WRAPPER COMPONENT
// ----------------------------------------------------------------------
export default function ManualPaymentPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>}>
      <ManualPaymentContent />
    </Suspense>
  )
}