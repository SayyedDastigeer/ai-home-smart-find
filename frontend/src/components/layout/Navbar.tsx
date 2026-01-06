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

  // Handle glassmorphism effect on scroll
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
          ? "bg-white/80 backdrop-blur-md border-slate-200 py-2 shadow-sm" 
          : "bg-white border-transparent py-4"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#29A397] shadow-lg shadow-[#29A397]/20 transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-slate-900 leading-none">HOMEAI</span>
            <span className="text-[10px] font-bold text-[#29A397] uppercase tracking-[0.2em] leading-none mt-1">Prime Realty</span>
          </div>
        </Link>

        {/* Desktop Centered Navigation */}
        <nav className="hidden lg:flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all",
                  isActive
                    ? "bg-white text-[#29A397] shadow-sm ring-1 ring-slate-200"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/list-property">
            <Button variant="ghost" className="text-xs font-bold text-slate-600 hover:text-[#29A397] gap-2">
              <PlusSquare className="h-4 w-4" />
              List Property
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl border-slate-200 gap-2 h-10 pl-2 pr-3">
                  <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-[#29A397]">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{user.name}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-xl">
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
              <Button className="rounded-xl bg-[#29A397] hover:bg-[#21857c] px-6 h-10 font-bold text-xs shadow-lg shadow-[#29A397]/20 transition-all active:scale-95">
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
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-2xl animate-in slide-in-from-top duration-300">
          <nav className="container py-8 flex flex-col gap-2">
            {[...navLinks, { href: "/list-property", label: "List Property", icon: PlusSquare }].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                  location.pathname === link.href
                    ? "bg-[#29A397]/10 text-[#29A397]"
                    : "text-slate-500 hover:bg-slate-50"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link to="/auth" className="mt-4 px-6">
                <Button className="w-full h-12 rounded-2xl bg-[#29A397] font-bold">Login to Account</Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}