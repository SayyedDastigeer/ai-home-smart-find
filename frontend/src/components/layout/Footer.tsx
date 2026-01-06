import { Link } from "react-router-dom";
import { Sparkles, Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Facebook } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Search Portfolio", href: "/search" },
    { label: "AI Recommendations", href: "/recommendations" },
    { label: "List Asset", href: "/list-property" },
    { label: "Enterprise Pricing", href: "/pricing" },
  ],
  company: [
    { label: "Our Story", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press Room", href: "/blog" },
    { label: "Corporate Contact", href: "/contact" },
  ],
  resources: [
    { label: "Client Help Center", href: "/help" },
    { label: "Market Intelligence", href: "/reports" },
    { label: "API Documentation", href: "/api" },
    { label: "Broker Program", href: "/partners" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Engagement", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-300 border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-12 mb-20">
          {/* Brand & Mission Section */}
          <div className="col-span-2 md:col-span-4 lg:col-span-5">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#29A397] shadow-lg shadow-[#29A397]/20 transition-transform group-hover:scale-105">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-white leading-none">HOMEAI</span>
                <span className="text-[10px] font-bold text-[#29A397] uppercase tracking-[0.2em] leading-none mt-1.5">Intelligence in Realty</span>
              </div>
            </Link>
            <p className="text-base text-slate-400 font-medium mb-10 max-w-sm leading-relaxed">
              Harnessing proprietary neural networks to redefine the global standard of property acquisition and market analytics.
            </p>
            <div className="flex gap-5">
              {[Twitter, Linkedin, Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 hover:border-[#29A397] hover:text-[#29A397] transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1 md:col-span-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#29A397] mb-8">
                {category}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Global Contact & Copyright Row */}
        <div className="border-t border-white/5 pt-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
            <div className="flex flex-wrap gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-3">
                <Mail className="h-3.5 w-3.5 text-[#29A397]" />
                hello@homeai.com
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-3.5 w-3.5 text-[#29A397]" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-3.5 w-3.5 text-[#29A397]" />
                San Francisco, CA
              </div>
            </div>
            
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              © 2026 HomeAI • <span className="text-slate-600">Secure AI Environment</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}