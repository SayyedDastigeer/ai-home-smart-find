import { motion } from "framer-motion";
import { 
  Brain, MapPin, Shield, TrendingUp, Sparkles, BarChart3, Fingerprint, Zap 
} from "lucide-react";

const features = [
  {
    icon: Brain,
    id: "01",
    title: "Neural Valuation Engine",
    description: "Our proprietary regressive models process 5,000+ local variables to calculate real-time asset appreciation.",
  },
  {
    icon: MapPin,
    id: "02",
    title: "Geospatial DNA",
    description: "Analyze neighborhood velocity. We map school quality, transit nodes, and future zoning changes.",
  },
  {
    icon: Shield,
    id: "03",
    title: "Scam-Shield Protocol",
    description: "Blockchain-inspired verification ensures every listing is authenticated before it hits your feed.",
  },
  {
    icon: BarChart3,
    id: "04",
    title: "Predictive Analytics",
    description: "Don't just see the price today. See where the market will be in 24 months with 94% accuracy.",
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 md:py-40 bg-white relative overflow-hidden">
      {/* 🔹 Background Technical Watermark */}
      <div className="absolute top-0 right-0 text-[20vw] font-black text-slate-50 opacity-[0.03] select-none pointer-events-none translate-x-20 -translate-y-20">
        INTELLIGENCE
      </div>

      <div className="container px-6 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* 🔹 Left: Fixed Strategy Header */}
          <div className="lg:w-1/3 lg:sticky lg:top-40">
            <div className="flex items-center gap-2 mb-8 group">
              <div className="h-px w-8 bg-[#29A397] group-hover:w-12 transition-all duration-500" />
              <span className="text-[10px] font-black text-[#29A397] uppercase tracking-[0.5em]">System Core</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-8">
              Decisions <br />
              <span className="text-slate-300">without</span> <br />
              Doubts.
            </h2>
            
            <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">
              We've replaced gut feelings with algorithmic certainty. Welcome to the era of data-driven residency.
            </p>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white" />
                 ))}
               </div>
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                 Joined by 12k+ Smart Investors
               </span>
            </div>
          </div>

          {/* 🔹 Right: Feature Scroll */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative"
              >
                {/* ID Counter */}
                <span className="absolute -top-6 -left-4 text-6xl font-black text-slate-100 group-hover:text-[#29A397]/10 transition-colors duration-500 z-0">
                  {feature.id}
                </span>

                <div className="relative z-10">
                  <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-8 group-hover:border-[#29A397] group-hover:shadow-xl group-hover:shadow-[#29A397]/10 transition-all duration-500">
                    <feature.icon className="h-6 w-6 text-slate-400 group-hover:text-[#29A397]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    {feature.title}
                    <Zap className="h-3 w-3 text-[#29A397] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  
                  <p className="text-slate-500 leading-relaxed text-sm font-medium">
                    {feature.description}
                  </p>
                  
                  <div className="mt-6 h-[1px] w-0 bg-[#29A397] group-hover:w-full transition-all duration-700" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}