'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ShoppingBag, 
  Star, 
  CheckCircle2, 
  MessageCircle, 
  ArrowLeft, 
  Zap,
  ShieldCheck,
  ChevronRight
} from 'lucide-react'

export default function DemoPage() {
  const [selectedSize, setSelectedSize] = useState('UK 8')
  const [showConfetti, setShowConfetti] = useState(false)

  // 1. SIMULATE THE WHATSAPP CLICK
  const handleBuyClick = () => {
    setShowConfetti(true)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      {/* --- HEADER: EXPLAINER --- */}
      <div className="text-center mb-8 relative z-10 max-w-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Zap size={12} className="fill-blue-400" /> Live Simulation
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
          Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Buyer Journey</span>
        </h1>
        <p className="text-slate-400 text-sm">
          This is exactly what your Instagram followers will see when they click your link. 
          Try buying the sneakers below.
        </p>
      </div>

      {/* --- THE PHONE MOCKUP (THE DEMO STORE) --- */}
      <div className="relative w-full max-w-[380px] bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-slate-900 overflow-hidden z-10 shrink-0">
        
        {/* Phone Notch/Header */}
        <div className="bg-white px-5 py-4 flex justify-between items-center border-b border-slate-100 sticky top-0 z-20">
          <div className="font-black text-xl tracking-tighter flex items-center gap-1">
            <span className="bg-black text-white px-1 rounded">DROP</span>CULTURE
          </div>
          <div className="relative">
            <ShoppingBag className="text-slate-900" size={22} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">1</span>
          </div>
        </div>

        {/* Product Image */}
        <div className="relative bg-slate-100 h-[320px] group">
           {/* Placeholder for Product Image - Using a colored gradient if image fails, but mimicking a sneaker shot */}
           <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              {/* If you have a sneaker image, replace this img tag */}
              <img 
                src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800" 
                alt="Nike Air Jordan" 
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
              />
           </div>
           
           <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
             <Star size={12} className="text-yellow-500 fill-yellow-500" /> 4.9 (1.2k Reviews)
           </div>
        </div>

        {/* Product Details */}
        <div className="p-6 pb-24 bg-white">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-none mb-1">Retro High OG</h2>
              <p className="text-slate-500 text-sm font-medium">Chicago Lost & Found</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-blue-600">₹16,999</p>
              <p className="text-xs text-slate-400 line-through">₹19,999</p>
            </div>
          </div>

          {/* Size Selector */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-slate-900">Select Size (UK)</span>
              <span className="text-xs text-blue-600 font-bold cursor-pointer">Size Chart</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['UK 7', 'UK 8', 'UK 9', 'UK 10'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    selectedSize === size
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Signals */}
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg shrink-0">
              <ShieldCheck size={16} className="text-green-600" />
              <span className="text-[10px] font-bold text-green-800 uppercase">100% Authentic</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg shrink-0">
              <Zap size={16} className="text-blue-600" />
              <span className="text-[10px] font-bold text-blue-800 uppercase">Fast Shipping</span>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR (Sticky) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100">
          <button 
            onClick={handleBuyClick}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-green-500/20"
          >
            <MessageCircle size={22} className="fill-white" />
            Order on WhatsApp
          </button>
          <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
            Powered by CopIt • Secure Checkout
          </p>
        </div>

        {/* --- THE "SIMULATION REVEAL" POPUP --- */}
        {showConfetti && (
          <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
             <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-xs transform scale-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Did you feel that?</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  In a real store, this button would instantly open WhatsApp with:
                  <br/>
                  <span className="font-mono text-xs bg-slate-100 p-1 rounded mt-2 block text-slate-800">
                    "Hi! I want to buy Retro High OG (Size: {selectedSize})..."
                  </span>
                  <br/>
                  No website forms. No friction.
                </p>
                <div className="space-y-3">
                  <Link href="/login" className="block w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors text-sm">
                    Build This Store for Free
                  </Link>
                  <button 
                    onClick={() => setShowConfetti(false)}
                    className="block w-full text-slate-500 text-xs font-bold hover:text-slate-800"
                  >
                    Try Demo Again
                  </button>
                </div>
             </div>
          </div>
        )}

      </div>

      {/* --- FOOTER CTA --- */}
      <div className="mt-8 flex flex-col md:flex-row items-center gap-4 relative z-10">
         <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
            <ArrowLeft size={16} /> Back to Homepage
         </Link>
         <Link href="/pricing" className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 rounded-full text-sm font-bold transition-all backdrop-blur-md flex items-center gap-2">
            Get CopIt Pro <ChevronRight size={16} />
         </Link>
      </div>

    </div>
  )
}