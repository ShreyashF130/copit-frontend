// "use client";
// import { useEffect } from "react";
// import { useSearchParams } from "next/navigation";

// export default function PayBridge() {
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     // 1. Get parameters from the URL
//     const pa = searchParams.get("pa"); // Seller UPI ID
//     const pn = searchParams.get("pn"); // Seller Name
//     const am = searchParams.get("am"); // Amount
//     const tn = searchParams.get("tn"); // Transaction Note

//     if (pa && am) {
//       // 2. Construct the Deep Link
//       const upiUrl = `upi://pay?pa=${pa}&pn=${pn || "Seller"}&am=${am}&cu=INR&tn=${tn || "Order"}`;

//       // 3. Trigger the redirect
//       window.location.href = upiUrl;

//       // 4. Fallback: If redirect fails, show a button
//       setTimeout(() => {
//         const retry = confirm("Open UPI App to pay?");
//         if (retry) window.location.href = upiUrl;
//       }, 2000);
//     }
//   }, [searchParams]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
//       <h1 className="text-2xl font-bold mb-4">Redirecting to Payment...</h1>
//       <p className="text-gray-600 mb-8">Please wait while we open your UPI app (GPay, PhonePe, Paytm).</p>
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//     </div>
//   );
// }



"use client";
import { useEffect, Suspense } from "react"; // <--- Import Suspense
import { useSearchParams } from "next/navigation";

// 1. THE LOGIC COMPONENT
function PayBridgeContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get parameters
    const pa = searchParams.get("pa");
    const pn = searchParams.get("pn");
    const am = searchParams.get("am");
    const tn = searchParams.get("tn");

    if (pa && am) {
      // Construct Deep Link
      const upiUrl = `upi://pay?pa=${pa}&pn=${pn || "Seller"}&am=${am}&cu=INR&tn=${tn || "Order"}`;

      // Trigger redirect
      window.location.href = upiUrl;

      // Fallback logic (Optional: Only if needed)
      // We rely on the button below for manual retry instead of an annoying confirm() popup
    }
  }, [searchParams]);

  // Helper to get URL again for the button
  const pa = searchParams.get("pa");
  const pn = searchParams.get("pn");
  const am = searchParams.get("am");
  const tn = searchParams.get("tn");
  const upiUrl = pa && am ? `upi://pay?pa=${pa}&pn=${pn || "Seller"}&am=${am}&cu=INR&tn=${tn || "Order"}` : '#';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Redirecting to Payment...</h1>
      <p className="text-gray-600 mb-8">Please wait while we open your UPI app.</p>
      
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-8"></div>

      {/* Manual Retry Button (Better UX than confirm popup) */}
      <a 
        href={upiUrl}
        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
      >
        Click here if not redirected
      </a>
    </div>
  );
}

// 2. THE WRAPPER (Export Default)
export default function PayBridge() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
      </div>
    }>
      <PayBridgeContent />
    </Suspense>
  );
}