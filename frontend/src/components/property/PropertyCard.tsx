import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Square,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export function PropertyCard({
  property,
  initiallySaved = false,
  onToggleSave,
}: {
  property: any;
  initiallySaved?: boolean;
  onToggleSave: (id: string, newState: boolean) => void;
}) {
  const [saved, setSaved] = useState(initiallySaved);

  // Sync saved state with prop whenever it changes
  useEffect(() => {
    setSaved(initiallySaved);
  }, [initiallySaved]);

  const displayImage =
    property.images?.[0] ||
    property.image ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop";

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const newState = !saved;
    setSaved(newState); // optimistic update
    onToggleSave(property._id, newState);

    try {
      await axios.post(
        `http://localhost:5000/api/properties/save-property/${property._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Save toggle failed", err);
      // revert if failed
      setSaved(!newState);
      onToggleSave(property._id, !newState);
    }
  };

  return (
    <Card className="group overflow-hidden rounded-xl border-slate-200 bg-white transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={displayImage}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <Badge className="bg-white/90 px-2 py-1 text-xs font-semibold text-slate-900 backdrop-blur-md hover:bg-white">
            <Sparkles className="mr-1 h-3 w-3 text-amber-500" />
            Featured
          </Badge>

          <button
            onClick={handleToggleSave}
            className="group/heart flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all hover:bg-white active:scale-90"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                saved
                  ? "fill-red-500 text-red-500"
                  : "text-slate-600 group-hover/heart:text-red-500"
              }`}
            />
          </button>
        </div>

        <div className="absolute bottom-3 left-3">
          <div className="rounded-lg bg-slate-900/80 px-3 py-1.5 font-bold text-white backdrop-blur-md">
            ₹{property.price?.toLocaleString()}
            {property.type === "rent" && (
              <span className="ml-1 text-xs font-normal text-slate-300">/mo</span>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-5">
        <h3 className="line-clamp-1 text-xl font-bold tracking-tight text-slate-900 mb-2">
          {property.title}
        </h3>
        <div className="mb-4 flex items-center gap-1 text-sm font-medium text-slate-500">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2 border-y border-slate-100 py-3">
          <div className="flex flex-col items-center gap-1 border-r border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
              <Bed className="h-4 w-4 text-slate-400" /> {property.bedrooms}
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              Beds
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 border-r border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
              <Bath className="h-4 w-4 text-slate-400" /> {property.bathrooms}
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              Baths
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
              <Square className="h-4 w-4 text-slate-400" /> {property.area}
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              Sqft
            </span>
          </div>
        </div>

        <Link to={`/property/${property._id}`} className="block">
          <Button className="w-full group/btn bg-slate-900 hover:bg-primary transition-all duration-300">
            View Details
            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
