import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { PropertyCard } from "@/components/property/PropertyCard";
import { mockProperties } from "@/data/mockProperties";
import { Button } from "@/components/ui/button";
import { Heart, Scale, Trash2 } from "lucide-react";

const SavedProperties = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Heart className="h-8 w-8 text-destructive" />
                Saved Properties
              </h1>
              <p className="text-muted-foreground">
                {mockProperties.length} properties saved
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Scale className="h-4 w-4" />
                Compare All
              </Button>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default SavedProperties;
