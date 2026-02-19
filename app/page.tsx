import Link from 'next/link'
import { 
  ArrowRight, Zap, ShoppingBag, 
  Smartphone, CreditCard, Star, CheckCircle2,
  TrendingUp, ShieldCheck, Box, 
  Globe, LayoutDashboard, Lock, Layers,
  RefreshCcw, Truck, MousePointerClick, Activity,
  MessageCircle, Sparkles, AlertCircle
} from 'lucide-react'

export const dynamic = 'force-dynamic'

import { createServerClientInstance as createClientS } from '@/app/lib/supabase-server'
import Footer from './Footer.tsx/page'
import Navbar from './components/Navbar' 

export default async function LandingPage() {
  
  const supabase = await createClientS()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 overflow-x-hidden antialiased">
      
      <Navbar user={user} />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 overflow-hidden">
        {/* Soft Background Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[600px] bg-gradient-to-b from-blue-50/80 to-transparent dark:from-blue-950/20 dark:to-transparent rounded-b-[50%] pointer-events-none -z-10" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Friendly Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            Now supporting WhatsApp & Instagram
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-slate-900 dark:text-white animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Turn your DMs into <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Orders on Autopilot.
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Stop replying manually to "Price?" and "Available?". <br/>
            CopIt handles orders, payments, and shipping automatically—so you can focus on growing your brand.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
             {user ? (
               <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-200 dark:shadow-blue-900/20 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2">
                 <LayoutDashboard size={20} /> Go to Dashboard
               </Link>
             ) : (
               <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white dark:text-black text-white rounded-xl font-bold text-lg shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2">
                 Get Started for Free <ArrowRight size={20} />
               </Link>
             )}
             <Link href="/workflow" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                Workflow
             </Link>
             
          </div>

          <div className="mt-20 pt-8 border-t border-slate-200/60 dark:border-slate-800/60">
             <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Powering Modern Indian Brands</p>
             <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 font-bold text-xl text-slate-700 dark:text-slate-300">
                   <ShieldCheck size={24} className="text-green-500"/> Razorpay Secure
                </div>
                <div className="flex items-center gap-2 font-bold text-xl text-slate-700 dark:text-slate-300">
                   <Truck size={24} className="text-purple-500"/> Shiprocket
                </div>
                <div className="flex items-center gap-2 font-bold text-xl text-slate-700 dark:text-slate-300">
                   <MessageCircle size={24} className="text-green-600"/> WhatsApp API
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- PROBLEM/SOLUTION --- */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
           <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                 <div className="inline-block p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                    <Activity size={24} className="text-blue-600" />
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                    You started a business to create, <br/>
                    <span className="text-slate-500">not to be a chat operator.</span>
                 </h2>
                 <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    Drowning in DMs? Manually copy-pasting tracking numbers? Chasing payments? 
                    CopIt acts like your smart manager. It works 24/7, replying to customers and managing orders instantly.
                 </p>
                 
                 <div className="space-y-4 pt-4">
                    <div className="flex gap-4">
                       <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center flex-shrink-0"><CheckCircle2 size={20} /></div>
                       <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">Auto-Reconciliation</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">We verify every payment automatically. No fake screenshots.</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center flex-shrink-0"><Truck size={20} /></div>
                       <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">Instant Logistics</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">AWB created and Pickup scheduled the moment payment is done.</p>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/20 blur-[80px] rounded-full"></div>
                 <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                       <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                       </div>
                       <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Activity</div>
                    </div>
                    
                    <div className="space-y-3">
                       <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-600 shadow-sm flex items-center justify-center text-green-500"><ShoppingBag size={20}/></div>
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-sm text-slate-800 dark:text-white">New Order #2931</span>
                                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">PAID</span>
                             </div>
                             <p className="text-xs text-slate-500">₹1,499 received via UPI</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-600 shadow-sm flex items-center justify-center text-blue-500"><Truck size={20}/></div>
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-sm text-slate-800 dark:text-white">Shipment Booked</span>
                                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">AWB: 10293</span>
                             </div>
                             <p className="text-xs text-slate-500">Pickup scheduled for tomorrow</p>
                          </div>
                       </div>

                       <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-600 shadow-sm flex items-center justify-center text-purple-500"><Sparkles size={20}/></div>
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-sm text-slate-800 dark:text-white">Smart Upsell</span>
                                <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">+ ₹499</span>
                             </div>
                             <p className="text-xs text-slate-500">Customer added "Matching Belt" via bot</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- THE MAGIC LINK --- */}
      <section className="py-24 px-6 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-bold text-xs border border-amber-100 dark:border-amber-800">
                <MousePointerClick size={14} /> Solves "Wrong Address" Issues
              </div>
              <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">No more "Typing Address" errors.</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Typing an address line-by-line in a chat is painful. 
                We send your customer a secure <span className="text-slate-900 dark:text-white font-bold">Magic Link</span>. 
                They click, fill a clean form (with Pincode check), and confirm. It takes 10 seconds.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                 <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">0%</p>
                    <p className="text-sm font-medium text-slate-500">Return to Origin (RTO)</p>
                 </div>
                 <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">100%</p>
                    <p className="text-sm font-medium text-slate-500">Correct Pincodes</p>
                 </div>
              </div>
            </div>

            <div className="flex-1 relative w-full">
               <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500 group max-w-md mx-auto">
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                     <div className="flex-1 text-center text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 py-2 rounded-lg mx-6">
                        copit.in/secure-checkout/8f92a...
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex gap-4">
                        <div className="h-12 flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                        <div className="h-12 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                     </div>
                     <div className="h-12 w-full bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                     <div className="h-14 w-full bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center text-white font-bold text-sm mt-4 hover:scale-[1.02] transition-transform cursor-pointer">
                        Confirm & Return to WhatsApp
                     </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-slate-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg shadow-xl text-sm font-bold flex items-center gap-2 animate-bounce">
                     <MousePointerClick size={16}/> Customer Clicks
                  </div>
               </div>
            </div>
        </div>
      </section>

      {/* --- BENTO GRID: FEATURES (UPDATED COLORS) --- */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
             <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 rounded-full uppercase">
                Powerful Features
             </div>
             {/* UPDATED HEADLINE */}
             <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">Run your business on <span className="text-indigo-600">Autopilot.</span></h2>
             <p className="text-slate-600 dark:text-slate-400 text-lg">
               Everything you need to run a professional e-commerce brand, without the complexity.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             
             {/* Feature 1: Payment Fallback (Purple - Trust & Magic) */}
             <div className="md:col-span-2 bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all" />
                
                <div className="flex flex-col h-full justify-between relative z-10">
                   <div>
                      {/* Purple Icon Container */}
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                         <ShieldCheck size={24} />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Revenue Guard.</h3>
                      <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-md">
                        Payment Gateway down? No problem. CopIt automatically switches to a 
                        <span className="text-slate-900 dark:text-white font-bold"> "Scan & Upload" </span> 
                        mode. Your customer can still pay via UPI instantly.
                      </p>
                   </div>
                   <div className="mt-8 flex gap-2">
                      <div className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 text-xs font-bold rounded-lg border border-purple-100 dark:border-purple-800">100% Uptime</div>
                      <div className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg">Zero Revenue Loss</div>
                   </div>
                </div>
             </div>

             {/* Feature 2: Upsell (Teal - Growth) */}
             <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                   <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Smart Upsells</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  The bot waits exactly 5 seconds after an order to pitch a discount:
                </p>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                   <p className="text-xs font-bold text-slate-800 dark:text-white">Bot:</p>
                   <p className="text-xs text-slate-600 dark:text-slate-400 italic">"Wait! Want to add matching socks for just ₹199?"</p>
                </div>
             </div>

             {/* Feature 3: Cart Recovery (Blue - Communication) */}
             <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                   <MessageCircle size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Cart Recovery</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  If a customer stops replying, we nudge them after 30 mins with a small discount code.
                  <span className="block mt-2 font-bold text-blue-600">Recovers ~15% of lost sales.</span>
                </p>
             </div>

             {/* Feature 4: Review Management (Amber - Standards) */}
             <div className="md:col-span-2 bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-center">
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                   <div className="flex-1">
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                         <Star size={24} />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Reputation Firewall</h3>
                      <p className="text-slate-600 dark:text-slate-400 font-medium max-w-md">
                        We ask for reviews automatically. Good ones go public. Bad ones come to you first, so you can fix the issue privately.
                      </p>
                   </div>
                   <div className="space-y-3 min-w-[240px]">
                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20">
                        <span className="text-green-500 font-bold text-sm">★★★★★</span>
                        <ArrowRight size={14} className="text-slate-300"/>
                        <span className="text-[10px] font-bold text-green-700 uppercase">Published</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/20 opacity-70">
                        <span className="text-amber-500 font-bold text-sm">★☆☆☆☆</span>
                        <ArrowRight size={14} className="text-slate-300"/>
                        <span className="text-[10px] font-bold text-amber-600 uppercase">Alert Admin</span>
                      </div>
                   </div>
                </div>
             </div>

          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 bg-white dark:bg-slate-950">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16 text-slate-900 dark:text-white">How it Works</h2>
            
            <div className="grid md:grid-cols-4 gap-8 relative">
               <div className="hidden md:block absolute top-8 left-0 w-full h-[2px] bg-slate-100 dark:bg-slate-800 z-0" />

               {[
                  { title: "Trigger", desc: "User DMs you 'Buy' or clicks link", icon: Zap },
                  { title: "Capture", desc: "They fill address in secure form", icon: Lock },
                  { title: "Verify", desc: "We confirm payment automatically", icon: CreditCard },
                  { title: "Ship", desc: "AWB Generated instantly", icon: Truck },
               ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center relative z-10">
                     <div className="w-16 h-16 bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <step.icon size={24} className="text-blue-600" />
                     </div>
                     <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{step.title}</h3>
                     <p className="text-sm text-slate-500">{step.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-blue-600 dark:bg-blue-700 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-200 dark:shadow-blue-900/50">
           <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                 Ready to automate your business?
              </h2>
              <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
                 Join hundreds of Indian brands running on autopilot. Save time, reduce errors, and sleep better.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Link href="/login" className="px-10 py-5 bg-white text-blue-700 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all">
                    Start Free Trial
                 </Link>
                 <Link href="/demo" className="px-10 py-5 bg-transparent border border-blue-400 text-white rounded-xl font-bold text-lg hover:bg-blue-500 transition-colors">
                    Watch Demo
                 </Link>
              </div>
              <p className="mt-8 text-xs font-bold text-blue-200 uppercase tracking-widest opacity-80">
                 Easy Setup • No Credit Card Required
              </p>
           </div>
        </div>
      </section>

      <Footer/>
    </div>
  )
}