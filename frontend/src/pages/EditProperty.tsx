import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Check, MapPin, Building2, Bed, Bath, Square } from "lucide-react";

const amenitiesList = ["Swimming Pool", "Gym", "Parking", "Security", "Garden", "Clubhouse"];

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    type: "sell",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/properties/${id}`);
        setFormData({
          title: res.data.title,
          price: res.data.price,
          location: res.data.location,
          type: res.data.type,
          bedrooms: res.data.bedrooms,
          bathrooms: res.data.bathrooms,
          area: res.data.area,
          description: res.data.description,
        });
        setSelectedAmenities(res.data.amenities || []);
      } catch (err) {
        toast.error("Could not fetch property details");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.put(`http://localhost:5000/api/properties/${id}`, {
        ...formData,
        amenities: selectedAmenities
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Listing updated!");
      navigate(`/property/${id}`);
    } catch (err) {
      toast.error("Failed to update listing");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Navbar />
      <main className="container py-10 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Edit Listing</h1>
            <Button type="submit" disabled={updating}>
              {updating ? <Loader2 className="mr-2 animate-spin" /> : <Check className="mr-2" />} 
              Update Changes
            </Button>
          </div>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="text-primary" /> Basic Info</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Property Title</Label>
                <Input id="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input id="price" type="number" value={formData.price} onChange={handleInputChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={formData.location} onChange={handleInputChange} required />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Details & Description</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Input id="bedrooms" type="number" value={formData.bedrooms} onChange={handleInputChange} placeholder="Beds" />
                <Input id="bathrooms" type="number" value={formData.bathrooms} onChange={handleInputChange} placeholder="Baths" />
                <Input id="area" type="number" value={formData.area} onChange={handleInputChange} placeholder="Sqft" />
              </div>
              <Textarea id="description" value={formData.description} onChange={handleInputChange} className="min-h-[150px]" />
            </CardContent>
          </Card>
        </form>
      </main>
      <Footer />
    </div>
  );
}