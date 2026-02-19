'use client'

import { useState } from 'react'
import { 
  Smartphone, Database, Server, Globe, 
  MessageCircle, CreditCard, Truck, CheckCircle2, 
  Zap, LayoutDashboard, Image as ImageIcon, ArrowRight
} from 'lucide-react'
import Link from 'next/link'

// --- DATA: THE SELLER FLOW ---
const SELLER_STEPS = [
  {
    title: "Inventory & Configuration",
    desc: "Connect your UPI, add products, and define pricing in a clean dashboard. Data syncs instantly across the global edge network.",
    tech: "Next.js Console → Supabase Postgres",
    icon: LayoutDashboard,
    imagePlaceholder: "Dashboard Interface"
  },
  {
    title: "The 'Silent' Engine",
    desc: "Our FastAPI infrastructure listens to the WhatsApp Cloud API 24/7, intercepting buying intents without manual intervention.",
    tech: "FastAPI Webhooks → State Machine",
    icon: Server,
    imagePlaceholder: "Webhook Activity Logs"
  },
  {
    title: "Maker-Checker Escrow",
    desc: "When a customer pays manually, the system pings your WhatsApp with the UTR/Screenshot. One tap to approve or reject.",
    tech: "Interactive WhatsApp Messaging",
    icon: CheckCircle2,
    imagePlaceholder: "Seller WhatsApp Approval View"
  },
  {
    title: "One-Click Logistics",
    desc: "Approved orders instantly move to fulfillment. Click 'Ship Now' to auto-generate a Shiprocket AWB and schedule pickup.",
    tech: "Shiprocket API Engine",
    icon: Truck,
    imagePlaceholder: "Fulfillment Dashboard"
  }
]

// --- DATA: THE CUSTOMER FLOW ---
const CUSTOMER_STEPS = [
  {
    title: "The Deep Link Trigger",
    desc: "Customers discover your product on Instagram or WhatsApp. They click a secure deep link or DM the bot to initiate purchase.",
    tech: "Intent URLs / QR Routing",
    icon: Zap,
    imagePlaceholder: "Instagram Story Deep Link"
  },
  {
    title: "The 'Magic Link' Capture",
    desc: "Typing addresses in chat is tedious. Customers are routed to a secure, transient web form with auto-pincode validation.",
    tech: "Transient Next.js Forms",
    icon: Globe,
    imagePlaceholder: "Mobile Address Form"
  },
  {
    title: "Frictionless Payment",
    desc: "Users select their method. Manual UPI opens their native app (GPay/PhonePe) directly. Pro users get a seamless Razorpay gateway.",
    tech: "UPI Deep Intent / Razorpay SDK",
    icon: CreditCard,
    imagePlaceholder: "Payment Selection Screen"
  },
  {
    title: "Automated Verification",
    desc: "For manual payments, users upload a screenshot directly in chat. The bot acknowledges it and holds the order securely until seller review.",
    tech: "Media Payload Handling",
    icon: MessageCircle,
    imagePlaceholder: "WhatsApp Screenshot Upload"
  }
]

