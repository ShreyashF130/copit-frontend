// 'use client'
// import { useState } from 'react'
// import Script from 'next/script'
// import { CheckCircle2, Crown, Zap, Loader2 } from 'lucide-react'
// import { toast } from 'sonner'

// export default function PublicPricing() {
//   const [loading, setLoading] = useState(false)
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL
//   const handleUpgrade = async () => {
//     setLoading(true)
//     try {
//       const res = await fetch(`${apiUrl}/api/payment/create`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           amount: 499, 
//           type: 'subscription',
//           shop_id: 0 
//         })
//       })
//       const data = await res.json()

//       const options = {
//         key: data.key_id,
//         amount: data.amount,
//         currency: "INR",
//         name: "CopIt Pro",
//         description: "Monthly Pro Subscription",
//         order_id: data.order_id,
//         handler: function (response: any) {
//           toast.success("Payment Received! Redirecting...")
//           window.location.href = "/dashboard?setup=pro" 
//         },
//         theme: { color: "#7C3AED" }
//       };

//       const rzp = new (window as any).Razorpay(options)
//       rzp.open()
//     } catch (e) {
//       toast.error("Could not start payment.")
//     }
//     setLoading(false)
//   }

//   return (
//     <div className="min-h-screen bg-background py-20 px-6 transition-colors duration-300 relative overflow-hidden">
//       <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
//       {/* Background Decor (Subtle Glow) */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50 dark:opacity-30" />

//       <div className="max-w-4xl mx-auto text-center space-y-4 mb-16 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
//         <h1 className="text-5xl font-black text-foreground tracking-tight">
//             Simple Pricing. <span className="text-primary">Pro Results.</span>
//         </h1>
//         <p className="text-muted-foreground font-medium text-lg">Stop losing sales in DMs. Automate your store today.</p>
//       </div>

//       <div className="max-w-md mx-auto relative z-10 animate-in zoom-in-95 duration-500 delay-100">
        
//         {/* CARD CONTAINER */}
//         <div className="bg-card rounded-[2.5rem] p-10 border border-border/60 dark:border-primary/20 shadow-2xl shadow-slate-200/50 dark:shadow-primary/10 relative overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
          
//           {/* Badge */}
//           <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-6 py-2 rounded-bl-2xl font-black text-xs tracking-widest shadow-lg shadow-primary/20">
//             MOST POPULAR
//           </div>
          
//           <div className="flex items-center gap-4 mb-8">
//             <div className="p-4 bg-primary/10 text-primary rounded-2xl shadow-inner ring-1 ring-primary/20">
//               <Crown size={32} fill="currentColor" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-black text-foreground tracking-tight">CopIt PRO</h2>
//               <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider">All-in-one Growth Suite</p>
//             </div>
//           </div>

//           <div className="mb-10 pb-8 border-b border-border">
//             <div className="flex items-baseline gap-1">
//               <span className="text-6xl font-black text-foreground tracking-tighter">₹499</span>
//               <span className="text-muted-foreground font-bold text-lg">/month</span>
//             </div>
//             <p className="text-xs text-primary font-bold mt-2 bg-primary/10 inline-block px-3 py-1 rounded-full">
//               Less than ₹17 per day
//             </p>
//           </div>

//           <ul className="space-y-5 mb-10">
//             {[
//               "Razorpay Gateway Integration", 
//               "Unlimited Orders & Products", 
//               "Priority WhatsApp API Speed", 
//               "Advanced Customer Analytics"
//             ].map((feat, i) => (
//               <li key={i} className="flex items-center gap-3 font-bold text-foreground/90 text-sm">
//                 <div className="p-1 rounded-full bg-[var(--success)]/20 text-[var(--success)]">
//                    <CheckCircle2 size={16} strokeWidth={3} /> 
//                 </div>
//                 {feat}
//               </li>
//             ))}
//           </ul>

//           <button 
//             onClick={handleUpgrade}
//             disabled={loading}
//             className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed group"
//           >
//             {loading ? <Loader2 className="animate-spin" /> : (
//               <>
//                 <Zap size={20} fill="currentColor" className="group-hover:scale-110 transition-transform" /> 
//                 GET PRO ACCESS
//               </>
//             )}
//           </button>
          
//           <p className="text-center text-[10px] text-muted-foreground font-bold mt-4 uppercase tracking-widest opacity-60">
//             Cancel Anytime • Secure Payment
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }





