import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchFilters } from "@/components/search/SearchFilters";
import { PropertyCard } from "@/components/property/PropertyCard";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";

const SearchResults = () => {
  const [properties, setProperties] = useState([]);
  const [savedIds, setSavedIds] = useState([]); // 🔥 IMPORTANT
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const token = localStorage.getItem("token");

  // 🔹 Fetch saved properties of user
  const fetchSavedProperties = async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        "http://localhost:5000/api/properties/saved-properties",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSavedIds(res.data.map((p) => p._id));
    } catch (err) {
      console.error("Failed to fetch saved properties", err);
    }
  };

  // 🔹 Fetch search properties
  const fetchProperties = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.append(k, v.toString());
      });

      const res = await axios.get(
        `http://localhost:5000/api/properties?${params.toString()}`
      );

      setProperties(res.data);
    } catch (err) {
      console.error("Error fetching properties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchSavedProperties(); // 🔥 REQUIRED
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Properties</h1>
            <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters(true)}>
              <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
            </Button>
          </div>

          <div className="flex gap-6">
            <aside className="hidden lg:block w-72">
              <SearchFilters onApply={fetchProperties} />
            </aside>

            <div className="flex-1">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map((p) => (
                    <PropertyCard
                      key={p._id}
                      property={p}
                      initiallySaved={savedIds.includes(p._id)} // 🔥 MAGIC
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default SearchResults;
