// import Link from 'next/link'
// import { 
//   ArrowRight, Zap, ShoppingBag, 
//   Smartphone, CreditCard, Star, CheckCircle2,
//   MessageCircle, Truck, BarChart3, ShieldCheck,
//   PackageCheck, MousePointerClick
// } from 'lucide-react'
// export const dynamic = 'force-dynamic'

// import { createServerClientInstance as createClientS } from '@/app/lib/supabase-server'

// import Footer from './Footer.tsx/page'
// import Navbar from './components/Navbar' 


// export default async function LandingPage() {
  
 
//   const supabase = await createClientS()
//   const { data: { user } } = await supabase.auth.getUser()

//   return (
//     <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden selection:bg-primary/20">
      

//       <Navbar user={user} />

//       <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full opacity-50 pointer-events-none" />
//         <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-400/5 blur-[120px] rounded-full opacity-30 pointer-events-none" />

//         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
//           <div className="text-center lg:text-left space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-1000">
//             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
//               <Zap size={14} className="animate-pulse" /> The OS for Instagram Sellers
//             </div>
            
//             <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
//               Automate your <br/>
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500 animate-gradient">
//                 Instagram Empire.
//               </span>
//             </h1>
            
//             <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
//               No website needed. We turn your DMs into a fully automated checkout, shipping, and inventory machine inside WhatsApp.
//             </p>
            
//             <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
//               {user ? (
//                  <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 transition-transform flex items-center justify-center gap-2 btn-velocity">
//                    Go to Dashboard <ArrowRight size={20} />
//                  </Link>
//               ) : (
//                  <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 transition-transform flex items-center justify-center gap-2 btn-velocity">
//                    Start Free Trial <ArrowRight size={20} />
//                  </Link>
//               )}
              
//               <Link href="/demo" className="w-full sm:w-auto px-8 py-4 bg-card border border-border text-foreground rounded-2xl font-bold text-lg hover:bg-secondbg transition-all flex items-center justify-center gap-2">
//                 View Demo Store
//               </Link>
//             </div>

//             {/* SOCIAL PROOF (REAL FACES) */}
//             <div className="pt-8 flex items-center justify-center lg:justify-start gap-6">
//                <div className="flex -space-x-4">
//                   {/* Real random user images from Unsplash */}
//                   <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces" className="w-12 h-12 rounded-full border-4 border-background object-cover" alt="User" />
//                   <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces" className="w-12 h-12 rounded-full border-4 border-background object-cover" alt="User" />
//                   <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=faces" className="w-12 h-12 rounded-full border-4 border-background object-cover" alt="User" />
//                   <div className="w-12 h-12 rounded-full border-4 border-background bg-slate-900 text-white flex items-center justify-center text-xs font-bold">+99</div>
//                </div>
//                <div className="text-left">
//                   <div className="flex text-yellow-400 gap-0.5"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
//                   <p className="text-sm font-bold text-foreground">Join the Top 1% of Sellers</p>
//                </div>
//             </div>
//           </div>

//           <div className="relative animate-in zoom-in-95 duration-1000 delay-200 hidden lg:block perspective-1000">
             
//              <div className="absolute top-20 -right-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-border flex items-center gap-3 animate-bounce duration-[3000ms] z-20">
//                 <div className="p-2 bg-green-100 text-green-600 rounded-lg"><ShoppingBag size={20} /></div>
//                 <div>
//                    <p className="text-xs font-bold text-muted-foreground">New Order</p>
//                    <p className="text-sm font-black text-foreground">+ ₹1,499.00</p>
//                 </div>
//              </div>


//              <div className="relative z-10 w-[340px] mx-auto bg-slate-900 rounded-[3rem] p-3 border-[6px] border-slate-800 shadow-2xl shadow-primary/20 rotate-[-4deg] hover:rotate-0 transition-all duration-500 ease-out hover:scale-105">
//                 <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] h-[600px] overflow-hidden flex flex-col relative">
//                    {/* WhatsApp Header */}
//                    <div className="bg-[#075E54] p-4 pt-10 flex items-center gap-3 text-white">
//                       <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">CP</div>
//                       <div>
//                         <p className="text-sm font-bold">CopIt Store Bot</p>
//                         <p className="text-[10px] opacity-80">Typing...</p>
//                       </div>
//                    </div>
//                    {/* Chat Area */}
//                    <div className="p-4 space-y-4 flex-1 bg-[#efe7dd] dark:bg-slate-900/50 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] dark:bg-none">
                      
