import { useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockProperties } from "@/data/mockProperties";
import {
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Phone,
  MessageCircle,
  Scale,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const amenities = [
  "Swimming Pool",
  "Gym",
  "Parking",
  "Security",
  "Garden",
  "Clubhouse",
  "Children's Play Area",
  "Power Backup",
];

const PropertyDetails = () => {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  
  const property = mockProperties.find((p) => p.id === id) || mockProperties[0];

  const images = [
    property.image,
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
  ];

  const predictedPrice = property.price * (1 - property.aiPriceDiff / 100);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="container py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/search" className="hover:text-foreground transition-colors">
              Search
            </Link>
            <span>/</span>
            <span className="text-foreground">{property.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden group">
                <img
                  src={images[currentImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation */}
                <button
                  onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Thumbnails */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`h-2 rounded-full transition-all ${
                        currentImage === idx ? "w-8 bg-primary-foreground" : "w-2 bg-primary-foreground/50"
                      }`}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-card">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-card">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Property Info */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {property.location}
                    </div>
                  </div>
                  <Badge variant={
                    property.aiScore === "bestDeal" ? "bestDeal" :
                    property.aiScore === "overpriced" ? "overpriced" : "fairPrice"
                  } className="gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    {property.aiScore === "bestDeal" ? "Best Deal" :
                     property.aiScore === "overpriced" ? "Overpriced" : "Fair Price"}
                  </Badge>
                </div>

                <div className="flex items-center gap-6 py-4 border-y">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{property.area} sqft</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About this property</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    This stunning property offers modern living at its finest. Located in one of the most 
                    sought-after neighborhoods, it features spacious rooms, natural lighting, and premium 
                    finishes throughout. The open-concept layout is perfect for both entertaining and 
                    everyday living. Enjoy proximity to top-rated schools, parks, and shopping centers.
                  </p>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center">
                          <Check className="h-3 w-3 text-success" />
                        </div>
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold mb-1">
                    ${property.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mb-6">
                    ${(property.price / property.area).toFixed(0)}/sqft
                  </div>

                  <div className="space-y-3 mb-6">
                    <Button className="w-full" size="lg">
                      <Phone className="h-4 w-4" />
                      Contact Owner
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <MessageCircle className="h-4 w-4" />
                      Request Tour
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1">
                      <Heart className="h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      <Scale className="h-4 w-4" />
                      Compare
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card variant="glass" className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-sm text-muted-foreground mb-1">Predicted Market Price</div>
                    <div className="text-xl font-bold">${predictedPrice.toLocaleString()}</div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Price Difference</div>
                      <div className="flex items-center gap-2">
                        {property.aiPriceDiff > 0 ? (
                          <TrendingUp className="h-4 w-4 text-destructive" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-success" />
                        )}
                        <span className={`font-bold ${
                          property.aiPriceDiff > 0 ? "text-destructive" : "text-success"
                        }`}>
                          {property.aiPriceDiff > 0 ? "+" : ""}{property.aiPriceDiff}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">Rental Yield</div>
                      <div className="font-bold text-success">{property.rentalYield}%</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="text-sm font-medium mb-2">AI Recommendation</div>
                    <p className="text-sm text-muted-foreground">
                      {property.aiScore === "bestDeal"
                        ? "This property is priced below market value. Great investment opportunity with strong rental potential."
                        : property.aiScore === "overpriced"
                        ? "This property is priced above market average. Consider negotiating or exploring similar properties nearby."
                        : "This property is fairly priced based on current market conditions and comparable properties."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default PropertyDetails;
