import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";

const amenitiesList = [
  "Swimming Pool", "Gym", "Parking", "Security",
  "Garden", "Clubhouse", "Power Backup", "Children's Play Area"
];

export default function ListProperty() {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const toggleAmenity = (name: string) => {
    setSelectedAmenities(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container py-10 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">List New Property</h1>
            <p className="text-muted-foreground mt-1">
              Enter your property details. Our AI will help optimize your listing.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Save Draft</Button>
            <Button className="gap-2">
              <Check className="h-4 w-4" /> Publish Listing
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Basic Information */}
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
                  <Input id="title" placeholder="e.g. Modern Villa with Sea View" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Asking Price ($)</Label>
                    <Input id="price" type="number" placeholder="500,000" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="location" className="pl-9" placeholder="City, State" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  Property Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer border-muted-foreground/25">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">Up to 10 photos (PNG, JPG)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Description & AI Enhancer */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Describe your property details..." 
                  className="min-h-[150px] bg-background"
                />
                <Button variant="secondary" className="w-full gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Enhance with HomeAI
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Specifications & Amenities */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <Label className="text-xs uppercase text-muted-foreground">Bedrooms</Label>
                    <Input type="number" placeholder="3" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <Label className="text-xs uppercase text-muted-foreground">Bathrooms</Label>
                    <Input type="number" placeholder="2" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Square className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <Label className="text-xs uppercase text-muted-foreground">Area (sqft)</Label>
                    <Input type="number" placeholder="1800" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {amenitiesList.map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleAmenity(item)}
                      className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${
                        selectedAmenities.includes(item)
                          ? "bg-primary/10 border-primary text-primary font-medium"
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      {item}
                      {selectedAmenities.includes(item) && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}