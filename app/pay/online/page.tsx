'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { Loader2, AlertTriangle, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'

const loadRazorpayScript = () => {
  return new Promise((resolve) => {

    if ((window as any).Razorpay) {
      resolve(true)
      return
    }
    
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function OnlinePaymentContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    if (!orderId) {
      setError("Missing Order ID")
      setLoading(false)
      return
    }

    const initPayment = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        const res = await axios.post(`${apiUrl}/api/payment/customer/create`, { order_id: orderId })
        setOrderData(res.data)
      } catch (err: any) {
        setError(err.response?.data?.detail || "Could not initialize payment gateway.")
      } finally {
        setLoading(false)
      }
    }

    initPayment()
  }, [orderId])

  const openRazorpay = async () => {
    if (!orderData) return

    const isScriptLoaded = await loadRazorpayScript()

    if (!isScriptLoaded) {
      toast.error("Payment Gateway failed to load. Are you offline?")
      return
    }

    const options = {
      key: orderData.key_id, 
      amount: orderData.amount,
      currency: "INR",
      name: "Secure Checkout",
      description: `Order #${orderId}`,
      order_id: orderData.order_id, 
      handler: function (response: any) {
        toast.success("Payment Successful! Return to WhatsApp.")
        router.push(`/pay/success?order=${orderId}`)
      },
      prefill: {
        contact: "", 
      },
      theme: { color: "#2563EB" },
      modal: {
        ondismiss: function() {
          toast.error("Payment cancelled.")
        }
      }
    }

    const rzp = new (window as any).Razorpay(options)
    rzp.open()
  }

  useEffect(() => {
    if (orderData) {
      openRazorpay()
    }
  }, [orderData])


  if (error) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h1 className="text-xl font-bold">{error}</h1>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      {/* 🚨 REMOVED NEXT.JS SCRIPT TAG FROM HERE */}
      
      <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/30">
        <ShieldCheck className="text-blue-500" size={32} />
      </div>
      
      <h1 className="text-2xl font-black mb-2 tracking-tight">Secure Gateway</h1>
      <p className="text-slate-400 text-sm mb-8">
        {loading ? "Initializing secure connection..." : "Awaiting payment completion..."}
      </p>

      {loading ? (
        <Loader2 className="animate-spin text-blue-500" size={32} />
      ) : (
        <button 
          onClick={openRazorpay}
          className="px-8 py-4 bg-blue-600 rounded-xl font-bold uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-colors"
        >
          Re-open Payment Window
        </button>
      )}
    </div>
  )
}

export default function OnlinePaymentPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>}>
      <OnlinePaymentContent />
    </Suspense>
  )
}