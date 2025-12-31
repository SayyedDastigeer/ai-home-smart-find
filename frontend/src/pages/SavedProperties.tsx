import { useEffect, useState } from "react";
import axios from "axios";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Heart, Scale, Trash2 } from "lucide-react";

const SavedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/properties/saved-properties",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProperties(res.data);
      } catch (err) {
        console.error("Failed to load saved properties", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

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
                {properties.length} properties saved
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline">
                <Scale className="h-4 w-4" />
                Compare All
              </Button>

              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => setProperties([])} // frontend clear only
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : properties.length === 0 ? (
            <p className="text-muted-foreground">
              You haven’t saved any properties yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  initiallySaved={true}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default SavedProperties;
