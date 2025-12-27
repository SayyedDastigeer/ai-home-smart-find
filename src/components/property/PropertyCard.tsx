import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Bed, Bath, Square, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  aiScore: "bestDeal" | "fairPrice" | "overpriced";
  aiPriceDiff: number;
  rentalYield?: number;
}

interface PropertyCardProps {
  property: Property;
}

const aiBadgeConfig = {
  bestDeal: { label: "Best Deal", variant: "bestDeal" as const },
  fairPrice: { label: "Fair Price", variant: "fairPrice" as const },
  overpriced: { label: "Overpriced", variant: "overpriced" as const },
};

export function PropertyCard({ property }: PropertyCardProps) {
  const badgeConfig = aiBadgeConfig[property.aiScore];

  return (
    <Card variant="interactive" className="overflow-hidden group">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* AI Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={badgeConfig.variant} className="gap-1">
            <Sparkles className="h-3 w-3" />
            {badgeConfig.label}
          </Badge>
        </div>

        {/* Save Button */}
        <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-card">
          <Heart className="h-4 w-4" />
        </button>

        {/* Price Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="glass-card px-3 py-2 flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">${property.price.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                {property.aiPriceDiff > 0 ? "+" : ""}{property.aiPriceDiff}% vs market
              </div>
            </div>
            {property.rentalYield && (
              <div className="text-right">
                <div className="text-sm font-semibold text-success">{property.rentalYield}%</div>
                <div className="text-xs text-muted-foreground">Yield</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
        
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
          <MapPin className="h-4 w-4" />
          {property.location}
        </div>

        {/* Features */}
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

        <Link to={`/property/${property.id}`}>
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
