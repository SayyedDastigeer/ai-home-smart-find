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
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to load saved properties", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (propertyId: string, newState: boolean) => {
    if (!token) return;
    if (!newState) {
      try {
        await axios.post(
          `http://localhost:5000/api/properties/save-property/${propertyId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProperties((prev) => prev.filter((p) => p._id !== propertyId));
        toast.success("Asset removed");
      } catch (err) {
        toast.error("Error updating watchlist");
      }
    }
  };

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin h-6 w-6 text-[#29A397]" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Navbar />
      
      <PageTransition>
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 container mx-auto py-16 px-4 md:px-8"
        >
          {/* Header row to match Search section layout */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <LayoutGrid className="h-3 w-3 text-[#29A397]" />
                <span className="text-[10px] font-black text-[#29A397] uppercase tracking-[0.4em]">Vault</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                Saved <span className="text-slate-200">Assets</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-4">
                Institutional Watchlist • {properties.length} Active Units
              </p>
            </div>

            <Button 
              variant="outline" 
              className="rounded-full h-12 px-8 border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all shadow-sm" 
              onClick={() => {
                if(window.confirm("Clear entire watchlist?")) {
                   // handleClearAll logic here
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Empty Vault
            </Button>
          </div>

          {/* 🔹 THE FIX: 5 Column Grid for small cards like Search page */}
          {properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 bg-white border border-slate-50 rounded-[2rem]">
              <Bookmark className="h-10 w-10 text-slate-100 mb-4" />
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">No Assets Found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {properties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
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