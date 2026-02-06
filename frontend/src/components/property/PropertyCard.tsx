import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  MoreHorizontal, 
  ArrowRight, 
  Sparkles, 
  MapPin 
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * FIXED: Heart color issue resolved by syncing state with props 
 * and using an optimistic UI update pattern.
 */
export function PropertyCard({
  property,
  initiallySaved = false,
  onToggleSave,
}: {
  property: any;
  initiallySaved?: boolean;
  onToggleSave: (id: string, newState: boolean) => void;
}) {
  // Initialize state directly from the prop
  const [saved, setSaved] = useState(initiallySaved);

  // CRITICAL: This effect ensures the heart turns red if the parent 
  // updates the "initiallySaved" status after the initial render.
  useEffect(() => {
    setSaved(initiallySaved);
  }, [initiallySaved]);

  const displayImage = 
    property.images?.[0] || 
    property.image || 
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070";

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents navigating to the details page
    
    const token = localStorage.getItem("token");
    if (!token) return;

    const newState = !saved;
    
    // 1. Optimistic Update (Change color immediately)
    setSaved(newState);
    onToggleSave(property._id, newState);

    try {
      await axios.post(
        `http://localhost:5000/api/properties/save-property/${property._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Save toggle failed", err);
      // 2. Rollback if the server request fails
      setSaved(!newState);
      onToggleSave(property._id, !newState);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }} 
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <Card className="group overflow-hidden rounded-[20px] border-none bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)] dark:bg-slate-900">
        
        {/* --- IMAGE AREA (16:9 Cinematic Ratio) --- */}
        <div className="relative aspect-video overflow-hidden bg-slate-100">
          <img
            src={displayImage}
            className="h-full w-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
            alt={property.title}
          />

          {/* Luxury Overlay Tags */}
          <div className="absolute inset-x-3 top-3 flex items-start justify-between z-10">
            <Badge className="bg-white/20 backdrop-blur-xl border border-white/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              <Sparkles className="h-3 w-3 mr-2 text-[#29A397] fill-[#29A397]" /> 
              Featured
            </Badge>

            <button
              onClick={handleToggleSave}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white transition-all hover:bg-white hover:text-red-500 shadow-lg"
            >
              <Heart 
                className={`h-5 w-5 transition-all ${
                  saved ? "fill-red-500 text-red-500 stroke-red-500" : "stroke-[2px]"
                }`} 
              />
            </button>
          </div>
        </div>

        {/* --- CONTENT SECTION --- */}
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              ₹{property.price?.toLocaleString()}
              {property.type === "rent" && (
                <span className="text-sm font-medium text-slate-400 ml-1">/mo</span>
              )}
            </h3>
            <MoreHorizontal className="h-5 w-5 cursor-pointer text-slate-300 hover:text-[#29A397] transition-colors" />
          </div>

          {/* Professional Property Stats */}
          <div className="flex items-center gap-4 py-3 border-y border-slate-50 dark:border-slate-800">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-900 dark:text-white leading-none">{property.bedrooms}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Beds</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-100 dark:bg-slate-800" />
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-900 dark:text-white leading-none">{property.bathrooms}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Baths</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-100 dark:bg-slate-800" />
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-900 dark:text-white leading-none">{property.area}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Sqft</span>
            </div>
          </div>

          <div className="pt-4 space-y-1">
            <p className="text-base font-bold text-slate-800 dark:text-slate-100 truncate tracking-tight group-hover:text-[#29A397] transition-colors">
              {property.title}
            </p>
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-[#29A397]" />
              <span className="text-xs font-medium truncate">{property.location}</span>
            </div>
          </div>

          <div className="pt-5">
            <Link to={`/property/${property._id}`}>
              <Button
                className="w-full h-12 bg-[#29A397] hover:bg-[#21857b] text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-[0_8px_20px_rgba(41,163,151,0.2)] group/btn transition-all duration-300"
              >
                View Details
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}