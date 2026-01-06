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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* GLOBAL PAGE ANIMATION */}
      <PageTransition>
        <main className="flex-1">
          <HeroSection />
          <FeaturedProperties />
          <FeaturesSection />
          <TestimonialsSection />
          <CTASection />
        </main>
      </PageTransition>

      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default Index;
