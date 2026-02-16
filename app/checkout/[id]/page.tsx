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
  const sessionId = params?.id as string; 

  // 1. Fetch Data
  useEffect(() => {
    if (!sessionId) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session/${sessionId}`)
      .then((res) => {
        if (res.data.saved_address) {
          // Auto-fill if we have data
          setFormData(prev => ({...prev, ...res.data.saved_address}));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("This link has expired or is invalid.");
        setLoading(false);
      });
  }, [sessionId]);

  // 2. Simple Pincode Lookup (Optional: Replace with real API)
  const handlePincode = (code: string) => {
      setFormData(prev => ({...prev, pincode: code}));
      if (code.length === 6) {
          // Simulate lookup or call Shiprocket API here
          // setFormData(prev => ({...prev, city: "Mumbai", state: "Maharashtra"})); 
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

  if (error) return <div className="p-10 text-red-500 text-center font-bold">{error}</div>;
  if (loading) return <div className="p-10 text-center">Loading Secure Session...</div>;

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