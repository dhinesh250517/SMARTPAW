import { PawPrint, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-card mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-primary mb-3">
              <PawPrint className="h-6 w-6" />
              <span>SmartPaw</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting citizens, hospitals, and government for animal rescue and welfare in smart cities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <div className="space-y-2">
            <Link to="/report" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
              Report Animal
            </Link>
            <Link to="/reported-animals" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
              View Reports
            </Link>
            <Link to="/hospitals" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
              Hospitals
            </Link>
            <Link to="/adopt-donate" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
              Adopt & Donate
            </Link>
            <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact Us
            </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">Emergency Contact</h3>
            <div className="space-y-2 text-sm">
              <a 
                href="tel:9150231058" 
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                <Phone className="h-4 w-4" />
                9150231058
              </a>
              <p className="text-xs text-muted-foreground">Tamil Nadu Veterinary Emergency Line</p>
              <div className="flex items-center gap-2 text-muted-foreground mt-3">
                <Mail className="h-4 w-4" />
                <span>contact@smartpaw.city</span>
              </div>
              <div className="mt-3">
                <p className="font-medium text-foreground">Team Members:</p>
                <p className="text-muted-foreground">Dhinesh S, Ragul T R, Jayavishal M, Vasanth M, Kandha Kumar M</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SmartPaw. Making cities safer for animals.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
