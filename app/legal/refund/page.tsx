import React from 'react'
import { ShieldAlert, RefreshCw, Clock, CreditCard, Mail } from 'lucide-react'

export default function RefundPage() {
  return (
    <div className="space-y-10">
      
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-8">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
          Refund & Cancellation Policy
        </h1>
        <p className="text-slate-500 font-medium">
          Last updated: <span className="text-slate-900 font-bold">January 24, 2026</span>
        </p>
      </div>

      {/* POLICY CONTENT */}
      <div className="space-y-12">
        
        {/* SECTION 1: RETURNS */}
        <section className="flex gap-4 md:gap-6">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <ShieldAlert size={20} />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900">1. Returns & Defects</h3>
            <p className="text-slate-600 leading-relaxed">
              We maintain a strict quality control process. We accept returns <span className="font-bold text-red-600">only</span> if the item is defective, damaged during transit, or if you received the wrong product.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700">
              <strong>⚠️ Requirement:</strong> You must send an unboxing video/photo proof to support within 24 hours of delivery.
            </div>
          </div>
        </section>

        {/* SECTION 2: REFUNDS */}
        <section className="flex gap-4 md:gap-6">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900">2. Refund Process</h3>
            <p className="text-slate-600 leading-relaxed">
              Once your return is inspected and approved, we will notify you via Email or WhatsApp.
              If approved, the refund will be automatically processed to your original payment method (UPI/Card).
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Prepaid Orders:</strong> Refunded to source within 5-7 days.</li>
              <li><strong>COD Orders:</strong> Refunded via Bank Transfer/UPI link.</li>
            </ul>
          </div>
        </section>

        {/* SECTION 3: CANCELLATIONS */}
        <section className="flex gap-4 md:gap-6">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900">3. Cancellation Window</h3>
            <p className="text-slate-600 leading-relaxed">
              We process orders quickly. You can cancel your order within <span className="font-bold text-slate-900">2 hours</span> of placing it.
            </p>
            <p className="text-slate-600">
              After 2 hours, the order is handed over to our shipping partner and cannot be cancelled. If you refuse delivery, a shipping fee may be deducted.
            </p>
          </div>
        </section>

      </div>

      {/* FOOTER CONTACT */}
      <div className="bg-slate-900 rounded-2xl p-8 text-center text-white mt-12">
        <h4 className="text-lg font-bold mb-2">Still need help?</h4>
        <p className="text-slate-400 text-sm mb-6">Contact our support team for any disputes.</p>
        <a href="mailto:support@copit.in" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all">
          <Mail size={18} /> Email Support
        </a>
      </div>

    </div>
  )
}