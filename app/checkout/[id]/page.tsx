"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; 
import axios from "axios";
import { MapPin, Home, Building2, Navigation, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debugUrl, setDebugUrl] = useState("");
  
  const [formData, setFormData] = useState({
    pincode: "", house_no: "", area: "", landmark: "", city: "", state: ""
  });

  const params = useParams(); 
  const sessionId = params?.id as string; 

  useEffect(() => {
    if (!sessionId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    setDebugUrl(apiUrl);

    const fetchSession = async (retries = 3) => {
      try {
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

  // --- ERROR STATE ---
  if (error) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="bg-destructive/10 border border-destructive/20 p-8 rounded-2xl text-center max-w-sm w-full backdrop-blur-sm">
        <div className="bg-destructive/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-destructive mb-2">Session Error</h2>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <p className="text-[10px] text-muted-foreground/50 font-mono bg-black/5 p-2 rounded">API: {debugUrl}</p>
      </div>
    </div>
  );

  // --- LOADING STATE ---
  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
        <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">Retrieving Secure Session...</p>
    </div>
  );

  // --- MAIN FORM ---
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decor - Subtle Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-color-brand-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md mx-auto relative z-10">
        
        {/* Card Container */}
        <div className="bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden">
          
          {/* Header */}
          <div className="bg-secondary/50 p-6 border-b border-border flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-xl">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Shipping Details</h1>
              <p className="text-xs text-muted-foreground">Where should we deliver your order?</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleConfirm} className="space-y-5">
              
              {/* Pincode */}
              <div className="group">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">Pincode</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Navigation className="h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                    value={formData.pincode} 
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})} 
                    placeholder="110001" 
                    maxLength={6} 
                    className="block w-full pl-10 pr-3 py-3 bg-secondbg border border-input rounded-xl text-sm font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all" 
                    required 
                  />
                </div>
              </div>

              {/* House No */}
              <div className="group">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">House No / Floor</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                    value={formData.house_no} 
                    onChange={(e) => setFormData({...formData, house_no: e.target.value})} 
                    placeholder="Flat 4B, Blue Towers" 
                    className="block w-full pl-10 pr-3 py-3 bg-secondbg border border-input rounded-xl text-sm font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all" 
                    required 
                  />
                </div>
              </div>

              {/* Area */}
              <div className="group">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">Area / Colony</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                    value={formData.area} 
                    onChange={(e) => setFormData({...formData, area: e.target.value})} 
                    placeholder="Sector 14, MG Road" 
                    className="block w-full pl-10 pr-3 py-3 bg-secondbg border border-input rounded-xl text-sm font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all" 
                    required 
                  />
                </div>
              </div>

              {/* City & State Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">City</label>
                  <input 
                    value={formData.city} 
                    onChange={(e) => setFormData({...formData, city: e.target.value})} 
                    className="block w-full px-3 py-3 bg-secondbg border border-input rounded-xl text-sm font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all" 
                    required 
                  />
                </div>
                <div className="group">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">State</label>
                  <input 
                    value={formData.state} 
                    onChange={(e) => setFormData({...formData, state: e.target.value})} 
                    className="block w-full px-3 py-3 bg-secondbg border border-input rounded-xl text-sm font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all" 
                    required 
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  className="btn-velocity w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30"
                >
                  Confirm Address 
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <p className="mt-4 text-center text-[10px] text-muted-foreground">
                  Your details are securely encrypted and saved.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}