import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden rounded-[3rem] mx-4 lg:mx-8 mb-12">
      {/* 🔹 Luxury Deep Gradient Background */}
      <div className="absolute inset-0 bg-[#0F172A]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#29A397_0%,transparent_40%)] opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#29A397_0%,transparent_30%)] opacity-20" />

      {/* 🔹 Glassmorphic Decorative Circles */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#29A397]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#29A397]/10 rounded-full blur-[100px]" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* 🔹 High-End Technical Label */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#29A397]" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Unlock Your Future Portfolio
            </span>
          </motion.div>

          {/* 🔹 Executive Typography */}
          <h2 className="text-4xl md:text-6xl font-extralight tracking-tighter text-white leading-[1.1] mb-8">
            Experience the <span className="font-black text-[#29A397]">Evolution</span> <br />
            of Real Estate Search.
          </h2>

          <p className="text-lg md:text-xl text-slate-400 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Join an exclusive community leveraging AI-powered insights 
            to discover properties that truly resonate with your vision.
          </p>

          {/* 🔹 Refined Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/search">
              <Button 
                className="h-16 px-10 rounded-2xl bg-[#29A397] hover:bg-[#21857c] text-white font-black text-sm uppercase tracking-wider shadow-2xl shadow-[#29A397]/20 transition-all active:scale-95"
              >
                Start Your Search
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Button 
              variant="ghost"
              className="h-16 px-10 rounded-2xl border border-white/10 text-white font-bold text-sm hover:bg-white/5 backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>

          {/* 🔹 Trust Indicator */}
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-8 opacity-40 grayscale">
             <div className="flex items-center gap-2 text-white text-xs font-bold">
               <ShieldCheck className="h-4 w-4" /> Secure Transactions
             </div>
             <div className="flex items-center gap-2 text-white text-xs font-bold">
               <Sparkles className="h-4 w-4" /> AI Verified Listings
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}