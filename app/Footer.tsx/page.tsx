import React from 'react'
import { Zap, ShieldCheck, Mail } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* 1. BRAND COLUMN */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-white flex items-center gap-2 tracking-tighter">
              <Zap className="text-blue-500 fill-blue-500" /> CopIt
            </h3>
            <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-xs">
              The operating system for modern Instagram sellers. 
              Automate orders, shipping, and payments in one click.
            </p>
            
            {/* CONTACT INFO - Email Only */}
            <div className="pt-2">
                <a 
                  href="mailto:support@copit.in" 
                  className="flex items-center gap-2 text-sm font-bold text-white hover:text-blue-400 transition-colors"
                >
                    <Mail size={16} className="text-slate-400" /> 
                    <span>support@copit.in</span>
                </a>
            </div>
          </div>

          {/* 2. PRODUCT LINKS */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link href="/#features" className="hover:text-blue-400 transition-colors">WhatsApp Bot</Link></li>
              <li><Link href="/#shipping" className="hover:text-blue-400 transition-colors">1-Click Shipping</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* 3. LEGAL LINKS */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Legal</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link href='/legal/terms' className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/refund" className="hover:text-blue-400 transition-colors">Refund Policy</Link></li>
              <li><Link href="/legal/shipping-policy" className="hover:text-blue-400 transition-colors">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* 4. TRUST BADGE */}
          <div className="space-y-4">
             <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                <ShieldCheck className="text-green-500 mb-2" size={24} />
                <h5 className="text-white font-bold text-sm">Secure & Verified</h5>
                <p className="text-[10px] text-slate-500 mt-1">
                  We use Razorpay & Shiprocket APIs. Your data is encrypted and safe.
                </p>
             </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">
          <p>© {new Date().getFullYear()} CopIt Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Made with ⚡ in India</span>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
