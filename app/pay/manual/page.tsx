'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { Loader2, AlertTriangle, Copy, Smartphone, ScanLine, Clock } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react' 
import { toast } from 'sonner'
import axios from 'axios'

function ManualPaymentContent() {
  const searchParams = useSearchParams()
  const orderIdParam = searchParams.get('order')

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // 1. DETECT MOBILE (To show Deep Link vs QR)
  useEffect(() => {
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    setIsMobile(checkMobile)
  }, [])

  // 2. FETCH ORDER & VALIDATE
  useEffect(() => {
    if (!orderIdParam) {
      setError("Missing Order ID")
      setLoading(false)
      return
    }

    const fetchOrder = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        const res = await axios.get(`${apiUrl}/api/payment/order/${orderIdParam}`)
        
        if (res.data.status === 'expired') {
          setError("This payment link has expired.")
        } else if (res.data.status === 'completed') {
          setError("This order is already paid.")
        } else {
          setData(res.data)
          setTimeLeft(res.data.expires_in_seconds)
        }
      } catch (err) {
        console.error(err)
        setError("Invalid Order or Server Error")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderIdParam])

  // 3. COUNTDOWN TIMER
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev <= 1) {
           setError("This payment link has expired.")
           return 0
        }
        return prev ? prev - 1 : 0
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  // --- LOADING / ERROR STATES ---
  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>
  
  if (error) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
      <div className="bg-red-500/10 p-6 rounded-full mb-6 border border-red-500/20">
          <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Link Unavailable</h1>
      <p className="text-slate-400">{error}</p>
      <p className="text-xs text-slate-600 mt-8">Please create a new order on WhatsApp.</p>
    </div>
  )

  // --- 4. ROBUST PAYMENT LOGIC (The Fix) ---
  const { amount, vpa, order_id, shop_name } = data

  // A. Sanitize Data (Crucial for UPI success)
  const cleanVpa = vpa ? vpa.trim() : ""
  const cleanAmount = parseFloat(amount).toFixed(2)
  const cleanName = shop_name ? shop_name.replace(/[^a-zA-Z0-9 ]/g, "").substring(0, 20) : "Merchant"

  // B. Universal Link (Works for P2P and Merchant)
  // Removed 'tr' to prevent personal account blocks.
  const upiLink = `upi://pay?pa=${cleanVpa}&pn=${encodeURIComponent(cleanName)}&am=${cleanAmount}&cu=INR&tn=Order_${order_id}`

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanVpa)
    toast.success("UPI ID Copied!")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* --- HEADER --- */}
      <div className="mt-8 text-center relative z-10">
        
        {/* Timer Badge */}
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full mb-6">
            <Clock size={12} className="text-red-400" />
            <span className="text-xs font-mono font-bold text-red-300">{formatTime(timeLeft || 0)}</span>
        </div>

        <h1 className="text-5xl font-black mb-1 tracking-tight">₹{cleanAmount}</h1>
        <p className="text-slate-400 text-sm">Paying to <span className="text-white font-bold">{cleanName}</span></p>
        <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest font-bold">Order #{order_id}</p>
      </div>

      {/* --- MOBILE VIEW: INTENT BUTTON --- */}
      <div className="w-full max-w-sm mt-10 space-y-4 md:hidden relative z-10">
        
        {/* The Magic Button */}
        <a 
          href={upiLink} 
          className="relative group block w-full bg-white text-black py-5 rounded-2xl font-black text-xl text-center shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-20 group-hover:opacity-30 rounded-2xl animate-gradient-x" />
          <span className="relative flex items-center justify-center gap-2">
            <Smartphone size={24} />
            PAY VIA UPI APP
          </span>
        </a>
        <p className="text-center text-[10px] text-slate-500 font-medium">
          Tap to open GPay, PhonePe, Paytm instantly.
        </p>

        {/* Fail-Safe Red Box (The Fix for 'Not Working') */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="bg-red-900/20 border border-red-900/50 p-3 rounded-xl mb-4 text-center">
             <p className="text-[10px] text-red-300 font-medium">
               Button not working? Copy ID below & pay manually.
             </p>
          </div>
          <button onClick={handleCopy} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center active:bg-white/10 transition-colors">
            <span className="font-mono text-sm text-blue-300">{cleanVpa}</span>
            <Copy size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* --- DESKTOP VIEW: QR CODE --- */}
      <div className="hidden md:flex flex-col items-center mt-10 bg-white p-6 rounded-3xl shadow-2xl relative z-10">
        <QRCodeSVG value={upiLink} size={220} level="H" />
        <p className="text-black font-bold mt-4 flex items-center gap-2 text-sm">
          <ScanLine size={18} />
          Scan with Phone
        </p>
      </div>

      {/* Instructions */}
      <div className="mt-auto mb-6 text-center opacity-60">
        <p className="text-xs text-slate-400">
          After payment, send screenshot on WhatsApp.
        </p>
      </div>

    </div>
  )
}

export default function ManualPaymentPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>}>
      <ManualPaymentContent />
    </Suspense>
  )
}