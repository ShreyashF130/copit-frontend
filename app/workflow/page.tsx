'use client'
import { useState } from 'react'
import { 
  Smartphone, Database, Server, Globe, 
  MessageCircle, CreditCard, Truck, CheckCircle2, 
  Zap, LayoutDashboard, Image as ImageIcon, ArrowRight,
  Store, MapPin // 🚨 Added new icons for the expanded customer flow
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// --- DATA: THE SELLER FLOW ---
const SELLER_STEPS = [
  {
    title: "Inventory & Configuration",
    desc: "Connect your UPI, add products, and define pricing in a clean dashboard. Data syncs instantly across the global edge network.",
    tech: "Next.js Console → Supabase Postgres",
    icon: LayoutDashboard,
    imagePlaceholder: "Dashboard Interface",
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

// --- DATA: THE CUSTOMER FLOW (UPGRADED 6-STEP FUNNEL) ---
const CUSTOMER_STEPS = [
  {
    title: "Omnichannel Intent Capture",
    desc: "Customers discover the product on social channels like Instagram and tap a secure, tracked deep link.",
    tech: "Intent URLs / Edge Routing",
    icon: Zap,
    imagePlaceholder: "Instagram Story Deep Link",
    imagePath : "/images/CustomerWorkflow1.webp" 
  },
  {
    title: "High-Velocity Storefront",
    desc: "The deep link resolves instantly to a mobile-optimized, high-converting product page hosted on the edge.",
    tech: "Next.js Edge Rendering",
    icon: Store,
    imagePlaceholder: "Mobile Product Page",
    imagePath:"/images/ProductPage.jpg"
  },
  {
    title: "WhatsApp Handoff",
    desc: "Initiating checkout instantly transitions the user into a native WhatsApp conversation, carrying the exact product payload.",
    tech: "WhatsApp Cloud API",
    icon: MessageCircle,
    imagePlaceholder: "WhatsApp Bot Interaction"
  },
  {
    title: "Transient Data Capture",
    desc: "To eliminate tedious chat-typing, the bot serves a secure, temporary web-view form with auto-pincode validation for shipping details.",
    tech: "Transient Next.js Forms",
    icon: MapPin,
    imagePlaceholder: "Mobile Address Form"
  },
  {
    title: "Multi-Modal Payments",
    desc: "The system dynamically routes the user to a seamless Razorpay checkout or logs a Cash on Delivery (COD) intent.",
    tech: "Razorpay SDK / State Machine",
    icon: CreditCard,
    imagePlaceholder: "Payment Selection Screen"
  },
  {
    title: "Automated Confirmation",
    desc: "Post-payment, the database updates synchronously and dispatches a branded, automated receipt directly to the customer's WhatsApp.",
    tech: "Postgres / Async Messaging",
    icon: CheckCircle2,
    imagePlaceholder: "WhatsApp Order Receipt"
  }
]

export default function WorkflowPage() {
  const [view, setView] = useState<'seller' | 'customer'>('customer')
  const steps = view === 'seller' ? SELLER_STEPS : CUSTOMER_STEPS

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-32 selection:bg-primary/20 overflow-hidden">
      
      {/* --- HEADER --- */}
      <header className="pt-24 pb-20 px-6 text-center max-w-4xl mx-auto relative">
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
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative">
          
          {/* Vertical Dashed Line */}
          <div className="absolute left-[2.25rem] lg:left-1/2 top-4 bottom-4 w-[2px] border-l-2 border-dashed border-border -translate-x-1/2 hidden lg:block" />

          <div className="space-y-32 lg:space-y-40">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={i} className={`relative flex flex-col lg:flex-row gap-12 lg:gap-16 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* ICON MARKER */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-16 h-16 bg-background border-4 border-background ring-2 ring-border rounded-full items-center justify-center z-20 shadow-xl">
                     <span className="font-black text-xl text-primary">0{i + 1}</span>
                  </div>

                  {/* 🚨 THE 40% TEXT COLUMN */}
                  <div className={`w-full lg:w-[40%] z-10 ${isEven ? 'lg:pl-16 text-left' : 'lg:pr-16 lg:text-right'}`}>
                    <div className={`flex flex-col gap-5 ${isEven ? 'lg:items-start' : 'lg:items-end'}`}>
                      <div className="p-4 bg-primary/10 rounded-2xl text-primary w-fit ring-1 ring-primary/20 shadow-inner">
                         <step.icon size={32} />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="lg:hidden text-primary font-black tracking-widest text-sm mb-2">STEP 0{i + 1}</div>
                        <h3 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight">{step.title}</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                          {step.desc}
                        </p>
                      </div>

                      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-secondary/80 backdrop-blur text-secondary-foreground text-xs font-bold uppercase tracking-widest rounded-xl border border-border shadow-sm">
                        <Server size={14} className="opacity-50" /> {step.tech}
                      </div>
                    </div>
                  </div>

                  {/* 🚨 THE 60% MASSIVE IMAGE SHOWCASE */}
                  <div className={`w-full lg:w-[60%] z-10 ${isEven ? 'lg:pr-8' : 'lg:pl-8'}`}>
                    <div className="relative group perspective-1000 w-full">
                      
                      {/* Ambient Enterprise Glow */}
                      <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-transparent to-blue-500/20 rounded-[3rem] blur-3xl opacity-40 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

                      {/* Presentation Canvas */}
                      <div className="bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden relative transition-all duration-700 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(var(--primary),0.1)] p-4 sm:p-6 lg:p-8">
                        
                        {/* Technical Dot Grid Background */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                        {step.imagePath ? (
                          <div className="relative w-full rounded-2xl overflow-hidden ring-1 ring-border/50 shadow-2xl bg-black/5 dark:bg-white/5">
                            <Image 
                              src={step.imagePath}
                              alt={step.title}
                              width={1200}
                              height={800}
                              className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                              priority={i === 0 && view === 'customer'} 
                            />
                          </div>
                        ) : (
                          // FALLBACK PLACEHOLDER
                          <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden ring-1 ring-border/50 shadow-inner bg-background flex flex-col">
                            <div className="h-12 bg-muted/40 border-b border-border flex items-center px-6 gap-2 backdrop-blur-sm">
                               <div className="w-3.5 h-3.5 rounded-full bg-border" />
                               <div className="w-3.5 h-3.5 rounded-full bg-border" />
                               <div className="w-3.5 h-3.5 rounded-full bg-border" />
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
                               <div className="w-20 h-20 rounded-3xl bg-secondary shadow-sm border border-border flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                 <ImageIcon size={40} className="text-muted-foreground/50" />
                               </div>
                               <p className="text-sm font-bold text-foreground uppercase tracking-widest mt-4">
                                 {step.imagePlaceholder}
                               </p>
                               <p className="text-xs text-muted-foreground font-medium max-w-[250px]">
                                 Awaiting high-res asset...
                               </p>
                            </div>
                          </div>
                        )}

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
         <div className="max-w-2xl mx-auto bg-card border border-border p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
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