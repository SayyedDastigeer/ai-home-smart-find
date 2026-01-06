import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Upload,
  MapPin,
  Bed,
  Bath,
  Square,
  Sparkles,
  Camera,
  Check,
  Building2,
  Loader2,
  X,
} from "lucide-react";

const amenitiesList = [
  "Swimming Pool",
  "Gym",
  "Parking",
  "Security",
  "Garden",
  "Clubhouse",
  "Power Backup",
  "Children's Play Area",
];

export default function ListProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name)
        ? prev.filter((a) => a !== name)
        : [...prev, name]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      setPreviews((prev) => [
        ...prev,
        ...filesArray.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to list a property");
        return navigate("/auth");
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("price", formData.price);
      data.append("location", formData.location);
      data.append("type", formData.type);
      data.append("bedrooms", formData.bedrooms);
      data.append("bathrooms", formData.bathrooms);
      data.append("area", formData.area);
      data.append("description", formData.description);
      data.append("amenities", JSON.stringify(selectedAmenities));
      selectedFiles.forEach((file) => data.append("images", file));

      const response = await axios.post(
        "http://localhost:5000/api/properties",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Property listed successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Internal Server Error. Check Backend Console."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ✅ ONLY ADDITION: PageTransition */}
      <PageTransition>
        <main className="flex-1 container py-10 max-w-5xl">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  List New Property
                </h1>
                <p className="text-muted-foreground mt-1">
                  Enter your property details. Our AI will help optimize your
                  listing.
                </p>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" disabled={loading}>
                  Save Draft
                </Button>
                <Button type="submit" className="gap-2" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Publish Listing
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Property Name / Title</Label>
                      <Input
                        id="title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g. Modern Villa with Sea View"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="price">Asking Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          required
                          value={formData.price}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="type">Listing Type</Label>
                        <select
                          id="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="sell">For Sale</option>
                          <option value="rent">For Rent</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          required
                          value={formData.location}
                          onChange={handleInputChange}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Photos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5 text-primary" />
                      Property Photos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {previews.map((src, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden border"
                        >
                          <img
                            src={src}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}

                      <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl aspect-square cursor-pointer hover:bg-muted/50">
                        <Upload className="h-6 w-6 mb-2" />
                        <span className="text-xs font-medium">Add Photo</span>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Description */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      AI Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="min-h-[150px]"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                {/* Specifications */}
                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Bed className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs uppercase text-muted-foreground">
                          Bedrooms
                        </Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          required
                          value={formData.bedrooms}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Bath className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs uppercase text-muted-foreground">
                          Bathrooms
                        </Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          required
                          value={formData.bathrooms}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Square className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs uppercase text-muted-foreground">
                          Area (sqft)
                        </Label>
                        <Input
                          id="area"
                          type="number"
                          required
                          value={formData.area}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Amenities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    {amenitiesList.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAmenity(item)}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          selectedAmenities.includes(item)
                            ? "bg-primary/10 border-primary text-primary"
                            : "hover:bg-muted"
                        }`}
                      >
                        {item}
                        {selectedAmenities.includes(item) && (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