'use client'
import { useState } from 'react'
import Script from 'next/script'
import { 
  CheckCircle2, Crown, Zap, Loader2, 
  Truck, RefreshCcw, TrendingUp, ShieldCheck, 
  MessageCircle, Star 
} from 'lucide-react'
import { toast } from 'sonner'

export default function PublicPricing() {
  const [loading, setLoading] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      // 1. Create Order on Backend
      const res = await fetch(`${apiUrl}/api/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: 499, 
          type: 'subscription',
          shop_id: 0 // Note: Ensure you pass the real Shop ID if user is logged in
        })
      })
      
      if (!res.ok) throw new Error("Server error")
      const data = await res.json()

      // 2. Razorpay Options
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: "INR",
        name: "CopIt Pro",
        description: "Monthly Growth Infrastructure",
        order_id: data.order_id,
        handler: function (response: any) {
          toast.success("Welcome to Pro! Redirecting...")
          window.location.href = "/dashboard?setup=pro" 
        },
        theme: { color: "#2563EB" } // Blue-600
      };

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (e) {
      toast.error("Could not initialize payment. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-6 relative overflow-hidden flex items-center justify-center font-sans">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* Dynamic Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT SIDE: THE PITCH */}
        <div className="text-left space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
           <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-200 dark:border-blue-800">
               <Crown size={14} /> The Full Suite
             </div>
             <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
               Unlock the <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                 Invisible Machine.
               </span>
             </h1>
           </div>
           
           <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-md">
             Don't just get a chatbot. Get an automated operations team that handles logistics, recovery, and payments while you sleep.
           </p>

           {/* Value Props List */}
           <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-600"><Truck size={20} /></div>
                 <div>
                    <p className="font-bold text-slate-900 dark:text-white">Auto-Logistics</p>
                    <p className="text-sm text-slate-500">Instant AWB generation via Shiprocket.</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600"><RefreshCcw size={20} /></div>
                 <div>
                    <p className="font-bold text-slate-900 dark:text-white">Cart Recovery</p>
                    <p className="text-sm text-slate-500">Auto-nudge customers who drop off.</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600"><TrendingUp size={20} /></div>
                 <div>
                    <p className="font-bold text-slate-900 dark:text-white">Smart Upsells</p>
                    <p className="text-sm text-slate-500">Pitch add-ons automatically after payment.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT SIDE: THE PRICING CARD */}
        <div className="relative animate-in zoom-in-95 duration-500 delay-100">
           {/* Card Container */}
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-900/10 relative overflow-hidden">
              
              {/* Popular Badge */}
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-2xl font-black text-[10px] tracking-[0.2em] shadow-lg">
                POPULAR
              </div>

              <div className="mb-8">
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white">CopIt Pro</h2>
                 <p className="text-slate-500 text-sm font-medium mt-1">Complete Automation Infrastructure</p>
              </div>

              {/* Price */}
              <div className="mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                 <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tight">₹499</span>
                    <span className="text-slate-400 font-bold text-lg">/month</span>
                 </div>
                 <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                       Less than ₹17/day
                    </span>
                    <span className="text-xs text-slate-400 line-through">₹999/mo</span>
                 </div>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 gap-y-4 mb-10">
                 {[
                    { text: "Razorpay Payment Gateway", icon: Zap },
                    { text: "Unlimited WhatsApp Orders", icon: MessageCircle },
                    { text: "Shiprocket Auto-Sync", icon: Truck },
                    { text: "Abandoned Cart Recovery", icon: RefreshCcw },
                    { text: "Smart Upsell Engine", icon: TrendingUp },
                    { text: "Manual UPI Fallback", icon: ShieldCheck },
                    { text: "Review Shield System", icon: Star },
                    { text: "Advanced Analytics", icon: CheckCircle2 },
                 ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <feat.icon size={16} className="text-blue-600 shrink-0" />
                       <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{feat.text}</span>
                    </div>
                 ))}
              </div>

              {/* Action Button */}
              <button 
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    <Zap size={20} className="fill-current group-hover:scale-110 transition-transform" /> 
                    UPGRADE NOW
                  </>
                )}
              </button>
              
              <p className="text-center text-[10px] text-slate-400 font-bold mt-5 uppercase tracking-widest">
                Secure Payment • Cancel Anytime
              </p>
           </div>
        </div>

      </div>
    </div>
  )
}