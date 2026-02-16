"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({ street: "", city: "", pincode: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  // 1. Fetch Data on Load
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session/${params.id}`)
      .then((res) => {
        if (res.data.saved_address) {
          setAddress(res.data.saved_address);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("This link has expired. Please ask the bot for a new one.");
        setLoading(false);
      });
  }, [params.id]);

  // 2. Validate Pincode (Shiprocket Stub)
  const checkServiceability = async (pincode: string) => {
     // Add your Shiprocket logic here
     console.log("Checking pincode:", pincode);
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 3. Save & Redirect
    const res = await axios.post("https://api.copit.in/confirm-address", {
        session_id: params.id,
        address: address
    });
    
    // 4. BOUNCE BACK TO WHATSAPP
    window.location.href = res.data.redirect_url;
  };

  if (error) return <div className="p-10 text-red-500 text-center">{error}</div>;
  if (loading) return <div className="p-10 text-center">Loading Secure Session...</div>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Confirm Delivery</h1>
      <form onSubmit={handleConfirm} className="space-y-4">
        <input 
          placeholder="Pincode" 
          value={address.pincode}
          onChange={(e) => {
              setAddress({...address, pincode: e.target.value});
              if(e.target.value.length === 6) checkServiceability(e.target.value);
          }}
          className="w-full p-3 border rounded"
        />
        <input 
          placeholder="Address / Street" 
          value={address.street}
          onChange={(e) => setAddress({...address, street: e.target.value})}
          className="w-full p-3 border rounded"
        />
        <button type="submit" className="w-full bg-green-600 text-white p-4 rounded font-bold">
          Confirm & Pay on WhatsApp
        </button>
      </form>
    </div>
  );
}