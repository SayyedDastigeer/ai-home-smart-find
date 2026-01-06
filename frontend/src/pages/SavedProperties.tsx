import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // 🔹 Added for professional entrance
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition"; // 🔹 Added for consistency
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, Loader2, Bookmark } from "lucide-react";
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
        toast.success("Property removed from saved list");
      } catch (err) {
        toast.error("Failed to unsave property");
      }
    }
  };

  const handleClearAll = async () => {
    if (!token || properties.length === 0) return;
    if (!window.confirm("Confirm clearing all saved assets?")) return;

    try {
      await axios.delete(
        "http://localhost:5000/api/properties/clear-saved",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProperties([]);
      toast.success("Watchlist cleared successfully");
    } catch (err) {
      toast.error("Failed to clear watchlist");
    }
  };

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Navbar />
      
      <PageTransition>
        <motion.main 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-1 container mx-auto py-12 px-8"
        >
          {/* Executive Header Row */}
          <div className="flex justify-between items-end mb-16 border-b border-slate-100 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Bookmark className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Personal Repository</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-slate-900">
                Saved Assets
              </h1>
              <p className="text-sm text-slate-400 font-medium mt-1">
                You currently have {properties.length} items in your watch list
              </p>
            </div>

            <Button 
              variant="outline" 
              className="rounded-xl h-10 px-5 border-slate-200 text-xs font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all" 
              onClick={handleClearAll}
              disabled={properties.length === 0}
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Clear Watchlist
            </Button>
          </div>

          {/* Asset Grid */}
          {properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-slate-200" />
              </div>
              <p className="text-slate-400 font-medium tracking-tight">Your repository is currently empty.</p>
              <Button variant="link" className="text-primary font-bold mt-2" onClick={() => window.history.back()}>
                Browse properties
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
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