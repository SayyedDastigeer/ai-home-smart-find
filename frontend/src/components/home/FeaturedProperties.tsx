import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; 
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, LayoutGrid } from "lucide-react";
import { toast } from "sonner";

interface FeaturedProps {
  title: string;
  subtitle: string;
  type: "sell" | "rent";
}

export const FeaturedProperties = ({ title, subtitle, type }: FeaturedProps) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        // We add limit=4 to ensure we only get a small set for the homepage
        const res = await axios.get(`http://localhost:5000/api/properties?type=${type}&limit=4`);
        
        // 🔹 FIX: Access .properties because your backend is now paginated
        const propertyData = res.data.properties || (Array.isArray(res.data) ? res.data : []);
        setProperties(propertyData.slice(0, 4));
      } catch (err) {
        console.error("Fetch error", err);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [type]);

  const handleToggleSave = async (propertyId: string, newState: boolean) => {
    if (!token) {
      toast.error("Authentication required");
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/properties/save-property/${propertyId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(newState ? "Asset Bookmarked" : "Removed from Watchlist");
    } catch (err) {
      toast.error("Sync Error");
    }
  };

  return (
    <section className="py-24 bg-[#FDFDFD]">
      <div className="container px-8 mx-auto">
        {/* 🔹 Refined Architectural Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-[#29A397]" />
              <span className="text-[10px] font-black text-[#29A397] uppercase tracking-[0.4em] flex items-center gap-2">
                <LayoutGrid className="h-3 w-3" /> {type === "sell" ? "Prime Investment" : "Luxury Renting"}
              </span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-6 uppercase">
              {title.split(' ')[0]} <span className="text-slate-200">{title.split(' ').slice(1).join(' ')}</span>
            </h2>
            
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
              {subtitle}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="group border-slate-200 hover:border-[#29A397] text-slate-900 hover:text-[#29A397] transition-all rounded-full px-12 h-16 font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200/50 bg-white"
            onClick={() => navigate(`/search?type=${type}`)}
          >
            Explore Portfolio
            <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* 🔹 Staggered Card Grid */}
        {loading ? (
          <div className="flex justify-center py-40">
            <Loader2 className="h-10 w-10 animate-spin text-[#29A397]" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {properties.map((p, index) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <PropertyCard 
                  property={p} 
                  initiallySaved={false} 
                  onToggleSave={handleToggleSave}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100">
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Featured Assets Available</p>
          </div>
        )}
      </div>
    </section>
  );
};