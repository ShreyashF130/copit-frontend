import React from 'react'
import { Truck, Clock, MapPin, PackageX, Globe, HelpCircle } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="space-y-10">
      
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-8">
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Shipping Policy</h1>
        <p className="text-slate-500 font-medium">Last updated: January 24, 2026</p>
      </div>

      {/* 1. PROCESSING TIME */}
      <section className="flex gap-4 items-start">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-1">
          <Clock size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-3 mt-0">1. Processing Time</h3>
          <p className="text-slate-600 leading-relaxed mb-0">
            All orders are processed within <strong>1-2 business days</strong> (excluding weekends and holidays). 
            You will receive a notification via WhatsApp when your order has been dispatched.
          </p>
          <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
            <p className="text-sm text-amber-900 font-bold m-0">
              ⚡ High Volume Note: During festivals or sale events, processing may take an extra 24-48 hours.
            </p>
          </div>
        </div>
      </section>

      {/* 2. RATES & ESTIMATES */}
      <section className="flex gap-4 items-start">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-1">
          <Truck size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-3 mt-0">2. Shipping Rates & Delivery Estimates</h3>
          <p className="text-slate-600 leading-relaxed">
            Shipping charges for your order will be calculated and displayed at checkout.
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-600 marker:text-blue-500">
            <li><strong>Standard Shipping:</strong> 3-7 business days (Free for prepaid orders).</li>
            <li><strong>Express Shipping:</strong> 2-4 business days (Available in select metros).</li>
            <li><strong>Cash on Delivery:</strong> Fees may apply based on order value.</li>
          </ul>
        </div>
      </section>

      {/* 3. TRACKING */}
      <section className="flex gap-4 items-start">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-1">
          <MapPin size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-3 mt-0">3. Order Tracking</h3>
          <p className="text-slate-600 leading-relaxed">
            Once your order ships, you will receive a <strong>WhatsApp message</strong> and Email containing your tracking number. 
            The tracking link typically becomes active within 24 hours of dispatch.
          </p>
        </div>
      </section>

      {/* 4. INTERNATIONAL & RESTRICTIONS */}
      <section className="flex gap-4 items-start">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-1">
          <Globe size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-3 mt-0">4. International Shipping</h3>
          <p className="text-slate-600 leading-relaxed">
            We currently do not ship outside of India. We ship to all valid pincodes across India served by our logistics partners (Delhivery, Xpressbees, Shadowfax).
          </p>
        </div>
      </section>

      {/* 5. DAMAGES & ISSUES */}
      <section className="flex gap-4 items-start">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-1">
          <PackageX size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-3 mt-0">5. Damages & Lost Packages</h3>
          <p className="text-slate-600 leading-relaxed">
            CopIt is not liable for products damaged or lost during shipping. However, if your order arrives damaged, please:
          </p>
          <ol className="list-decimal pl-5 mt-3 space-y-2 text-slate-600 marker:font-bold marker:text-slate-400">
            <li>Save all packaging materials and damaged goods.</li>
            <li>Take clear photos of the damage.</li>
            <li>Contact us immediately so we can file a claim with the carrier on your behalf.</li>
          </ol>
        </div>
      </section>

      {/* CONTACT FOOTER */}
      <div className="bg-slate-900 text-slate-300 p-8 rounded-2xl mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-full">
                <HelpCircle className="text-white" size={24} />
            </div>
            <div>
                <h4 className="text-white font-bold text-lg m-0">Questions about your order?</h4>
                <p className="text-slate-400 text-sm m-0">Our support team is just a click away.</p>
            </div>
        </div>
        <a href="mailto:support@copit.in" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors no-underline">
            Contact Support
        </a>
      </div>

    </div>
  )
}