//                       {/* Bot Message 1 */}
//                       <div className="bg-white dark:bg-slate-800 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl shadow-sm text-xs max-w-[85%] animate-in slide-in-from-left duration-500">
//                          <div className="h-36 bg-slate-100 rounded-lg mb-2 bg-[url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400')] bg-cover bg-center"></div>
//                          <p className="font-bold text-slate-800 dark:text-white text-sm">Oversized Pump Cover Tee</p>
//                          <p className="text-slate-500 mt-1">₹799.00 • In Stock</p>
//                          <div className="mt-3 border-t border-slate-100 pt-2 text-blue-500 font-bold text-center">View Product</div>
//                       </div>

//                       {/* User Message */}
//                       <div className="bg-[#dcf8c6] dark:bg-primary/20 text-slate-900 dark:text-white p-3 rounded-tl-xl rounded-bl-xl rounded-br-xl shadow-md text-xs self-end max-w-[80%] ml-auto animate-in slide-in-from-right duration-500 delay-300">
//                          <p>I want this! Can I pay via UPI?</p>
//                          <span className="text-[9px] text-slate-500 dark:text-slate-300 block text-right mt-1">10:42 AM <CheckCircle2 size={10} className="inline ml-1 text-blue-500"/></span>
//                       </div>

//                       {/* Bot Popup Trigger */}
//                       <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-primary/20 animate-in slide-in-from-bottom duration-700 delay-700">
//                          <p className="font-bold text-sm mb-1">⚡ Instant Checkout</p>
//                          <p className="text-xs text-slate-500 mb-3">Click below to pay securely.</p>
//                          <button className="w-full bg-primary text-white py-2 rounded-lg font-bold text-xs shadow-md shadow-primary/30">
//                             Pay ₹799 Now
//                          </button>
//                       </div>

//                    </div>
//                 </div>
//              </div>
//           </div>

//         </div>
//       </section>

//       {/* --- FEATURES GRID (ENHANCED) --- */}
//       <section id="features" className="py-32 bg-secondbg border-y border-border relative overflow-hidden">
//         <div className="max-w-7xl mx-auto px-6 relative z-10">
//           <div className="text-center mb-20 max-w-2xl mx-auto">
//              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest mb-6">
//                 Why CopIt?
//              </div>
//              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Everything you need to <span className="text-primary">Dominate.</span></h2>
//              <p className="text-muted-foreground font-medium text-lg">We replaced your entire admin team with a bot. Focus on content, we handle the commerce.</p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//              <FeatureCard 
//                 icon={MessageCircle} 
//                 title="WhatsApp Checkout" 
//                 desc="Customers buy directly in chat. Our Native Popup collects structured addresses (Pincode, House No) so delivery never fails." 
//                 color="text-green-500"
//                 bg="bg-green-500/10"
//              />
//              <FeatureCard 
//                 icon={Truck} 
//                 title="1-Click Logistics" 
//                 desc="Connect your Shiprocket account. Generate shipping labels and tracking links automatically when an order is confirmed." 
//                 color="text-purple-500"
//                 bg="bg-purple-500/10"
//              />
//              <FeatureCard 
//                 icon={BarChart3} 
//                 title="Profit Analytics" 
//                 desc="Track which Influencer or Ad is driving sales. Real-time dashboard for revenue, inventory, and abandoned carts." 
//                 color="text-blue-500"
//                 bg="bg-blue-500/10"
//              />
//              <FeatureCard 
//                 icon={Smartphone} 
//                 title="No App Required" 
//                 desc="Your customers don't need to download anything. It works natively inside the app they use 5 hours a day." 
//                 color="text-orange-500"
//                 bg="bg-orange-500/10"
//              />
//              <FeatureCard 
//                 icon={CreditCard} 
//                 title="Payment Protection" 
//                 desc="Accept UPI, Cards, or COD. We verify every transaction via Razorpay before confirming the order." 
//                 color="text-pink-500"
//                 bg="bg-pink-500/10"
//              />
//              <FeatureCard 
//                 icon={ShieldCheck} 
//                 title="RTO Protection" 
//                 desc="Our AI flags suspicious addresses and 'fake' buyers before you ship, saving you return shipping costs." 
//                 color="text-red-500"
//                 bg="bg-red-500/10"
//              />
//           </div>
//         </div>
//       </section>

