import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight,
  Heart, Phone, MessageCircle, Sparkles, Loader2,
} from "lucide-react";
import { toast } from "sonner"; // Ensure you have a toast library installed

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [img, setImg] = useState(0);

  const token = localStorage.getItem("token");

  const fetchProperty = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/properties/${id}`);
      setProperty(res.data);
    } catch (err) {
      toast.error("Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handleAction = async (actionType: "buy" | "rent") => {
    if (!token) {
      toast.error("Please login to continue");
      return navigate("/login");
    }

    try {
      setProcessing(true);
      const endpoint = `http://localhost:5000/api/properties/${actionType}/${id}`;
      await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Property ${actionType === "buy" ? "Purchased" : "Rented"} Successfully!`);
      fetchProperty(); // Refresh UI
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Transaction failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const images = property.images?.length ? property.images : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"];

  return (
    <div className="bg-muted/30 min-h-screen">
      <Navbar />
      <main className="container py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* IMAGE GALLERY */}
          <div className="relative rounded-xl overflow-hidden bg-black">
            <img src={images[img]} className="w-full h-[420px] object-cover" alt="Property" />
            {images.length > 1 && (
              <>
                <button onClick={() => setImg(i => (i > 0 ? i - 1 : images.length - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"><ChevronLeft /></button>
                <button onClick={() => setImg(i => (i < images.length - 1 ? i + 1 : 0))} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"><ChevronRight /></button>
              </>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-muted-foreground"><MapPin className="h-4 w-4 mr-1" />{property.location}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 border rounded-lg p-4 bg-background">
            <Feature icon={Bed} label="Bedrooms" value={property.bedrooms} />
            <Feature icon={Bath} label="Bathrooms" value={property.bathrooms} />
            <Feature icon={Square} label="Area" value={`${property.area} sqft`} />
          </div>

          <Card><CardContent className="p-6"><h2 className="font-semibold mb-2">About</h2><p className="text-sm text-muted-foreground">{property.description || "No description."}</p></CardContent></Card>
        </div>

        {/* ACTION BOX */}
        <div className="sticky top-24 h-fit space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold text-primary">₹{property.price.toLocaleString()}</div>
                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${property.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {property.status}
                </span>
              </div>

              {property.status === "available" ? (
                <Button 
                  className="w-full h-12 text-lg" 
                  disabled={processing}
                  onClick={() => handleAction(property.type === "sell" ? "buy" : "rent")}
                >
                  {processing ? <Loader2 className="animate-spin" /> : (property.type === "sell" ? "Buy Property" : "Rent Property")}
                </Button>
              ) : (
                <Button className="w-full h-12" disabled variant="secondary">Already {property.status}</Button>
              )}

              <Button variant="outline" className="w-full"><Phone className="h-4 w-4 mr-2" /> Contact Agent</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Feature = ({ icon: Icon, label, value }: any) => (
  <div className="flex flex-col items-center text-center">
    <Icon className="h-5 w-5 text-primary mb-1" />
    <div className="font-bold">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export default PropertyDetails;