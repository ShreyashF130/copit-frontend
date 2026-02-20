'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { Loader2, AlertTriangle, ShieldCheck } from 'lucide-react'
import Script from 'next/script'
import { toast } from 'sonner'
import axios from 'axios'

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
        // Call our new backend endpoint
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

  const openRazorpay = () => {
    if (!orderData) return

    const options = {
      key: orderData.key_id, // The SHOP'S public key
      amount: orderData.amount,
      currency: "INR",
      name: "Secure Checkout",
      description: `Order #${orderId}`,
      order_id: orderData.order_id, // Razorpay Order ID
      handler: function (response: any) {
        // Payment successful on frontend. 
        // The backend Webhook is processing it simultaneously.
        toast.success("Payment Successful! Return to WhatsApp.")
        router.push(`/pay/success?order=${orderId}`)
      },
      prefill: {
        contact: "", // You can pass customer phone here if you fetch it
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

  // Auto-open Razorpay once data loads
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
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