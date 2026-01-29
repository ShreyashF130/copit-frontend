import { AlertTriangle, CheckCircle2, FileText, ShieldAlert } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="space-y-10 text-slate-600">
      
      {/* 1. HEADER SECTION */}
      <div className="border-b border-slate-100 pb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
          Terms of Service
        </h1>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
          <FileText size={16} />
          <span>Last Updated: January 24, 2026</span>
        </div>
      </div>

      {/* 2. INTRO */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          1. Acceptance of Terms
        </h2>
        <p className="leading-relaxed">
          By creating an account on <strong className="text-slate-900">CopIt</strong>, you agree to these Terms. 
          These terms constitute a legally binding agreement between you ("Merchant") and CopIt Pvt Ltd. 
          If you do not agree, you must discontinue use immediately.
        </p>
      </section>

      {/* 3. MERCHANT RESPONSIBILITY */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">2. Your Role as a Merchant</h2>
        <p className="leading-relaxed">
          CopIt is strictly a <strong>technology enabler</strong>. We do not manufacture, stock, or ship goods. 
          By using our platform, you acknowledge that you are solely responsible for:
        </p>
        <ul className="grid gap-3 pt-2">
          {[
            "The quality, safety, and authenticity of the items listed.",
            "Fulfilling orders promptly and handling customer disputes.",
            "Compliance with GST, local tax laws, and shipping regulations."
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={18} />
              <span className="text-sm font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. PROHIBITED ITEMS (The "Warning Box") */}
      <section className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
        <h3 className="text-red-700 font-bold flex items-center gap-2 mb-3">
          <ShieldAlert size={20} />
          3. Prohibited Activities (Zero Tolerance)
        </h3>
        <p className="text-red-900/80 text-sm mb-4 font-medium">
          The following items are strictly banned. Violation will result in an 
          <span className="underline decoration-red-400 underline-offset-2 ml-1">immediate permanent ban</span> without refund.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-red-800 text-sm font-medium marker:text-red-400">
          <li>Illegal drugs, narcotics, or controlled substances.</li>
          <li>Weapons, explosives, ammunition, or fireworks.</li>
          <li>Counterfeit goods (e.g., "First Copy", "Replica" luxury items).</li>
          <li>Adult content, gambling services, or fraudulent schemes.</li>
        </ul>
      </section>

      {/* 5. DATA & LIABILITY */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">4. Data Protection & Liability</h2>
        <div className="prose prose-slate prose-sm max-w-none text-slate-600">
          <p>
            <strong>Customer Data:</strong> You agree to use customer data (phone numbers, addresses) 
            received via CopIt strictly for order fulfillment. You may NOT use this data for harassment, 
            spamming, or selling to third parties.
          </p>
          <p>
            <strong>Limitation of Liability:</strong> To the maximum extent permitted by law, CopIt shall not be liable 
            for indirect, incidental, or consequential damages. We are not liable for losses due to 
            WhatsApp API downtimes, third-party courier delays, or payment gateway failures.
          </p>
        </div>
      </section>

     

    </div>
  )
}