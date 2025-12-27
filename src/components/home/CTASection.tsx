import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground mb-6">
            <Sparkles className="h-4 w-4" />
            Start Your Journey Today
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Find Your Perfect Home?
          </h2>

          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join thousands of smart property seekers using AI-powered insights 
            to make better real estate decisions.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/search">
              <Button 
                size="xl" 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl"
              >
                Explore Properties
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="xl" 
              variant="outline"
              className="border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
