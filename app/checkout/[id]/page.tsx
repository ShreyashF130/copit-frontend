"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; 
import axios from "axios";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // MATCHING YOUR DATABASE SCHEMA EXACTLY
  const [formData, setFormData] = useState({
    pincode: "",
    house_no: "",
    area: "",
    landmark: "",
    city: "",
    state: ""
  });

  const params = useParams(); 
  // Ensure we get the ID cleanly
  const sessionId = params?.id as string; 

  // 1. Fetch Data with RETRY LOGIC (Crucial Fix 🚀)
  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async (retries = 3) => {
      try {
        // Debug log to check what ID is being sent
        console.log(`🔍 Fetching Session: ${sessionId} (Attempts left: ${retries})`);
        
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session/${sessionId}`);
        
        if (res.data.saved_address) {
          setFormData(prev => ({...prev, ...res.data.saved_address}));
        }
        setLoading(false);
      
      } catch (err: any) {
        console.error("Fetch Error:", err);
        
        // If it's a 404 (Not Found), it might be DB lag. RETRY.
        if (retries > 0) {
          console.log(`⚠️ Database lag detected. Retrying in 1s...`);
          setTimeout(() => fetchSession(retries - 1), 1000); 
        } else {
          // Final Failure: Check exactly what the backend said
          const msg = err.response?.data?.detail || "This link has expired or is invalid.";
          setError(msg === "Link expired" ? "This link has expired." : "Invalid or Used Link.");
          setLoading(false);
        }
      }
    };

    fetchSession();
  }, [sessionId]);

  // 2. Simple Pincode Lookup
  const handlePincode = (code: string) => {
      setFormData(prev => ({...prev, pincode: code}));
      if (code.length === 6) {
          // Placeholder for future logic
      }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/confirm-address`, {
          session_id: sessionId,
          address: formData 
      });
      // Redirect back to WhatsApp
      window.location.href = res.data.redirect_url;
    } catch (err) {
      setError("Failed to save. Please try again.");
      setLoading(false);
    }
  };

  if (error) return <div className="p-10 text-red-500 text-center font-bold text-xl">{error}</div>;
  if (loading) return <div className="p-10 text-center text-gray-500 font-medium animate-pulse">Loading Secure Session...</div>;

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-black mb-6 text-gray-900">Delivery Details</h1>
        
        <form onSubmit={handleConfirm} className="space-y-4">
            
          {/* PINCODE */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
            <input 
              value={formData.pincode}
              onChange={(e) => handlePincode(e.target.value)}
              placeholder="110001"
              maxLength={6}
              className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-black outline-none font-medium"
              required
            />
          </div>

          {/* HOUSE NO */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">House No / Flat</label>
            <input 
              value={formData.house_no}
              onChange={(e) => setFormData({...formData, house_no: e.target.value})}
              placeholder="Flat 4B, Blue Towers"
              className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-black outline-none font-medium"
              required
            />
          </div>

          {/* AREA */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Area / Colony</label>
            <input 
              value={formData.area}
              onChange={(e) => setFormData({...formData, area: e.target.value})}
              placeholder="Sector 14, MG Road"
              className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-black outline-none font-medium"
              required
            />
          </div>

          {/* LANDMARK */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Landmark (Optional)</label>
            <input 
              value={formData.landmark}
              onChange={(e) => setFormData({...formData, landmark: e.target.value})}
              placeholder="Near City Park"
              className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-black outline-none font-medium"
            />
          </div>

          {/* CITY & STATE */}
          <div className="flex gap-3">
             <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                <input 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-black outline-none font-medium"
                  required
                />
             </div>
             <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                <input 
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-black outline-none font-medium"
                  required
                />
             </div>
          </div>

          <button type="submit" className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-bold text-lg shadow-md transition-all">
            Confirm Address
          </button>
        </form>
      </div>
    </div>
  );
}