import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart, Share2, MapPin, Bed, Bath, Square, Sparkles, TrendingUp, TrendingDown,
  Phone, MessageCircle, Scale, ChevronLeft, ChevronRight, Check, Loader2, Info
} from "lucide-react";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  if (!property) return <div className="text-center py-20 font-medium">Property not found</div>;

  const images = property.images?.length > 0 ? property.images : [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"
  ];

  const predictedPrice = property.price * (1 - (property.aiPriceDiff || 0) / 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB] dark:bg-background">
      <Navbar />
      
      <main className="flex-1 pb-12">
        {/* Top Header Section */}
        <div className="bg-white dark:bg-card border-b">
          <div className="container py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/search" className="hover:text-primary transition-colors">Search</Link>
              <span>/</span>
              <span className="text-foreground font-medium truncate max-w-[200px]">{property.title}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-full shadow-sm"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
              <Button variant="outline" size="sm" className="rounded-full shadow-sm"><Heart className="h-4 w-4 mr-2" /> Save</Button>
            </div>
          </div>
        </div>

        <div className="container mt-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left: Gallery and Info */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Main Image Gallery */}
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl group bg-black">
                <img 
                  src={images[currentImage]} 
                  alt={property.title} 
                  className="w-full h-full object-cover transition-opacity duration-500" 
                />
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setCurrentImage((p) => (p > 0 ? p - 1 : images.length - 1))} 
                      className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button 
                      onClick={() => setCurrentImage((p) => (p < images.length - 1 ? p + 1 : 0))} 
                      className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Badge Overlay */}
                <div className="absolute top-6 left-6">
                  <Badge className="bg-primary/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Verified Listing
                  </Badge>
                </div>
              </div>

              {/* Title & Location Header */}
              <div className="bg-white dark:bg-card p-8 rounded-3xl shadow-sm border border-border/40">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">{property.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                      {property.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-primary">${property.price.toLocaleString()}</div>
                    <Badge variant="outline" className="mt-2">{property.type === 'sell' ? 'For Sale' : 'For Rent'}</Badge>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/60">
                  <div className="flex flex-col items-center p-4 rounded-2xl bg-[#F0F4FF] dark:bg-muted/30">
                    <Bed className="h-6 w-6 text-primary mb-2" />
                    <span className="text-xl font-bold">{property.bedrooms}</span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bedrooms</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-2xl bg-[#FFF0F5] dark:bg-muted/30">
                    <Bath className="h-6 w-6 text-[#FF4D8D] mb-2" />
                    <span className="text-xl font-bold">{property.bathrooms}</span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bathrooms</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-2xl bg-[#F0FFF4] dark:bg-muted/30">
                    <Square className="h-6 w-6 text-[#22C55E] mb-2" />
                    <span className="text-xl font-bold">{property.area}</span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sqft Area</span>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white dark:bg-card pb-2">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Property Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-white dark:bg-card">
                  <p className="text-muted-foreground leading-relaxed text-lg italic">
                    {property.description || "No description provided for this luxury property."}
                  </p>
                </CardContent>
              </Card>

              {/* Amenities Grid */}
              <Card className="rounded-3xl border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Key Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {(property.amenities || []).map((item: string) => (
                      <div key={item} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/40">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Sidebar Insights */}
            <div className="space-y-6">
              
              {/* AI Market Insights - The Star Feature */}
              <Card className="rounded-3xl border-primary/20 bg-gradient-to-br from-primary/[0.03] to-primary/[0.08] shadow-lg overflow-hidden">
                <CardHeader className="border-b border-primary/10">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Sparkles className="h-5 w-5" />
                    AI Price Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-muted/40 shadow-inner">
                    <span className="text-sm font-medium text-muted-foreground">Market Prediction</span>
                    <span className="text-2xl font-black text-foreground">${predictedPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 p-4 rounded-2xl bg-white/80 dark:bg-muted/40 text-center shadow-inner">
                      <div className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-tighter">Value Grade</div>
                      <Badge variant={property.aiPriceDiff > 0 ? "destructive" : "bestDeal"}>
                        {property.aiPriceDiff > 0 ? "High Price" : "Great Deal"}
                      </Badge>
                    </div>
                    <div className="flex-1 p-4 rounded-2xl bg-white/80 dark:bg-muted/40 text-center shadow-inner">
                      <div className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-tighter">Yield Potential</div>
                      <div className="text-lg font-bold text-success">5.8%</div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-snug p-4 rounded-2xl border border-primary/10 bg-primary/[0.02]">
                    <TrendingUp className="h-4 w-4 inline mr-2 text-primary" />
                    Based on market trends in <span className="font-bold">{property.location}</span>, this property is projected to appreciate by 8% in the next 12 months.
                  </p>
                </CardContent>
              </Card>

              {/* Action Sidebar */}
              <Card className="rounded-3xl border-none shadow-xl sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2 mb-4">
                    <span className="text-sm font-medium text-muted-foreground">Direct Assistance</span>
                    <h3 className="text-lg font-bold">Interested in this home?</h3>
                  </div>
                  
                  <Button className="w-full h-14 text-lg rounded-2xl font-bold shadow-lg shadow-primary/20">
                    <Phone className="h-5 w-5 mr-2" />
                    Contact Listing Agent
                  </Button>
                  
                  <Button variant="outline" className="w-full h-14 text-lg rounded-2xl font-bold">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Instant Chat
                  </Button>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button variant="secondary" className="rounded-xl h-12">
                      <Scale className="h-4 w-4 mr-2" />
                      Compare
                    </Button>
                    <Button variant="secondary" className="rounded-xl h-12">
                      <Share2 className="h-4 w-4 mr-2" />
                      Export
                    </Button>
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