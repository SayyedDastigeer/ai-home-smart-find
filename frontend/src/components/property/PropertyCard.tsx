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

export function PropertyCard({ property, initiallySaved = false }) {
  const displayImage =
    property.images?.[0] ||
    property.image ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop";

  const handleToggleSave = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        `http://localhost:5000/api/properties/save-property/${property._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ❗ IMPORTANT:
      // Do NOTHING here.
      // Parent (SearchResults) already knows saved state.
      // On next fetch or refresh, UI will be correct.

    } catch (err) {
      console.error("Save toggle failed", err);
    }
  };

  return (
    <Card className="group overflow-hidden rounded-xl border-slate-200 bg-white transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={displayImage}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Top */}
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <Badge className="bg-white/90 px-2 py-1 text-xs font-semibold text-slate-900">
            <Sparkles className="mr-1 h-3 w-3 text-amber-500" />
            Featured
          </Badge>

          <button
            onClick={handleToggleSave}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                initiallySaved
                  ? "fill-red-500 text-red-500"
                  : "text-slate-600 hover:text-red-500"
              }`}
            />
          </button>
        </div>

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <div className="rounded-lg bg-slate-900/80 px-3 py-1.5 font-bold text-white">
            ₹{property.price?.toLocaleString()}
            {property.type === "rent" && (
              <span className="ml-1 text-xs text-slate-300">/mo</span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-5">
        <h3 className="text-xl font-bold text-slate-900 line-clamp-1">
          {property.title}
        </h3>

        <div className="mb-4 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-4 w-4 text-primary" />
          {property.location}
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2 border-y py-3">
          <div className="text-center">
            <Bed className="mx-auto h-4 w-4 text-slate-400" />
            <div className="font-semibold">{property.bedrooms}</div>
          </div>
          <div className="text-center">
            <Bath className="mx-auto h-4 w-4 text-slate-400" />
            <div className="font-semibold">{property.bathrooms}</div>
          </div>
          <div className="text-center">
            <Square className="mx-auto h-4 w-4 text-slate-400" />
            <div className="font-semibold">{property.area}</div>
          </div>
        </div>

        <Link to={`/property/${property._id}`}>
          <Button className="w-full bg-slate-900 hover:bg-primary">
            View Details
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
