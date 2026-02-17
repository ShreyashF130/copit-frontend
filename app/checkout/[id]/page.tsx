"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; 
import axios from "axios";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debugUrl, setDebugUrl] = useState(""); // For debugging display
  
  const [formData, setFormData] = useState({
    pincode: "", house_no: "", area: "", landmark: "", city: "", state: ""
  });

  const params = useParams(); 
  const sessionId = params?.id as string; 

  useEffect(() => {
    if (!sessionId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    setDebugUrl(apiUrl); // Show what URL we are using

    const fetchSession = async (retries = 3) => {
      try {
        console.log(`🚀 Requesting: ${apiUrl}/session/${sessionId}`);
        const res = await axios.get(`${apiUrl}/session/${sessionId}`);
        
        if (res.data.saved_address) {
          setFormData(prev => ({...prev, ...res.data.saved_address}));
        }
        setLoading(false);
      } catch (err: any) {
        console.error("API Error:", err);
        if (retries > 0) {
          setTimeout(() => fetchSession(retries - 1), 1000);
        } else {
          // If network error, tell the user
          if (err.message === "Network Error") {
            setError(`Cannot connect to Backend at ${apiUrl}. Check CORS/Server.`);
          } else {
            setError(err.response?.data?.detail || "Link Invalid or Expired");
          }
          setLoading(false);
        }
      }
    };

    fetchSession();
  }, [sessionId]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      const res = await axios.post(`${apiUrl}/confirm-address`, {
          session_id: sessionId,
          address: formData 
      });
      window.location.href = res.data.redirect_url;
    } catch (err) {
      setError("Failed to save. Please try again.");
      setLoading(false);
    }
  };

  if (error) return (
    <div className="p-10 text-center">
      <div className="text-red-500 font-bold text-xl mb-2">{error}</div>
      <div className="text-xs text-gray-400">Target API: {debugUrl}</div>
    </div>
  );
  
  if (loading) return <div className="p-10 text-center animate-pulse">Loading...</div>;

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-black mb-6 text-gray-900">Delivery Details</h1>
        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
            <input value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} placeholder="110001" maxLength={6} className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-black outline-none font-medium" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">House No</label>
            <input value={formData.house_no} onChange={(e) => setFormData({...formData, house_no: e.target.value})} placeholder="Flat 4B" className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-black outline-none font-medium" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Area</label>
            <input value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} placeholder="Sector 14" className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-black outline-none font-medium" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">City</label>
            <input value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-black outline-none font-medium" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">State</label>
            <input value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-black outline-none font-medium" required />
          </div>
          <button type="submit" className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-bold text-lg shadow-md transition-all">Confirm Address</button>
        </form>
      </div>
    </div>
  );
}