//       {/* --- HOW IT WORKS (3 STEPS - ZIG ZAG) --- */}
//       <section id="how-it-works" className="py-32 px-6 bg-background">
//         <div className="max-w-6xl mx-auto space-y-32">
          
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-black tracking-tight">From DM to Delivery in <span className="text-primary">3 Steps.</span></h2>
//           </div>

//           {/* Step 1: THE TRIGGER */}
//           <div className="flex flex-col md:flex-row items-center gap-16 group">
//             <div className="flex-1 space-y-6">
//               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black text-xs uppercase tracking-widest border border-slate-200 dark:border-slate-700">
//                 <MousePointerClick size={14} /> Step 01
//               </div>
//               <h3 className="text-4xl font-black tracking-tight">Share Links, Not Bank Details.</h3>
//               <p className="text-lg text-muted-foreground leading-relaxed">
//                 Stop sending "GPay me here". Generate a professional product link (`copit.in/item/55`). 
//                 Put it in your Bio, Stories, or DM Auto-reply.
//               </p>
//             </div>
//             <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 rounded-[3rem] p-10 border border-border aspect-square md:aspect-video flex items-center justify-center relative overflow-hidden shadow-2xl transition-all group-hover:scale-[1.02]">
//                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
//                {/* Visual */}
//                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl w-64 rotate-3 group-hover:rotate-0 transition-transform duration-500">
//                   <div className="h-40 bg-slate-200 rounded-lg mb-4 bg-[url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400')] bg-cover"></div>
//                   <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
//                   <div className="flex justify-between items-center mt-4">
//                      <span className="text-xs font-bold text-slate-400">copit.in/nike-air</span>
//                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ArrowRight size={14}/></div>
//                   </div>
//                </div>
//             </div>
//           </div>

//           {/* Step 2: THE ACTION (Reversed) */}
//           <div className="flex flex-col md:flex-row-reverse items-center gap-16 group">
//             <div className="flex-1 space-y-6">
//                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black text-xs uppercase tracking-widest border border-slate-200 dark:border-slate-700">
//                 <Smartphone size={14} /> Step 02
//               </div>
//               <h3 className="text-4xl font-black tracking-tight">Zero-Error Checkout.</h3>
//               <p className="text-lg text-muted-foreground leading-relaxed">
//                 When they click, WhatsApp opens automatically. Our bot collects their Size, Address, and Payment.
//                 We auto-verify Pincodes to prevent RTOs (Returns).
//               </p>
//             </div>
//             <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-900 rounded-[3rem] p-10 border border-border aspect-square md:aspect-video flex items-center justify-center relative overflow-hidden shadow-2xl transition-all group-hover:scale-[1.02]">
//                 <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl max-w-xs w-full -rotate-3 group-hover:rotate-0 transition-transform duration-500 border border-slate-100 dark:border-slate-700">
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
//                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><CheckCircle2 size={16} className="text-green-600"/></div>
//                        <div className="text-xs font-bold">Address Verified</div>
//                     </div>
//                     <div className="h-10 w-full bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center px-4 text-xs font-bold text-slate-500">400050 - Bandra West</div>
//                     <div className="h-10 w-full bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center px-4 text-xs font-bold text-slate-500">Flat 402, Ocean View</div>
//                     <button className="w-full bg-green-500 text-white py-3 rounded-xl font-black text-xs tracking-widest shadow-lg shadow-green-500/30">CONFIRM ORDER</button>
//                   </div>
//                </div>
//             </div>
//           </div>

