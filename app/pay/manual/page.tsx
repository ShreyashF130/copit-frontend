'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { Loader2, AlertTriangle, Copy, CheckCircle, Clock } from 'lucide-react'
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

  // Countdown Timer Logic
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

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  // --- RENDER ---
  if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>
  
  if (error) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center">
      <div className="bg-white/10 p-6 rounded-full mb-6">
          <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Link Unavailable</h1>
      <p className="text-slate-400">{error}</p>
      <p className="text-xs text-slate-600 mt-8">Please create a new order on WhatsApp.</p>
    </div>
  )

  const { amount, vpa, order_id, shop_name } = data
  const upiLink = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(shop_name)}&am=${amount}&tr=${order_id}&tn=Order_${order_id}&cu=INR`

  const handleCopy = () => {
    navigator.clipboard.writeText(vpa)
    toast.success("UPI ID Copied!")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 text-center shadow-2xl">
        
        {/* Timer Badge */}
        <div className="absolute top-4 right-4 bg-red-500/20 border border-red-500/50 px-3 py-1 rounded-full flex items-center gap-2">
            <Clock size={12} className="text-red-400" />
            <span className="text-xs font-mono font-bold text-red-300">{formatTime(timeLeft || 0)}</span>
        </div>

        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
          <span className="font-black text-2xl text-white">₹</span>
        </div>

        <h1 className="text-4xl font-black mb-2 tracking-tight">₹{amount}</h1>
        <p className="text-slate-400 text-sm font-medium mb-8">
          Paying to <span className="text-white font-bold">{shop_name}</span>
        </p>

        {/* Mobile Button */}
        <div className="md:hidden space-y-4">
          <a href={upiLink} className="block w-full py-4 bg-white text-slate-950 rounded-xl font-black text-lg hover:bg-slate-200 transition-colors shadow-lg active:scale-[0.98]">
            PAY VIA UPI APP
          </a>
          <p className="text-[10px] text-slate-500 font-medium">Tap to open GPay / PhonePe / Paytm</p>
        </div>

        {/* Desktop QR */}
        <div className="hidden md:flex flex-col items-center gap-6">
          <div className="bg-white p-4 rounded-3xl shadow-inner">
            <QRCodeSVG value={upiLink} size={180} />
          </div>
          <p className="text-xs text-slate-400 font-medium">Scan with any UPI App to Pay</p>
        </div>

        {/* VPA Copy */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-3 font-bold">Pay Manually</p>
          <button onClick={handleCopy} className="w-full flex items-center justify-between bg-black/40 border border-white/5 p-4 rounded-xl cursor-pointer hover:bg-black/60 transition-all group">
             <span className="font-mono text-sm text-blue-400 group-hover:text-blue-300 transition-colors">{vpa}</span>
             <Copy size={16} className="text-slate-500 group-hover:text-white transition-colors" />
          </button>
        </div>

      </div>
    </div>
  )
}

export default function ManualPaymentPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>}>
      <ManualPaymentContent />
    </Suspense>
  )
}