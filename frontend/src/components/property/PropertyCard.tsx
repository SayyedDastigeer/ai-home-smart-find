import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Bed, Bath, Square, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export function PropertyCard({ property, initiallySaved = false }) {
  const [saved, setSaved] = useState(initiallySaved);

  const displayImage =
    property.images?.[0] ||
    property.image ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop";

  const handleToggleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:5000/api/properties/save-property/${property._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSaved(res.data.saved);
    } catch (err) {
      console.error("Save toggle failed", err);
    }
  };

  return (
    <Card variant="interactive" className="overflow-hidden group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={displayImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            New Listing
          </Badge>
        </div>

        <button
          onClick={handleToggleSave}
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
        >
          <Heart
            className={`h-4 w-4 ${
              saved ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="glass-card px-3 py-2">
            <div className="text-lg font-bold">
              ₹{property.price?.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
          <MapPin className="h-4 w-4" />
          {property.location}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Bed className="h-4 w-4" />
            {property.bedrooms} Beds
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-4 w-4" />
            {property.bathrooms} Baths
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="h-4 w-4" />
            {property.area} sqft
          </div>
        </div>

        <Link to={`/property/${property._id}`}>
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
