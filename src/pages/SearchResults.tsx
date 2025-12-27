import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchFilters } from "@/components/search/SearchFilters";
import { PropertyCard } from "@/components/property/PropertyCard";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { Button } from "@/components/ui/button";
import { mockProperties } from "@/data/mockProperties";
import { 
  Grid3X3, 
  List, 
  Map, 
  ArrowUpDown,
  SlidersHorizontal,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list" | "map";
type SortOption = "price" | "aiScore" | "area" | "yield";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "price", label: "Price" },
  { value: "aiScore", label: "AI Score" },
  { value: "area", label: "Area" },
  { value: "yield", label: "Rental Yield" },
];

const SearchResults = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("price");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <div className="container py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Properties in San Francisco</h1>
              <p className="text-muted-foreground mt-1">
                {mockProperties.length} properties found
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>

              {/* Sort */}
              <div className="flex items-center gap-2 border rounded-lg p-1">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground ml-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-sm font-medium focus:outline-none pr-2"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
              <div className="hidden md:flex items-center border rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === "grid" ? "bg-muted" : "hover:bg-muted/50"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === "list" ? "bg-muted" : "hover:bg-muted/50"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === "map" ? "bg-muted" : "hover:bg-muted/50"
                  )}
                >
                  <Map className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-72 shrink-0">
              <SearchFilters />
            </aside>

            {/* Mobile Filters Overlay */}
            {showFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div 
                  className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
                  onClick={() => setShowFilters(false)}
                />
                <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-background p-6 overflow-y-auto animate-slide-up">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <SearchFilters />
                </div>
              </div>
            )}

            {/* Property Grid */}
            <div className="flex-1">
              {viewMode === "map" ? (
                <div className="aspect-video rounded-xl bg-muted flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Map className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Map view coming soon</p>
                  </div>
                </div>
              ) : (
                <div className={cn(
                  "grid gap-6",
                  viewMode === "grid" 
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                )}>
                  {mockProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}

              {/* Load More */}
              <div className="mt-8 text-center">
                <Button variant="outline" size="lg">
                  Load More Properties
                </Button>
              </div>
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
