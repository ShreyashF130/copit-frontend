import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Zap, ShieldCheck } from 'lucide-react'

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // 1. BACKGROUND: Added a subtle gradient to make it feel premium, not just plain grey.
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      
      {/* 2. HEADER: Glassmorphism effect (blur) + Branding */}
      <div className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Zap size={16} fill="currentColor" />
            </div>
            <span className="font-black text-slate-900 tracking-tighter text-lg">
              COPIT <span className="text-slate-400 font-medium text-xs tracking-widest ml-1">LEGAL</span>
            </span>
          </div>

          {/* Back Button (Styled as a pill) */}
          <Link 
            href="/" 
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors bg-slate-100 hover:bg-blue-50 px-4 py-2 rounded-full"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Shop
          </Link>
        </div>
      </div>

      {/* 3. MAIN CONTENT: Centered, constricted for reading, with branded styling */}
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        
        {/* The Card */}
        <div className="bg-white p-8 md:p-14 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          
          {/* Decorative Top Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          {/* PROSE STYLING (The Magic): 
             - prose-slate: Sets base colors to slate.
             - prose-headings: Makes H1/H2/H3 dark and bold.
             - prose-a: Makes links CopIt Blue.
             - prose-strong: Bolds text in Slate-800.
          */}
          <div className="prose prose-slate prose-lg max-w-none 
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 
            prose-p:text-slate-600 prose-p:leading-relaxed 
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline 
            prose-strong:text-slate-900 prose-strong:font-bold
            prose-li:text-slate-600">
            {children}
          </div>

          {/* Trust Badge inside the document */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-3 text-slate-400">
            <ShieldCheck size={18} />
            <span className="text-xs font-medium uppercase tracking-widest">
              Officially Verified Policy • CopIt Pvt Ltd.
            </span>
          </div>

        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="pb-12 text-center space-y-2">
        <p className="text-slate-400 text-xs font-medium">
          © 2026 CopIt Pvt Ltd. All rights reserved.
        </p>
        <div className="flex justify-center gap-4 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
           <span>Secure</span> • <span>Encrypted</span> • <span>Verified</span>
        </div>
      </footer>
    </div>
  )
}