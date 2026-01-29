'use client'
import { useState } from 'react'
import Script from 'next/script'
import { CheckCircle2, Crown, Zap, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function PublicPricing() {
  const [loading, setLoading] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/api/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: 499, 
          type: 'subscription',
          shop_id: 0 
        })
      })
      const data = await res.json()

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: "INR",
        name: "CopIt Pro",
        description: "Monthly Pro Subscription",
        order_id: data.order_id,
        handler: function (response: any) {
          toast.success("Payment Received! Redirecting...")
          window.location.href = "/dashboard?setup=pro" 
        },
        theme: { color: "#7C3AED" }
      };

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (e) {
      toast.error("Could not start payment.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background py-20 px-6 transition-colors duration-300 relative overflow-hidden">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* Background Decor (Subtle Glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50 dark:opacity-30" />

      <div className="max-w-4xl mx-auto text-center space-y-4 mb-16 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-5xl font-black text-foreground tracking-tight">
            Simple Pricing. <span className="text-primary">Pro Results.</span>
        </h1>
        <p className="text-muted-foreground font-medium text-lg">Stop losing sales in DMs. Automate your store today.</p>
      </div>

      <div className="max-w-md mx-auto relative z-10 animate-in zoom-in-95 duration-500 delay-100">
        
        {/* CARD CONTAINER */}
        <div className="bg-card rounded-[2.5rem] p-10 border border-border/60 dark:border-primary/20 shadow-2xl shadow-slate-200/50 dark:shadow-primary/10 relative overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
          
          {/* Badge */}
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-6 py-2 rounded-bl-2xl font-black text-xs tracking-widest shadow-lg shadow-primary/20">
            MOST POPULAR
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-primary/10 text-primary rounded-2xl shadow-inner ring-1 ring-primary/20">
              <Crown size={32} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground tracking-tight">CopIt PRO</h2>
              <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider">All-in-one Growth Suite</p>
            </div>
          </div>

          <div className="mb-10 pb-8 border-b border-border">
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-black text-foreground tracking-tighter">₹499</span>
              <span className="text-muted-foreground font-bold text-lg">/month</span>
            </div>
            <p className="text-xs text-primary font-bold mt-2 bg-primary/10 inline-block px-3 py-1 rounded-full">
              Less than ₹17 per day
            </p>
          </div>

          <ul className="space-y-5 mb-10">
            {[
              "Razorpay Gateway Integration", 
              "Unlimited Orders & Products", 
              "Priority WhatsApp API Speed", 
              "Advanced Customer Analytics"
            ].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 font-bold text-foreground/90 text-sm">
                <div className="p-1 rounded-full bg-[var(--success)]/20 text-[var(--success)]">
                   <CheckCircle2 size={16} strokeWidth={3} /> 
                </div>
                {feat}
              </li>
            ))}
          </ul>

          <button 
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                <Zap size={20} fill="currentColor" className="group-hover:scale-110 transition-transform" /> 
                GET PRO ACCESS
              </>
            )}
          </button>
          
          <p className="text-center text-[10px] text-muted-foreground font-bold mt-4 uppercase tracking-widest opacity-60">
            Cancel Anytime • Secure Payment
          </p>
        </div>
      </div>
    </div>
  )
}