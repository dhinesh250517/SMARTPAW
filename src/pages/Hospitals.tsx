import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Hospitals = () => {
  const [open, setOpen] = useState(false);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [registrationData, setRegistrationData] = useState({
    hospitalName: "",
    address: "",
    contactPhone: "",
    email: "",
    services: "",
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const { data } = await supabase
        .from('hospital_registrations')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        setHospitals(data);
      }
    } catch (error) {
      console.error("Failed to load hospitals");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registrationData.hospitalName || !registrationData.address || !registrationData.contactPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const { error } = await supabase.from('hospital_registrations').insert({
      hospital_name: registrationData.hospitalName,
      address: registrationData.address,
      contact_phone: registrationData.contactPhone,
      email: registrationData.email,
      services: registrationData.services,
    });

    if (error) {
      toast.error("Failed to submit registration. Please try again.");
      return;
    }

    toast.success("Hospital registration submitted successfully! We'll contact you soon.");
    setOpen(false);
    setRegistrationData({
      hospitalName: "",
      address: "",
      contactPhone: "",
      email: "",
      services: "",
    });
    fetchHospitals();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Veterinary Hospitals</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our network of trusted veterinary hospitals ready to provide emergency care and treatment for animals in need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {hospitals.length === 0 ? (
            <Card className="col-span-2">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No hospitals registered yet. Be the first to join our network!</p>
              </CardContent>
            </Card>
          ) : (
            hospitals.map((hospital) => (
              <Card key={hospital.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{hospital.hospital_name}</CardTitle>
                      <Badge variant="default">Available</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Address:</p>
                        <p className="text-muted-foreground">{hospital.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                      <a href={`tel:${hospital.contact_phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                        {hospital.contact_phone}
                      </a>
                    </div>

                    {hospital.services && (
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{hospital.services}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1" 
                      size="sm"
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.address)}`, '_blank')}
                    >
                      Get Directions
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(`tel:${hospital.contact_phone}`, '_self')}
                    >
                      Call Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Are you a veterinary hospital?</CardTitle>
              <CardDescription>
                Join our network to help rescue animals in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">Register Your Hospital</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Register Your Hospital</DialogTitle>
                    <DialogDescription>
                      Fill in the details to join our network
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hospitalName">Hospital Name *</Label>
                      <Input
                        id="hospitalName"
                        value={registrationData.hospitalName}
                        onChange={(e) => setRegistrationData({ ...registrationData, hospitalName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={registrationData.address}
                        onChange={(e) => setRegistrationData({ ...registrationData, address: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone *</Label>
                      <Input
                        id="contactPhone"
                        value={registrationData.contactPhone}
                        onChange={(e) => setRegistrationData({ ...registrationData, contactPhone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={registrationData.email}
                        onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="services">Services Offered</Label>
                      <Textarea
                        id="services"
                        value={registrationData.services}
                        onChange={(e) => setRegistrationData({ ...registrationData, services: e.target.value })}
                        placeholder="e.g., Emergency care, Surgery, Vaccination"
                      />
                    </div>
                    <Button type="submit" className="w-full">Submit Registration</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Hospitals;
