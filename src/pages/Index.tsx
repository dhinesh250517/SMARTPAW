import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AlertCircle, Building2, Heart, Phone } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const features = [
    {
      icon: AlertCircle,
      title: "Report Animal",
      description: "Quickly report stray, injured, or animals in distress with location and photos.",
      link: "/report",
      variant: "secondary" as const,
    },
    {
      icon: Building2,
      title: "Find Hospitals",
      description: "Locate nearby veterinary hospitals ready to provide emergency care.",
      link: "/hospitals",
      variant: "default" as const,
    },
    {
      icon: Heart,
      title: "Adopt & Donate",
      description: "Give animals a loving home or support their treatment through donations.",
      link: "/adopt-donate",
      variant: "success" as const,
    },
    {
      icon: Phone,
      title: "Contact Us",
      description: "Have questions? Reach out to our team for support and information.",
      link: "/contact",
      variant: "outline" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Smart City
                <span className="block text-primary">Animal Rescue</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Connecting citizens, veterinary hospitals, and government departments to rescue, protect, and care for animals in our communities.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/report">
                  <Button size="lg" className="gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Report Animal
                  </Button>
                </Link>
                <Link to="/adopt-donate">
                  <Button size="lg" variant="success" className="gap-2">
                    <Heart className="h-5 w-5" />
                    Adopt Now
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                <img
                  src={heroImage}
                  alt="Animal rescue in smart city"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How SmartPaw Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform seamlessly connects all stakeholders in animal welfare for faster response and better outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Link key={feature.title} to={feature.link}>
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105 cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant={feature.variant} className="w-full">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Animals Rescued</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">200+</div>
              <p className="text-muted-foreground">Successful Adoptions</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">50+</div>
              <p className="text-muted-foreground">Partner Hospitals</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Emergency Support</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
