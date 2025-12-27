import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

type PropertyType = "buy" | "rent" | "sell";

export function HeroSection() {
  const [propertyType, setPropertyType] = useState<PropertyType>("buy");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState([50]);

  const propertyTypes: { value: PropertyType; label: string }[] = [
    { value: "buy", label: "Buy" },
    { value: "rent", label: "Rent" },
    { value: "sell", label: "Sell" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            AI-Powered Real Estate Intelligence
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
            Find Smarter Homes with{" "}
            <span className="gradient-text">AI-Powered Insights</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Get accurate price predictions, smart location recommendations, and fraud detection. 
            Make confident property decisions backed by machine learning.
          </p>

          {/* Search Card */}
          <Card variant="glass" className="p-6 md:p-8 mx-auto max-w-3xl animate-scale-in" style={{ animationDelay: "0.2s" }}>
            {/* Property Type Toggle */}
            <div className="flex justify-center gap-2 mb-6">
              {propertyTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setPropertyType(type.value)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    propertyType === type.value
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Search Form */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter location, city, or neighborhood"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex-1">
                <div className="h-12 px-4 rounded-lg border bg-background flex items-center gap-4">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Budget:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={budget[0]}
                    onChange={(e) => setBudget([parseInt(e.target.value)])}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-sm font-medium whitespace-nowrap">
                    ${budget[0]}L+
                  </span>
                </div>
              </div>

              <Link to="/search">
                <Button variant="hero" size="lg" className="h-12 w-full md:w-auto">
                  <Search className="h-5 w-5" />
                  Search
                </Button>
              </Link>
            </div>
          </Card>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/search">
              <Button variant="hero" size="lg">
                Explore Properties
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/list-property">
              <Button variant="heroOutline" size="lg">
                List Your Property
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground mt-1">Properties Listed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground mt-1">Price Accuracy</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground mt-1">Happy Users</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
