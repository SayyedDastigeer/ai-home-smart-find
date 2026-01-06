import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  Search,
  User,
  Menu,
  X,
  Sparkles,
  PlusSquare,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Properties", icon: Search },
  { href: "/recommendations", label: "AI Match", icon: Sparkles },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled 
          ? "bg-white/95 backdrop-blur-md border-slate-200 py-2 shadow-sm" 
          : "bg-white border-transparent py-4" // 🔹 Reduced from py-5 to py-4
      )}
    >
      <div className="container flex items-center justify-between">
        
        {/* 🔹 LOGO SECTION (Slightly more compact) */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#29A397] shadow-lg shadow-[#29A397]/20 transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-slate-900 leading-none">HOMEAI</span>
            <span className="text-[9px] font-bold text-[#29A397] uppercase tracking-[0.2em] leading-none mt-1">Prime Realty</span>
          </div>
        </Link>

        {/* 🔹 NAVIGATION (Slimmer padding) */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all", 
                  isActive
                    ? "bg-white text-[#29A397] shadow-sm ring-1 ring-slate-200"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                )}
              >
                <Icon className="h-4 w-4" /> 
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* 🔹 ACTIONS (More compact buttons) */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/list-property">
            <Button variant="ghost" className="text-sm font-bold text-slate-600 hover:text-[#29A397] gap-2 h-9 px-3">
              <PlusSquare className="h-4 w-4" />
              List Property
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 p-1 pr-4 rounded-full border border-slate-200 bg-white hover:border-[#29A397] transition-all outline-none">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#29A397] to-[#21857c] flex items-center justify-center text-white">
                    <span className="text-[10px] font-black">
                      {user.name.substring(0, 1).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-start">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter leading-none">
                      {user.name}
                    </span>
                    <span className="text-[8px] font-bold text-[#29A397] uppercase tracking-widest leading-none mt-0.5">
                      User
                    </span>
                  </div>
                  
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56 p-2 mt-2 rounded-2xl border-slate-100 shadow-xl">
                <Link to="/dashboard">
                  <DropdownMenuItem className="rounded-xl gap-3 p-3 cursor-pointer">
                    <LayoutDashboard className="h-4 w-4 text-slate-500" />
                    <span className="font-bold text-sm">Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem 
                  onClick={logout} 
                  className="rounded-xl gap-3 p-3 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-bold text-sm">Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button className="rounded-full bg-[#29A397] hover:bg-[#21857c] px-6 h-9 font-black text-[10px] uppercase tracking-widest shadow-md">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}