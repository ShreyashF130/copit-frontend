import React from 'react'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <>
      {/* HEADER SECTION */}
      <div className="mb-10 border-b border-slate-100 pb-8">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          Effective Date: <span className="text-slate-900">January 24, 2026</span>
        </p>
      </div>

      {/* CONTENT SECTION */}
      <div className="space-y-12 text-slate-600 leading-relaxed">
        
        {/* 1. INTRODUCTION */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Introduction
          </h2>
          <p>
            Welcome to <strong>CopIt</strong> ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform to build a store or make a purchase.
          </p>
        </section>

        {/* 2. DATA COLLECTION */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Information We Collect
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2">🛍️ For Merchants</h3>
              <p className="text-sm">We collect your business name, contact details (email/phone), banking credentials for payouts, and inventory data to facilitate your store's operations.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2">👤 For Customers</h3>
              <p className="text-sm">When you buy from a CopIt store, we collect your Name, Delivery Address, Phone Number, and Order Details to process the shipment.</p>
            </div>
          </div>
        </section>

        {/* 3. USAGE */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
            How We Use Your Data
          </h2>
          <ul className="space-y-3 list-disc pl-5 text-sm marker:text-blue-500">
            <li><strong>Order Fulfillment:</strong> To process payments and deliver products via shipping partners.</li>
            <li><strong>Communication:</strong> To send automated WhatsApp notifications (Order Confirmed, Shipped, Out for Delivery).</li>
            <li><strong>Platform Security:</strong> To detect fraud, abuse, and verify merchant identity.</li>
            <li><strong>Improvements:</strong> To analyze usage trends and improve platform performance.</li>
          </ul>
        </section>

        {/* 4. DATA SHARING (CRITICAL LEGAL BOX) */}
        <section className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
            ⚠️ 4. Data Sharing with Merchants
          </h2>
          <p className="text-amber-800 text-sm mb-4">
            <strong>Customer Notice:</strong> CopIt is a platform provider. When you place an order, you are purchasing directly from a Merchant (Seller).
          </p>
          <p className="text-amber-800 text-sm">
            By using our service, you explicitly consent to us sharing your <strong>Name, Phone Number, and Shipping Address</strong> with the specific Merchant you purchased from. The Merchant requires this data to pack and ship your order. CopIt is not responsible for the privacy practices of individual Merchants outside our platform.
          </p>
        </section>

        {/* 5. THIRD PARTIES */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
            Third-Party Services
          </h2>
          <p className="mb-4">We share only necessary data with the following partners to execute our services:</p>
          <div className="overflow-hidden border border-slate-200 rounded-xl">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-sm">
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900">Razorpay</td>
                  <td className="px-6 py-4 text-slate-500">Secure Payment Processing</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900">Shiprocket</td>
                  <td className="px-6 py-4 text-slate-500">Shipping Label Generation & Tracking</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900">WhatsApp (Meta)</td>
                  <td className="px-6 py-4 text-slate-500">Automated Order Notifications</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. CONTACT */}
        <section className="border-t border-slate-100 pt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">7. Contact Us</h2>
          <p className="mb-4">
            If you have questions regarding this privacy policy or the protection of your personal data, please contact our Data Protection Officer:
          </p>
          <div className="inline-block bg-slate-900 text-white px-6 py-3 rounded-xl font-medium">
            📧 support@copit.in
          </div>
        </section>

      </div>
    </>
  )
}