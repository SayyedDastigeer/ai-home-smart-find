import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/recommendations", label: "AI Recommendations", icon: Sparkles },
  { href: "/list-property", label: "List Property", icon: PlusSquare },
  { href: "/dashboard", label: "Dashboard", icon: User },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">HomeAI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm">Hi, {user.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t bg-card">
          <nav className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-4 pt-4 border-t">
              {user ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  Logout
                </Button>
              ) : (
                <Link to="/auth">
                  <Button className="w-full">Login</Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