//            {/* Step 3: THE FULFILLMENT */}
//            <div className="flex flex-col md:flex-row items-center gap-16 group">
//             <div className="flex-1 space-y-6">
//               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black text-xs uppercase tracking-widest border border-slate-200 dark:border-slate-700">
//                 <PackageCheck size={14} /> Step 03
//               </div>
//               <h3 className="text-4xl font-black tracking-tight">Auto-Ship & Track.</h3>
//               <p className="text-lg text-muted-foreground leading-relaxed">
//                 Order confirmed? We instantly tell Shiprocket to pick it up. Your customer gets a WhatsApp message with the Tracking Link automatically.
//               </p>
//             </div>
//             <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-900 rounded-[3rem] p-10 border border-border aspect-square md:aspect-video flex items-center justify-center relative overflow-hidden shadow-2xl transition-all group-hover:scale-[1.02]">
//                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl w-72 rotate-3 group-hover:rotate-0 transition-transform duration-500">
//                   <div className="flex items-center gap-4 mb-6">
//                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600"><Truck size={24}/></div>
//                      <div>
//                         <p className="text-sm font-black text-slate-900 dark:text-white">Shipment Created</p>
//                         <p className="text-xs text-slate-400">AWB: 194829102</p>
//                      </div>
//                   </div>
//                   <div className="space-y-2">
//                      <div className="flex gap-2">
//                         <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
//                         <div className="text-xs text-slate-500">Order Picked Up</div>
//                      </div>
//                      <div className="flex gap-2">
//                         <div className="w-2 h-2 bg-slate-300 rounded-full mt-1.5"></div>
//                         <div className="text-xs text-slate-400">In Transit</div>
//                      </div>
//                   </div>
//                </div>
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* --- CTA SECTION --- */}
//       <section className="py-20 px-6">
//         <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/30 group">
//           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 group-hover:scale-110 transition-transform duration-[20s]"></div>
          
//           <div className="relative z-10 space-y-8">
//             <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter">
//               Ready to automate?
//             </h2>
//             <p className="text-blue-100 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
//               Join the new wave of Instagram Sellers who sleep while their bot sells.
//             </p>
//             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
//               {user ? (
//                  <Link href="/dashboard" className="px-10 py-5 bg-white text-primary rounded-2xl font-black text-lg hover:bg-blue-50 transition-colors shadow-xl btn-velocity">
//                    Go to Dashboard
//                  </Link>
//               ) : (
//                  <Link href="/login" className="px-10 py-5 bg-white text-primary rounded-2xl font-black text-lg hover:bg-blue-50 transition-colors shadow-xl btn-velocity">
//                    Launch My Shop
//                  </Link>
//               )}
//             </div>
//             <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-6 opacity-80">
//               No Credit Card Required • Setup in 5 Mins
//             </p>
//           </div>
//         </div>
//       </section>

//       <Footer/>
//     </div>
//   )
// }

// // --- ENHANCED FEATURE CARD ---
// const FeatureCard = ({ icon: Icon, title, desc, color, bg }: { icon: any, title: string, desc: string, color: string, bg: string }) => (
//   <div className="group bg-card hover:bg-secondbg p-8 rounded-[2.5rem] border border-border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
//      {/* Hover Glow Effect */}
//      <div className={`absolute top-0 right-0 w-32 h-32 ${bg} blur-[60px] rounded-full -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100`}></div>
     
//      <div className={`w-16 h-16 ${bg} ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
//         <Icon size={32} />
//      </div>
//      <h3 className="text-xl font-black text-foreground mb-3">{title}</h3>
//      <p className="text-sm text-muted-foreground font-medium leading-relaxed">{desc}</p>
//   </div>
// )

import Link from 'next/link'
import { 
  ArrowRight, Zap, ShoppingBag, 
  Smartphone, CreditCard, Star, CheckCircle2,
  TrendingUp, ShieldCheck, Box, 
  Globe, LayoutDashboard, Lock, Layers,
  RefreshCcw, Truck, MousePointerClick, Activity
} from 'lucide-react'

// Force dynamic rendering so auth works on every load
export const dynamic = 'force-dynamic'

import { createServerClientInstance as createClientS } from '@/app/lib/supabase-server'
import Footer from './Footer.tsx/page'
import Navbar from './components/Navbar' 

