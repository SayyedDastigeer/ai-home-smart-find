import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type PropertyType = "buy" | "rent" | "sell";

export function HeroSection() {
  const [propertyType, setPropertyType] = useState<PropertyType>("buy");
  const [location, setLocation] = useState("");

  const propertyTypes: { value: PropertyType; label: string }[] = [
    { value: "buy", label: "Buy" },
    { value: "rent", label: "Rent" },
    { value: "sell", label: "Sell" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[hsl(220,20%,4%)] via-[hsl(220,18%,8%)] to-[hsl(220,15%,12%)]">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container relative h-full min-h-screen">
        <div className="grid lg:grid-cols-[45%_55%] min-h-screen items-center gap-8 lg:gap-0">
          
          {/* Left Column - Text & Search */}
          <div className="pt-32 pb-16 lg:py-0 lg:pr-16 xl:pr-24">
            {/* Editorial Accent */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--hero-accent))]" />
              <span className="text-[hsl(var(--hero-text-muted))] text-sm font-medium tracking-widest uppercase">
                AI-Powered Real Estate
              </span>
            </div>

            {/* Headline - Magazine Style */}
            <h1 className="text-[hsl(var(--hero-text))] font-bold tracking-tight leading-[1.08] mb-8">
              <span className="block text-[clamp(3rem,8vw,6rem)]">Discover</span>
              <span className="block text-[clamp(3rem,8vw,6rem)]">Your Perfect</span>
              <span className="block text-[clamp(3rem,8vw,6rem)] relative">
                Home
                <span className="absolute -right-4 top-0 w-3 h-3 rounded-full bg-[hsl(var(--hero-accent))]" />
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-[hsl(var(--hero-text-muted))] text-lg md:text-xl leading-relaxed max-w-md mb-10">
              AI-driven insights for smarter property decisions. Accurate pricing, location intelligence, and market trends.
            </p>

            {/* Search Bar - Pill Shape */}
            <div className="mb-12">
              {/* Property Type Toggle */}
              <div className="flex gap-1 mb-4">
                {propertyTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setPropertyType(type.value)}
                    className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                      propertyType === type.value
                        ? "bg-[hsl(var(--hero-accent))] text-[hsl(220,20%,4%)]"
                        : "text-[hsl(var(--hero-text-muted))] hover:text-[hsl(var(--hero-text))]"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="flex items-center gap-3 bg-[hsl(0,0%,100%,0.08)] backdrop-blur-sm border border-[hsl(0,0%,100%,0.1)] rounded-full p-2 pl-6 max-w-lg">
                <MapPin className="h-5 w-5 text-[hsl(var(--hero-text-muted))] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Enter city or neighborhood..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 bg-transparent text-[hsl(var(--hero-text))] placeholder:text-[hsl(var(--hero-text-muted))] focus:outline-none text-base py-2"
                />
                <Link to="/search">
                  <Button 
                    className="rounded-full bg-[hsl(var(--hero-accent))] hover:bg-[hsl(35,95%,50%)] text-[hsl(220,20%,4%)] font-semibold px-6 h-12 transition-all duration-300 hover:shadow-[0_0_30px_hsl(35,95%,55%,0.4)]"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats - Bold & Minimal */}
            <div className="flex gap-12">
              <div>
                <div className="text-[hsl(var(--hero-text))] text-4xl md:text-5xl font-bold tracking-tight">
                  9,000<span className="text-[hsl(var(--hero-accent))]">+</span>
                </div>
                <div className="text-[hsl(var(--hero-text-muted))] text-sm mt-1 tracking-wide">
                  Premium Homes
                </div>
              </div>
              <div>
                <div className="text-[hsl(var(--hero-text))] text-4xl md:text-5xl font-bold tracking-tight">
                  2,000<span className="text-[hsl(var(--hero-accent))]">+</span>
                </div>
                <div className="text-[hsl(var(--hero-text-muted))] text-sm mt-1 tracking-wide">
                  Happy Clients
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Property Image */}
          <div className="relative hidden lg:flex items-center justify-center h-full py-16">
            {/* Image Container with Soft Radius */}
            <div className="relative w-full h-[85vh] max-h-[800px]">
              {/* Main Image */}
              <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Luxury modern home"
                  className="w-full h-full object-cover"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,20%,4%,0.3)] via-transparent to-transparent" />
              </div>

              {/* Floating Card - Property Info */}
              <div className="absolute bottom-8 left-8 right-8 bg-[hsl(0,0%,100%,0.1)] backdrop-blur-xl border border-[hsl(0,0%,100%,0.15)] rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[hsl(var(--hero-text-muted))] text-sm mb-1">Featured Property</p>
                    <h3 className="text-[hsl(var(--hero-text))] text-xl font-semibold">Modern Villa, Malibu</h3>
                    <p className="text-[hsl(var(--hero-accent))] text-2xl font-bold mt-2">$4.2M</p>
                  </div>
                  <Link to="/property/1">
                    <Button 
                      variant="outline" 
                      className="rounded-full border-[hsl(0,0%,100%,0.2)] bg-transparent text-[hsl(var(--hero-text))] hover:bg-[hsl(0,0%,100%,0.1)] hover:border-[hsl(0,0%,100%,0.3)]"
                    >
                      View
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Decorative Element - Overlapping accent */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full border-2 border-[hsl(var(--hero-accent),0.3)] pointer-events-none" />
            </div>
          </div>

          {/* Mobile Image */}
          <div className="lg:hidden relative w-full h-[50vh] -mx-4 px-4 mb-8">
            <div className="relative w-full h-full rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Luxury modern home"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,20%,4%)] via-transparent to-transparent" />
              
              {/* Mobile Floating Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-[hsl(0,0%,100%,0.1)] backdrop-blur-xl border border-[hsl(0,0%,100%,0.15)] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[hsl(var(--hero-text))] font-semibold">Modern Villa, Malibu</p>
                    <p className="text-[hsl(var(--hero-accent))] text-xl font-bold">$4.2M</p>
                  </div>
                  <Link to="/property/1">
                    <Button 
                      size="sm"
                      className="rounded-full bg-[hsl(var(--hero-accent))] hover:bg-[hsl(35,95%,50%)] text-[hsl(220,20%,4%)]"
                    >
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