export default function WorkflowPage() {
  const [view, setView] = useState<'seller' | 'customer'>('customer')
  const steps = view === 'seller' ? SELLER_STEPS : CUSTOMER_STEPS

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-32 selection:bg-primary/20">
      
      {/* --- HEADER --- */}
      <header className="pt-24 pb-20 px-6 text-center max-w-4xl mx-auto relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8 border border-primary/20">
           <Database size={14} /> System Architecture
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1]">
          How <span className="text-primary">CopIt</span> Works.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
          A technical breakdown of the order lifecycle. Explore the infrastructure powering the next generation of social commerce.
        </p>

        {/* ENTERPRISE TOGGLE SWITCH */}
        <div className="mt-12 inline-flex bg-secondary/50 backdrop-blur-md p-1.5 rounded-2xl border border-border shadow-inner">
          <button 
            onClick={() => setView('customer')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              view === 'customer' 
                ? 'bg-background text-foreground shadow-sm ring-1 ring-border' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone size={18} /> Customer Journey
          </button>
          <button 
            onClick={() => setView('seller')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              view === 'seller' 
                ? 'bg-background text-foreground shadow-sm ring-1 ring-border' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutDashboard size={18} /> Seller Operations
          </button>
        </div>
      </header>

      {/* --- TIMELINE --- */}
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Contextual Diagram Placeholder based on view */}
        <div className="mb-16 text-center">
            {view === 'customer' && (
                <div className="text-sm text-muted-foreground italic mb-8">
                    
                </div>
            )}
            {view === 'seller' && (
                <div className="text-sm text-muted-foreground italic mb-8">
                    
                </div>
            )}
        </div>

        <div className="relative">
          {/* Vertical Dashed Line */}
          <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-[2px] border-l-2 border-dashed border-border -translate-x-1/2 hidden md:block" />
          <div className="absolute left-8 top-4 bottom-4 w-[2px] border-l-2 border-dashed border-border md:hidden" />

          <div className="space-y-24 md:space-y-32">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={i} className={`relative flex flex-col md:flex-row gap-12 md:gap-0 items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* ICON MARKER */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-14 h-14 bg-background border-4 border-background ring-2 ring-border rounded-full flex items-center justify-center z-10 shadow-lg">
                     <span className="font-black text-lg text-primary">0{i + 1}</span>
                  </div>

                  {/* TEXT CONTENT */}
                  <div className={`w-full md:w-1/2 pl-24 md:pl-0 ${isEven ? 'md:pl-20 text-left' : 'md:pr-20 md:text-right'}`}>
                    <div className={`flex flex-col gap-4 ${isEven ? 'md:items-start' : 'md:items-end'}`}>
                      <div className="p-3 bg-primary/10 rounded-2xl text-primary w-fit ring-1 ring-primary/20">
                         <step.icon size={28} />
                      </div>
                      <h3 className="text-3xl font-bold text-foreground tracking-tight">{step.title}</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {step.desc}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-widest rounded-lg border border-border">
                        <Server size={14} className="opacity-50" /> {step.tech}
                      </div>
                    </div>
                  </div>

                  {/* IMAGE CARD (VISUAL PROOF) */}
                  <div className={`w-full md:w-1/2 pl-24 md:pl-0 ${isEven ? 'md:pr-20' : 'md:pl-20'}`}>
                    <div className="aspect-[4/3] bg-card rounded-3xl border border-border shadow-2xl overflow-hidden relative group hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
                      
                      {/* FAKE BROWSER/APP BAR */}
                      <div className="absolute top-0 left-0 right-0 h-10 bg-muted/50 border-b border-border flex items-center px-4 gap-2 backdrop-blur-sm z-10">
                         <div className="w-3 h-3 rounded-full bg-red-400/80" />
                         <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                         <div className="w-3 h-3 rounded-full bg-green-400/80" />
                      </div>

                      {/* PLACEHOLDER CONTENT */}
                      <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 p-8 text-center gap-4">
                         <div className="w-16 h-16 rounded-2xl bg-background shadow-sm border border-border flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                           <ImageIcon size={32} className="text-muted-foreground/50" />
                         </div>
                         <p className="text-sm font-bold text-foreground uppercase tracking-widest mt-2">
                           {step.imagePlaceholder}
                         </p>
                         <p className="text-xs text-muted-foreground font-medium max-w-[200px]">
                           Replace this with a high-res application screenshot.
                         </p>
                      </div>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>

        </div>
      </div>

      {/* --- CTA --- */}
      <div className="mt-40 text-center px-6">
         <div className="max-w-2xl mx-auto bg-card border border-border p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            <h2 className="text-3xl font-black text-foreground mb-4 tracking-tight">Ready to deploy?</h2>
            <p className="text-muted-foreground mb-8 text-lg">Set up your infrastructure in less than 5 minutes.</p>
            <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
               Start Building <ArrowRight size={20} />
            </Link>
         </div>
      </div>

    </div>
  )
}