import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion"; 
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition"; 
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, Loader2, Bookmark, LayoutGrid } from "lucide-react";
import { toast } from "sonner";

const SavedProperties = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchSavedProperties = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/properties/saved-properties",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Backend returns the array directly for this endpoint
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to load saved properties", err);
      toast.error("Could not sync your vault");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (propertyId: string, newState: boolean) => {
    if (!token) return;
    // When newState is false, user is removing it from this page
    if (!newState) {
      try {
        await axios.post(
          `http://localhost:5000/api/properties/save-property/${propertyId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProperties((prev) => prev.filter((p) => p._id !== propertyId));
        toast.success("Asset removed from Vault");
      } catch (err) {
        toast.error("Update failed");
      }
    }
  };

  const handleClearAll = async () => {
    if (!token || properties.length === 0) return;
    if (!window.confirm("Permanently empty your saved vault?")) return;

    try {
      await axios.delete(
        "http://localhost:5000/api/properties/clear-saved",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProperties([]);
      toast.success("Vault cleared successfully");
    } catch (err) {
      toast.error("Failed to clear assets");
    }
  };

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin h-8 w-8 text-[#29A397]" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Navbar />
      
      <PageTransition>
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 container mx-auto py-20 px-8"
        >
          {/* 🔹 Executive Header Block */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-b border-slate-100 pb-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-10 bg-[#29A397]" />
                <span className="text-[10px] font-black text-[#29A397] uppercase tracking-[0.4em] flex items-center gap-2">
                  <LayoutGrid className="h-3 w-3" /> Private Vault
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-none uppercase">
                Saved <span className="text-slate-200">Assets</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-6 bg-slate-50 inline-block px-4 py-1.5 rounded-full">
                Monitoring {properties.length} active listings
              </p>
            </div>

            <Button 
              variant="outline" 
              className="rounded-full h-14 px-10 border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-xl shadow-slate-200/40 bg-white" 
              onClick={handleClearAll}
              disabled={properties.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Empty Vault
            </Button>
          </div>

          {/* 🔹 Consistent Grid Layout (Matching Search/Home) */}
          {properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 bg-white border border-slate-50 rounded-[3rem] shadow-sm">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Bookmark className="h-8 w-8 text-slate-200" />
              </div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Vault is currently empty</p>
              <Button 
                variant="link" 
                className="text-[#29A397] font-black uppercase text-[10px] tracking-widest mt-4" 
                onClick={() => window.history.back()}
              >
                Browse Market Collection
              </Button>
            </div>
          ) : (
            /* Using lg:grid-cols-4 to keep card size uniform with Featured section */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {properties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                  <PropertyCard
                    property={property}
                    initiallySaved={true}
                    onToggleSave={handleToggleSave}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.main>
      </PageTransition>

      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default SavedProperties;