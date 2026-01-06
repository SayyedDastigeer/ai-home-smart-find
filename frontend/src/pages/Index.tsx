import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { AIChatWidget } from "@/components/chat/AIChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD] antialiased">
      <Navbar />

      <PageTransition>
        <main className="flex-1">
          {/* Main Hero Visual */}
          <HeroSection />
          
          {/* Property Collections with Optimized Spacing */}
          <div className="flex flex-col">
            {/* Sale Section - Clean White */}
            <FeaturedProperties 
              title="Signature Collection" 
              subtitle="Curated high-value assets for the discerning investor." 
              type="sell" 
            />

            {/* Rent Section - Subtle Gray with Tight Padding */}
            <div className="bg-[#F8F9FA] border-y border-slate-100">
              <FeaturedProperties 
                title="Urban Retreats" 
                subtitle="Discover modern living spaces available for immediate residency." 
                type="rent" 
              />
            </div>
          </div>

          {/* Features Section with reduced gap */}
          <div className="py-12 md:py-16">
            <FeaturesSection />
          </div>

         

          {/* CTA Area */}
          <div className="container mx-auto px-6 py-16">
            <CTASection />
          </div>
        </main>
      </PageTransition>

      <Footer />
      <AIChatWidget />
    </div>
  );
};

// 🔹 Added missing default export to fix SyntaxError
export default Index;