'use client'

import { useSearchParams } from 'next/navigation'
import { CheckCircle2, MessageCircle } from 'lucide-react'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 animate-in zoom-in duration-500">
        <CheckCircle2 className="text-green-500" size={48} />
      </div>
      
      <h1 className="text-3xl font-black mb-3 tracking-tight">Payment Successful!</h1>
      
      <p className="text-slate-400 text-sm mb-8 max-w-sm">
        Your payment for Order #{orderId} has been securely processed. Our system is confirming it right now.
      </p>

      {/* They can just close the tab, but a button is good UX */}
      <button 
        onClick={() => window.close()} 
        className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        <MessageCircle size={18} /> Return to WhatsApp
      </button>

      <p className="text-[10px] text-slate-600 mt-8">You can safely close this window.</p>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <SuccessContent />
    </Suspense>
  )
}