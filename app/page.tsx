import Link from 'next/link'
import { 
  ArrowRight, Zap, ShoppingBag, 
  Smartphone, CreditCard, Star, CheckCircle2,
  MessageCircle, Truck, BarChart3, ShieldCheck,
  PackageCheck, MousePointerClick
} from 'lucide-react'

// 1. IMPORT SUPABASE SERVER CLIENT
// import { createClient as createClientS } from '/lib/supabase-browser'
import { createClient as createClientS } from './lib/supabase-browser'

import Footer from './Footer.tsx/page'
import Navbar from './components/Navbar' // 👈 IMPORT THE NEW NAVBAR

// 2. MAKE COMPONENT ASYNC
export default async function LandingPage() {
  
  // 3. CHECK SESSION ON SERVER
  const supabase = await createClientS()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden selection:bg-primary/20">
      
      {/* --- SMART NAVBAR --- */}
      {/* We pass the 'user' object to the Client Component so it knows what button to show */}
      <Navbar user={user} />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-400/5 blur-[120px] rounded-full opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* LEFT: COPY */}
          <div className="text-center lg:text-left space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
              <Zap size={14} className="animate-pulse" /> The OS for Instagram Sellers
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
              Automate your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500 animate-gradient">
                Instagram Empire.
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              No website needed. We turn your DMs into a fully automated checkout, shipping, and inventory machine inside WhatsApp.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              {user ? (
                 <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 transition-transform flex items-center justify-center gap-2 btn-velocity">
                   Go to Dashboard <ArrowRight size={20} />
                 </Link>
              ) : (
                 <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 transition-transform flex items-center justify-center gap-2 btn-velocity">
                   Start Free Trial <ArrowRight size={20} />
                 </Link>
              )}
              
              <Link href="/demo" className="w-full sm:w-auto px-8 py-4 bg-card border border-border text-foreground rounded-2xl font-bold text-lg hover:bg-secondbg transition-all flex items-center justify-center gap-2">
                View Demo Store
              </Link>
            </div>

            {/* SOCIAL PROOF (REAL FACES) */}
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-6">
               <div className="flex -space-x-4">
                  {/* Real random user images from Unsplash */}
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces" className="w-12 h-12 rounded-full border-4 border-background object-cover" alt="User" />
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces" className="w-12 h-12 rounded-full border-4 border-background object-cover" alt="User" />
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=faces" className="w-12 h-12 rounded-full border-4 border-background object-cover" alt="User" />
                  <div className="w-12 h-12 rounded-full border-4 border-background bg-slate-900 text-white flex items-center justify-center text-xs font-bold">+99</div>
               </div>
               <div className="text-left">
                  <div className="flex text-yellow-400 gap-0.5"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                  <p className="text-sm font-bold text-foreground">Join the Top 1% of Sellers</p>
               </div>
            </div>
          </div>

          {/* RIGHT: WHATSAPP MOCKUP */}
          <div className="relative animate-in zoom-in-95 duration-1000 delay-200 hidden lg:block perspective-1000">
             
             {/* Floating Badge 1 */}
             <div className="absolute top-20 -right-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-border flex items-center gap-3 animate-bounce duration-[3000ms] z-20">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg"><ShoppingBag size={20} /></div>
                <div>
                   <p className="text-xs font-bold text-muted-foreground">New Order</p>
                   <p className="text-sm font-black text-foreground">+ ₹1,499.00</p>
                </div>
             </div>

             {/* Main Phone */}
             <div className="relative z-10 w-[340px] mx-auto bg-slate-900 rounded-[3rem] p-3 border-[6px] border-slate-800 shadow-2xl shadow-primary/20 rotate-[-4deg] hover:rotate-0 transition-all duration-500 ease-out hover:scale-105">
                <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] h-[600px] overflow-hidden flex flex-col relative">
                   {/* WhatsApp Header */}
                   <div className="bg-[#075E54] p-4 pt-10 flex items-center gap-3 text-white">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">CP</div>
                      <div>
                        <p className="text-sm font-bold">CopIt Store Bot</p>
                        <p className="text-[10px] opacity-80">Typing...</p>
                      </div>
                   </div>
                   {/* Chat Area */}
                   <div className="p-4 space-y-4 flex-1 bg-[#efe7dd] dark:bg-slate-900/50 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] dark:bg-none">
                      
                      {/* Bot Message 1 */}
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl shadow-sm text-xs max-w-[85%] animate-in slide-in-from-left duration-500">
                         <div className="h-36 bg-slate-100 rounded-lg mb-2 bg-[url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400')] bg-cover bg-center"></div>
                         <p className="font-bold text-slate-800 dark:text-white text-sm">Oversized Pump Cover Tee</p>
                         <p className="text-slate-500 mt-1">₹799.00 • In Stock</p>
                         <div className="mt-3 border-t border-slate-100 pt-2 text-blue-500 font-bold text-center">View Product</div>
                      </div>

                      {/* User Message */}
                      <div className="bg-[#dcf8c6] dark:bg-primary/20 text-slate-900 dark:text-white p-3 rounded-tl-xl rounded-bl-xl rounded-br-xl shadow-md text-xs self-end max-w-[80%] ml-auto animate-in slide-in-from-right duration-500 delay-300">
                         <p>I want this! Can I pay via UPI?</p>
                         <span className="text-[9px] text-slate-500 dark:text-slate-300 block text-right mt-1">10:42 AM <CheckCircle2 size={10} className="inline ml-1 text-blue-500"/></span>
                      </div>

                      {/* Bot Popup Trigger */}
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-primary/20 animate-in slide-in-from-bottom duration-700 delay-700">
                         <p className="font-bold text-sm mb-1">⚡ Instant Checkout</p>
                         <p className="text-xs text-slate-500 mb-3">Click below to pay securely.</p>
                         <button className="w-full bg-primary text-white py-2 rounded-lg font-bold text-xs shadow-md shadow-primary/30">
                            Pay ₹799 Now
                         </button>
                      </div>

                   </div>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* --- FEATURES GRID (ENHANCED) --- */}
      <section id="features" className="py-32 bg-secondbg border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 max-w-2xl mx-auto">
             <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest mb-6">
                Why CopIt?
             </div>
             <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Everything you need to <span className="text-primary">Dominate.</span></h2>
             <p className="text-muted-foreground font-medium text-lg">We replaced your entire admin team with a bot. Focus on content, we handle the commerce.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             <FeatureCard 
                icon={MessageCircle} 
                title="WhatsApp Checkout" 
                desc="Customers buy directly in chat. Our Native Popup collects structured addresses (Pincode, House No) so delivery never fails." 
                color="text-green-500"
                bg="bg-green-500/10"
             />
             <FeatureCard 
                icon={Truck} 
                title="1-Click Logistics" 
                desc="Connect your Shiprocket account. Generate shipping labels and tracking links automatically when an order is confirmed." 
                color="text-purple-500"
                bg="bg-purple-500/10"
             />
             <FeatureCard 
                icon={BarChart3} 
                title="Profit Analytics" 
                desc="Track which Influencer or Ad is driving sales. Real-time dashboard for revenue, inventory, and abandoned carts." 
                color="text-blue-500"
                bg="bg-blue-500/10"
             />
             <FeatureCard 
                icon={Smartphone} 
                title="No App Required" 
                desc="Your customers don't need to download anything. It works natively inside the app they use 5 hours a day." 
                color="text-orange-500"
                bg="bg-orange-500/10"
             />
             <FeatureCard 
                icon={CreditCard} 
                title="Payment Protection" 
                desc="Accept UPI, Cards, or COD. We verify every transaction via Razorpay before confirming the order." 
                color="text-pink-500"
                bg="bg-pink-500/10"
             />
             <FeatureCard 
                icon={ShieldCheck} 
                title="RTO Protection" 
                desc="Our AI flags suspicious addresses and 'fake' buyers before you ship, saving you return shipping costs." 
                color="text-red-500"
                bg="bg-red-500/10"
             />
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (3 STEPS - ZIG ZAG) --- */}
      <section id="how-it-works" className="py-32 px-6 bg-background">
        <div className="max-w-6xl mx-auto space-y-32">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">From DM to Delivery in <span className="text-primary">3 Steps.</span></h2>
          </div>

          {/* Step 1: THE TRIGGER */}
          <div className="flex flex-col md:flex-row items-center gap-16 group">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black text-xs uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                <MousePointerClick size={14} /> Step 01
              </div>
              <h3 className="text-4xl font-black tracking-tight">Share Links, Not Bank Details.</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Stop sending "GPay me here". Generate a professional product link (`copit.in/item/55`). 
                Put it in your Bio, Stories, or DM Auto-reply.
              </p>
            </div>
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 rounded-[3rem] p-10 border border-border aspect-square md:aspect-video flex items-center justify-center relative overflow-hidden shadow-2xl transition-all group-hover:scale-[1.02]">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
               {/* Visual */}
               <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl w-64 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <div className="h-40 bg-slate-200 rounded-lg mb-4 bg-[url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400')] bg-cover"></div>
                  <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="flex justify-between items-center mt-4">
                     <span className="text-xs font-bold text-slate-400">copit.in/nike-air</span>
                     <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ArrowRight size={14}/></div>
                  </div>
               </div>
            </div>
          </div>

          {/* Step 2: THE ACTION (Reversed) */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16 group">
            <div className="flex-1 space-y-6">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black text-xs uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                <Smartphone size={14} /> Step 02
              </div>
              <h3 className="text-4xl font-black tracking-tight">Zero-Error Checkout.</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                When they click, WhatsApp opens automatically. Our bot collects their Size, Address, and Payment.
                We auto-verify Pincodes to prevent RTOs (Returns).
              </p>
            </div>
            <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-900 rounded-[3rem] p-10 border border-border aspect-square md:aspect-video flex items-center justify-center relative overflow-hidden shadow-2xl transition-all group-hover:scale-[1.02]">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl max-w-xs w-full -rotate-3 group-hover:rotate-0 transition-transform duration-500 border border-slate-100 dark:border-slate-700">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                       <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><CheckCircle2 size={16} className="text-green-600"/></div>
                       <div className="text-xs font-bold">Address Verified</div>
                    </div>
                    <div className="h-10 w-full bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center px-4 text-xs font-bold text-slate-500">400050 - Bandra West</div>
                    <div className="h-10 w-full bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center px-4 text-xs font-bold text-slate-500">Flat 402, Ocean View</div>
                    <button className="w-full bg-green-500 text-white py-3 rounded-xl font-black text-xs tracking-widest shadow-lg shadow-green-500/30">CONFIRM ORDER</button>
                  </div>
               </div>
            </div>
          </div>

           {/* Step 3: THE FULFILLMENT */}
           <div className="flex flex-col md:flex-row items-center gap-16 group">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black text-xs uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                <PackageCheck size={14} /> Step 03
              </div>
              <h3 className="text-4xl font-black tracking-tight">Auto-Ship & Track.</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Order confirmed? We instantly tell Shiprocket to pick it up. Your customer gets a WhatsApp message with the Tracking Link automatically.
              </p>
            </div>
            <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-900 rounded-[3rem] p-10 border border-border aspect-square md:aspect-video flex items-center justify-center relative overflow-hidden shadow-2xl transition-all group-hover:scale-[1.02]">
               <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl w-72 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600"><Truck size={24}/></div>
                     <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">Shipment Created</p>
                        <p className="text-xs text-slate-400">AWB: 194829102</p>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                        <div className="text-xs text-slate-500">Order Picked Up</div>
                     </div>
                     <div className="flex gap-2">
                        <div className="w-2 h-2 bg-slate-300 rounded-full mt-1.5"></div>
                        <div className="text-xs text-slate-400">In Transit</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/30 group">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 group-hover:scale-110 transition-transform duration-[20s]"></div>
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter">
              Ready to automate?
            </h2>
            <p className="text-blue-100 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Join the new wave of Instagram Sellers who sleep while their bot sells.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {user ? (
                 <Link href="/dashboard" className="px-10 py-5 bg-white text-primary rounded-2xl font-black text-lg hover:bg-blue-50 transition-colors shadow-xl btn-velocity">
                   Go to Dashboard
                 </Link>
              ) : (
                 <Link href="/login" className="px-10 py-5 bg-white text-primary rounded-2xl font-black text-lg hover:bg-blue-50 transition-colors shadow-xl btn-velocity">
                   Launch My Shop
                 </Link>
              )}
            </div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-6 opacity-80">
              No Credit Card Required • Setup in 5 Mins
            </p>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  )
}

// --- ENHANCED FEATURE CARD ---
const FeatureCard = ({ icon: Icon, title, desc, color, bg }: { icon: any, title: string, desc: string, color: string, bg: string }) => (
  <div className="group bg-card hover:bg-secondbg p-8 rounded-[2.5rem] border border-border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
     {/* Hover Glow Effect */}
     <div className={`absolute top-0 right-0 w-32 h-32 ${bg} blur-[60px] rounded-full -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100`}></div>
     
     <div className={`w-16 h-16 ${bg} ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
        <Icon size={32} />
     </div>
     <h3 className="text-xl font-black text-foreground mb-3">{title}</h3>
     <p className="text-sm text-muted-foreground font-medium leading-relaxed">{desc}</p>
  </div>
)