import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PawPrint, Menu, X } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/report", label: "Report Animal" },
    { path: "/reported-animals", label: "View Reports" },
    { path: "/hospitals", label: "Hospitals" },
    { path: "/adopt-donate", label: "Adopt & Donate" },
    { path: "/tracking", label: "GPS Tracking" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <PawPrint className="h-6 w-6" />
            <span>SmartPaw</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="sm"
                  className="text-sm"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="ml-2">
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-accent rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border/40">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-start">
                Dashboard
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