export default async function LandingPage() {
  
  const supabase = await createClientS()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden antialiased">
      
      <Navbar user={user} />

      {/* --- HERO SECTION: THE INVISIBLE MACHINE --- */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6">
        {/* Cinematic Background Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          
          {/* Badge: System Status */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-muted-foreground text-xs font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            System Operational • v2.0 Live
          </div>

          {/* Headline: High Impact */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.95] text-slate-900 dark:text-white animate-in fade-in slide-in-from-bottom-6 duration-1000">
            The Invisible <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-primary to-purple-600">
              Selling Machine.
            </span>
          </h1>

          {/* Subtext: Operational Focus */}
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Don't hire a chatbot. <span className="text-foreground font-bold">Hire an Infrastructure.</span><br/>
            We replace manual DMs with an automated checkout, logistics, and recovery engine that runs while you sleep.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
             {user ? (
               <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                 <LayoutDashboard size={20} /> Open Console
               </Link>
             ) : (
               <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white dark:text-black text-white rounded-xl font-bold text-lg shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                 Deploy Infrastructure <ArrowRight size={20} />
               </Link>
             )}
             <Link href="/demo" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-border text-foreground rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
                View Live Simulation
             </Link>
          </div>

          {/* AUTHENTIC METRICS STRIP (Tech Specs, not Fake Numbers) */}
          <div className="mt-20 border-y border-border/50 py-8 bg-background/50 backdrop-blur-sm">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                <div className="text-center">
                   <p className="text-lg font-black text-foreground flex justify-center items-center gap-2"><Lock size={18} className="text-primary"/> 256-bit</p>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">SSL Encryption</p>
                </div>
                <div className="text-center">
                   <p className="text-lg font-black text-foreground flex justify-center items-center gap-2"><Activity size={18} className="text-green-500"/> Real-Time</p>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Inventory Sync</p>
                </div>
                <div className="text-center">
                   <p className="text-lg font-black text-foreground flex justify-center items-center gap-2"><Truck size={18} className="text-purple-500"/> Automated</p>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Shiprocket AWB</p>
                </div>
                <div className="text-center">
                   <p className="text-lg font-black text-foreground flex justify-center items-center gap-2"><CreditCard size={18} className="text-blue-500"/> Instant</p>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Payment Verification</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- THE PIVOT: PROBLEM/SOLUTION --- */}
      <section className="py-24 bg-slate-50 dark:bg-black/20">
        <div className="max-w-6xl mx-auto px-6">
           <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                 <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
                    You are a Brand Owner. <br/>
                    <span className="text-muted-foreground">Not a Data Entry Clerk.</span>
                 </h2>
                 <p className="text-lg text-muted-foreground leading-relaxed">
                    Stop manually typing tracking numbers, begging for screenshots, and tracking inventory on Excel. 
                    CopIt installs a layer of intelligence over your DMs that behaves like a professional ops team.
                 </p>
                 <ul className="space-y-4 pt-4">
                    <li className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border shadow-sm">
                       <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center"><CheckCircle2 size={16} /></div>
                       <div>
                          <p className="font-bold text-foreground text-sm">Automated Reconciliation</p>
                          <p className="text-xs text-muted-foreground">We match payments to orders instantly.</p>
                       </div>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border shadow-sm">
                       <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center"><Truck size={16} /></div>
                       <div>
                          <p className="font-bold text-foreground text-sm">Logistics Autopilot</p>
                          <p className="text-xs text-muted-foreground">AWB generated & Pickup scheduled automatically.</p>
                       </div>
                    </li>
                 </ul>
              </div>
              
              {/* ABSTRACT VISUAL: THE ENGINE */}
              <div className="relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20"></div>
                 <div className="relative bg-card border border-border/50 rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                       <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                       </div>
                       <div className="text-xs font-mono text-muted-foreground">Live Operations Console</div>
                    </div>
                    
                    {/* Simulated Events */}
                    <div className="space-y-4">
                       <div className="flex items-center gap-4 p-3 bg-green-500/5 border border-green-500/10 rounded-xl">
                          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center"><ShoppingBag size={20}/></div>
                          <div className="flex-1">
                             <div className="flex justify-between">
                                <span className="font-bold text-sm">New Order #2931</span>
                                <span className="text-xs font-mono text-green-600">PAID</span>
                             </div>
                             <p className="text-xs text-muted-foreground">Payment Verified via Razorpay.</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl opacity-80">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center"><Box size={20}/></div>
                          <div className="flex-1">
                             <div className="flex justify-between">
                                <span className="font-bold text-sm">Logistics Sync</span>
                                <span className="text-xs font-mono text-blue-600">AUTO</span>
                             </div>
                             <p className="text-xs text-muted-foreground">Shiprocket AWB: 14920102 • Pickup Scheduled</p>
                          </div>
                       </div>

                       <div className="flex items-center gap-4 p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl opacity-60">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center"><TrendingUp size={20}/></div>
                          <div className="flex-1">
                             <div className="flex justify-between">
                                <span className="font-bold text-sm">Retention Engine</span>
                                <span className="text-xs font-mono text-purple-600">+15%</span>
                             </div>
                             <p className="text-xs text-muted-foreground">Abandoned Cart recovered via WhatsApp Nudge.</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- FEATURE: THE MAGIC LINK (Transplanted & Enhanced) --- */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black text-xs uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                <MousePointerClick size={14} /> The Magic Link
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight">"Typing addresses in Chat is a nightmare."</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We solved it. When a user is ready to buy, we generate a secure, transient <span className="text-foreground font-bold">Magic Link</span>.
                <br/><br/>
                They tap, fill a proper form (with Pincode validation), and we sync the clean data back to the chat instantly.
              </p>
              <div className="flex gap-4 pt-4">
                 <div className="flex-1 p-4 bg-secondbg rounded-2xl border border-border">
                    <p className="text-2xl font-black text-foreground">0%</p>
                    <p className="text-xs font-bold text-muted-foreground">Address Errors</p>
                 </div>
                 <div className="flex-1 p-4 bg-secondbg rounded-2xl border border-border">
                    <p className="text-2xl font-black text-foreground">100%</p>
                    <p className="text-xs font-bold text-muted-foreground">Pincode Valid</p>
                 </div>
              </div>
            </div>

            {/* Visual: The Link transforming into Form */}
            <div className="flex-1 relative w-full">
               <div className="relative bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500 group">
                  <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                     <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"/>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"/>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"/>
                     </div>
                     <div className="flex-1 text-center text-[10px] font-bold text-muted-foreground bg-secondbg py-1.5 rounded-md mx-6">
                        copit.in/fill-address/token=8f92a...
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex gap-4">
                        <div className="h-10 flex-1 bg-secondbg rounded-xl border border-border/50 group-hover:bg-primary/5 transition-colors"></div>
                        <div className="h-10 w-24 bg-secondbg rounded-xl border border-border/50"></div>
                     </div>
                     <div className="h-10 w-full bg-secondbg rounded-xl border border-border/50"></div>
                     <div className="h-12 w-full bg-primary rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center text-white font-bold text-sm mt-4 hover:scale-[1.02] transition-transform cursor-pointer">
                        Confirm & Return to Chat
                     </div>
                  </div>
                  
                  {/* Floating Cursor */}
                  <div className="absolute -bottom-4 -right-4 bg-foreground text-background px-3 py-1.5 rounded-lg shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
                     <MousePointerClick size={14}/> Clicked!
                  </div>
               </div>
            </div>
        </div>
      </section>

      {/* --- GROWTH ENGINE (Retention & Upsells) --- */}
      <section id="features" className="py-24 bg-secondbg border-y border-border/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
             <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 rounded-full">
                Growth Engine
             </div>
             <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Retention on <span className="text-primary">Autopilot.</span></h2>
             <p className="text-muted-foreground text-lg font-medium">
               Most bots just reply. CopIt closes deals, upsells customers, and recovers lost sales.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
             
             {/* Feature 1: The Payment Guard */}
             <div className="md:col-span-2 group bg-card p-10 rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 blur-[80px] rounded-full pointer-events-none" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                   <div className="mb-8">
                      <div className="flex items-center gap-4 mb-6">
                         <div className="w-14 h-14 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-2xl flex items-center justify-center">
                           <ShieldCheck size={28} />
                         </div>
                         <div className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                           Zero-Fail Fallback
                         </div>
                      </div>
                      <h3 className="text-3xl font-black mb-3">Revenue Protection</h3>
                      <p className="text-muted-foreground font-medium leading-relaxed max-w-lg text-lg">
                        Payment Gateway down? Razorpay failed? 
                        <span className="text-foreground font-bold"> CopIt doesn't let the sale die.</span> 
                        Our backend automatically switches to a Manual UPI Link + Screenshot Verification flow.
                      </p>
                   </div>
                </div>
             </div>

             {/* Feature 2: Upsell Engine */}
             <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[60px] rounded-full pointer-events-none" />
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                   <TrendingUp size={28} />
                </div>
                <h3 className="text-2xl font-black mb-3">The "5-Second" Upsell</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  We wait exactly 5 seconds after an order to pitch a discounted add-on. 
                  <span className="block mt-4 text-xs font-bold text-foreground bg-background/80 p-3 rounded-xl border border-border/50 shadow-sm">
                    "Wait! Add matching socks for ₹199? (Save 20%)"
                  </span>
                </p>
             </div>

             {/* Feature 3: Cart Recovery */}
             <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group">
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/20 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                   <RefreshCcw size={28} />
                </div>
                <h3 className="text-2xl font-black mb-3">Cart Sniper</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  User stopped replying? We nudge them automatically after 30 mins with a time-sensitive discount code.
                  <span className="text-foreground font-bold"> Recovers ~15% of lost carts.</span>
                </p>
             </div>

             {/* Feature 4: Review Gating */}
             <div className="md:col-span-2 bg-card p-10 rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl transition-all relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                   <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                      <Star size={28} />
                   </div>
                   <h3 className="text-3xl font-black mb-3">Reputation Firewall</h3>
                   <p className="text-muted-foreground font-medium text-lg mb-6">
                     We intercept reviews before they go public.
                   </p>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-green-500 font-bold text-lg">★★★★★</span>
                        <ArrowRight size={14} className="text-muted-foreground"/>
                        <span className="text-sm font-bold bg-green-500/10 text-green-600 px-2 py-1 rounded">Posted Publicly</span>
                      </div>
                      <div className="flex items-center gap-3 opacity-60">
                        <span className="text-red-500 font-bold text-lg">★☆☆☆☆</span>
                        <ArrowRight size={14} className="text-muted-foreground"/>
                        <span className="text-sm font-bold bg-red-500/10 text-red-600 px-2 py-1 rounded">Admin Alert Only</span>
                      </div>
                   </div>
                </div>
             </div>

          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Horizontal Timeline) --- */}
      <section className="py-24 bg-card border-y border-border">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-black text-center mb-16">The Fulfillment Pipeline</h2>
            
            <div className="grid md:grid-cols-4 gap-8 relative">
               {/* Connector Line */}
               <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent border-t border-dashed border-primary/50 -z-10" />

               {[
                  { title: "Trigger", desc: "User clicks link or DMs 'Buy'", icon: Zap },
                  { title: "Capture", desc: "Secure Web Form collects info", icon: Lock },
                  { title: "Verify", desc: "Payment checked automatically", icon: CreditCard },
                  { title: "Dispatch", desc: "AWB generated instantly", icon: Truck },
               ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center group">
                     <div className="w-16 h-16 bg-background border-2 border-border group-hover:border-primary/50 rounded-2xl flex items-center justify-center mb-6 shadow-lg z-10 transition-colors">
                        <step.icon size={24} className="text-primary" />
                     </div>
                     <h3 className="text-lg font-black mb-2">{step.title}</h3>
                     <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-slate-900 dark:bg-slate-950 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl border border-slate-800">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
           
           <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8">
                 Ready to professionalize?
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                 Join the new wave of Instagram brands running on infrastructure, not manual labor.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Link href="/login" className="px-10 py-5 bg-white text-black rounded-xl font-bold text-lg hover:bg-slate-200 transition-colors shadow-lg">
                    Deploy Infrastructure
                 </Link>
                 <Link href="/demo" className="px-10 py-5 bg-transparent border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
                    View Demo
                 </Link>
              </div>
              <p className="mt-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
                 No Credit Card Required • Cancel Anytime
              </p>
           </div>
        </div>
      </section>

      <Footer/>
    </div>
  )
}