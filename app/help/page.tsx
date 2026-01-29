import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Zap, LifeBuoy } from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* HEADER */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <span className="font-black text-lg tracking-tight">CopIt HELP CENTER</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2">
             <LifeBuoy size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">How can we help you?</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            We are currently in <strong>Beta</strong>. Our team is small but dedicated. 
            Send us an email and we will reply within 24 hours.
          </p>
        </div>

        {/* PRIMARY SUPPORT CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 md:p-10 text-center space-y-6 max-w-lg mx-auto">
             <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                   <Mail size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-2xl">Email Support</h3>
                  <p className="text-slate-500 text-sm mt-2">
                    For account setup, payments, and technical bugs.
                  </p>
                </div>
             </div>

             <a href="mailto:support@copit.in" className="block w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity text-lg">
                Email support@copit.in
             </a>
             
             <p className="text-xs text-slate-400 font-medium">
               Typical response time: <span className="text-green-500">Under 4 hours</span>
             </p>
        </div>

        {/* FAQ SECTION */}
        <div className="space-y-6 pt-10 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold pb-4">
            Common Questions
          </h2>
          
          <div className="grid gap-4">
            <FAQItem 
              q="How do I connect my Razorpay account?"
              a="Go to Settings > Payments. Enter your Key ID and Key Secret from the Razorpay Dashboard. Webhooks are handled automatically."
            />
            <FAQItem 
              q="Why is my WhatsApp bot not replying?"
              a="Your Meta Token might have expired (24h limit). We recommend generating a Permanent Token in the Meta Developer Portal."
            />
            <FAQItem 
              q="Can I use my own domain?"
              a="Yes! Pro plan users can connect custom domains like shop.yourbrand.com. Contact support to enable this."
            />
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="text-center py-8 border-t border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-medium">
        © {new Date().getFullYear()} CopIt Pvt Ltd. All rights reserved.
      </footer>
    </div>
  )
}

// Simple FAQ Component
function FAQItem({ q, a }: { q: string, a: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-200 transition-colors">
      <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
        <Zap size={16} className="text-blue-500" /> {q}
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {a}
      </p>
    </div>
  )
}