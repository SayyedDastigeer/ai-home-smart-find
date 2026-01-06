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
          ? "bg-white/95 backdrop-blur-md border-slate-200 py-2.5 shadow-sm" 
          : "bg-white border-transparent py-5" 
      )}
    >
      <div className="container flex items-center justify-between">
        {/* 🔹 Logo Section: Perfectly Balanced */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#29A397] shadow-lg shadow-[#29A397]/20 transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-slate-900 leading-none">HOMEAI</span>
            <span className="text-[10px] font-bold text-[#29A397] uppercase tracking-[0.2em] leading-none mt-1">Prime Realty</span>
          </div>
        </Link>

        {/* 🔹 Navigation: Bold & Readable (text-sm) */}
        <nav className="hidden lg:flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all", 
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

        {/* 🔹 Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/list-property">
            <Button variant="ghost" className="text-sm font-bold text-slate-600 hover:text-[#29A397] gap-2">
              <PlusSquare className="h-4.5 w-4.5" />
              List Property
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl border-slate-200 gap-2.5 h-11 pl-2 pr-3">
                  <div className="h-7.5 w-7.5 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-[#29A397]">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{user.name}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-2 rounded-2xl border-slate-100 shadow-xl">
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 p-3">Account</DropdownMenuLabel>
                <Link to="/dashboard">
                  <DropdownMenuItem className="rounded-xl gap-2 p-3 cursor-pointer">
                    <LayoutDashboard className="h-4 w-4 text-slate-500" />
                    <span className="font-bold text-sm">Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem 
                  onClick={logout} 
                  className="rounded-xl gap-2 p-3 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-bold text-sm">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button className="rounded-xl bg-[#29A397] hover:bg-[#21857c] px-7 h-11 font-bold text-sm shadow-lg shadow-[#29A397]/20 transition-all active:scale-95">
                Get Started
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-2xl animate-in slide-in-from-top duration-300">
          <nav className="container py-8 flex flex-col gap-2">
            {[...navLinks, { href: "/list-property", label: "List Property", icon: PlusSquare }].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-2xl text-base font-bold transition-all",
                  location.pathname === link.href
                    ? "bg-[#29A397]/10 text-[#29A397]"
                    : "text-slate-500 hover:bg-slate-50"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}