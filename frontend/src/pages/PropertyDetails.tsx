import { useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart, Share2, MapPin, Bed, Bath, Square, Sparkles, TrendingUp, TrendingDown,
  Phone, MessageCircle, Scale, ChevronLeft, ChevronRight, Check, Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const amenities = [
  "Swimming Pool", "Gym", "Parking", "Security",
  "Garden", "Clubhouse", "Children's Play Area", "Power Backup",
];

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
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (!property) return <div className="text-center py-20">Property not found</div>;

  const images = property.images?.length > 0 ? property.images : [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
  ];

  const predictedPrice = property.price * (1 - (property.aiPriceDiff || 0) / 100);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/search" className="hover:text-foreground">Search</Link>
            <span>/</span>
            <span className="text-foreground">{property.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden group">
                <img src={images[currentImage]} alt={property.title} className="w-full h-full object-cover" />
                <button onClick={() => setCurrentImage((p) => (p > 0 ? p - 1 : images.length - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 flex items-center justify-center"><ChevronLeft /></button>
                <button onClick={() => setCurrentImage((p) => (p < images.length - 1 ? p + 1 : 0))} className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 flex items-center justify-center"><ChevronRight /></button>
              </div>

              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{property.location}</div>
                  </div>
                  <Badge variant="secondary" className="gap-1.5"><Sparkles className="h-3 w-3" />{property.type === 'sell' ? 'For Sale' : 'For Rent'}</Badge>
                </div>

                <div className="flex items-center gap-6 py-4 border-y">
                  <div className="flex items-center gap-2"><Bed className="h-5 w-5" />{property.bedrooms} Bedrooms</div>
                  <div className="flex items-center gap-2"><Bath className="h-5 w-5" />{property.bathrooms} Bathrooms</div>
                  <div className="flex items-center gap-2"><Square className="h-5 w-5" />{property.area} sqft</div>
                </div>
              </div>

              <Card>
                <CardHeader><CardTitle>About this property</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground leading-relaxed">{property.description}</p></CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold mb-1">${property.price.toLocaleString()}</div>
                  <div className="space-y-3 mb-6 mt-6">
                    <Button className="w-full">Contact Owner</Button>
                    <Button variant="outline" className="w-full">Request Tour</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetails;