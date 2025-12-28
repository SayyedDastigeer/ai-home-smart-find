import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  MapPin, 
  Shield, 
  TrendingUp,
  Sparkles,
  BarChart3
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Price Prediction",
    description: "Get accurate property valuations powered by machine learning, analyzing thousands of data points.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: MapPin,
    title: "Smart Location Recommendations",
    description: "Discover the best neighborhoods based on your lifestyle, commute, and budget preferences.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Shield,
    title: "Fraud Detection",
    description: "Our AI identifies suspicious listings and protects you from potential scams and overpriced deals.",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: TrendingUp,
    title: "Rental Yield Insights",
    description: "Calculate potential returns on investment properties with predictive rental income analysis.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Sparkles,
    title: "Personalized Suggestions",
    description: "Receive property recommendations tailored to your search history and preferences.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: BarChart3,
    title: "Market Trend Analysis",
    description: "Stay ahead with real-time market insights and future price trend predictions.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powered by <span className="gradient-text">Advanced AI</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Make smarter real estate decisions with cutting-edge machine learning 
            that analyzes millions of data points in real-time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                variant="feature"
                className="group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4 transition-transform group-hover:scale-110`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
