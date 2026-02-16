"use client";
import { useEffect, useState } from "react";
// 👇 IMPORT useParams
import { useRouter, useParams } from "next/navigation"; 
import axios from "axios";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({ street: "", city: "", pincode: "" });
  const [error, setError] = useState("");
  
  // 👇 USE THE HOOK
  const params = useParams(); 
  // params.id will match your folder name [id]
  const sessionId = params?.id as string; 

  // 1. Fetch Data on Load
  useEffect(() => {
    // Safety Check: Don't fetch if ID is missing
    if (!sessionId) return;

    // 👇 USE REAL RAILWAY URL (process.env.NEXT_PUBLIC_API_URL)
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session/${sessionId}`)
      .then((res) => {
        if (res.data.saved_address) {
          setAddress(res.data.saved_address);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setError("This link has expired or is invalid.");
        setLoading(false);
      });
  }, [sessionId]);

  // 2. Validate Pincode Stub
  const checkServiceability = async (pincode: string) => {
     console.log("Checking pincode:", pincode);
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 3. Save & Redirect
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/confirm-address`, {
          session_id: sessionId, // Use the variable
          address: address
      });
      
      // 4. BOUNCE BACK TO WHATSAPP
      window.location.href = res.data.redirect_url;
    } catch (err) {
      console.error("Save Error:", err);
      setError("Failed to save address. Try again.");
      setLoading(false);
    }
  };

  if (error) return <div className="p-10 text-red-500 text-center font-bold">{error}</div>;
  if (loading) return <div className="p-10 text-center">Loading Secure Session...</div>;

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-black mb-6 text-gray-900">Confirm Delivery</h1>
        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-500">Pincode</label>
            <input 
              placeholder="110001" 
              value={address.pincode}
              onChange={(e) => {
                  setAddress({...address, pincode: e.target.value});
                  if(e.target.value.length === 6) checkServiceability(e.target.value);
              }}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-black outline-none font-medium"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-500">Full Address</label>
            <textarea 
              placeholder="House No, Street, Area..." 
              value={address.street || ""} // Handle undefined case
              onChange={(e) => setAddress({...address, street: e.target.value})}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-black outline-none font-medium h-24"
            />
          </div>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-bold text-lg transition-all">
            Confirm & Pay on WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}