import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MapPin, Phone, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdoptDonate = () => {
  const [adoptionForm, setAdoptionForm] = useState({
    animal_name: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    message: ""
  });
  
  const [donationForm, setDonationForm] = useState({
    amount: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    message: ""
  });

  const [openAdopt, setOpenAdopt] = useState(false);
  const [openDonate, setOpenDonate] = useState(false);
  const [animals, setAnimals] = useState<any[]>([]);

  // Fetch approved animals that haven't been adopted yet and are not aggressive
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        // Get all resolved animals that are NOT aggressive
        const { data: resolvedAnimals } = await supabase
          .from('reported_animals')
          .select('*')
          .eq('status', 'resolved')
          .neq('condition', 'aggressive')
          .order('created_at', { ascending: false });
        
        // Show all resolved, non-aggressive animals; adoption filtering removed to avoid hiding by type
        setAnimals(resolvedAnimals || []);
      } catch (error) {
        console.error("Failed to load animals");
      }
    };
    fetchAnimals();
  }, []);

  const handleAdoptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('adoption_requests')
        .insert([adoptionForm]);
      
      if (error) throw error;
      
      toast.success("Adoption request submitted successfully!");
      setAdoptionForm({
        animal_name: "",
        contact_name: "",
        contact_phone: "",
        contact_email: "",
        message: ""
      });
      setOpenAdopt(false);
    } catch (error) {
      toast.error("Failed to submit adoption request");
    }
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('donation_requests')
        .insert([{
          ...donationForm,
          amount: parseFloat(donationForm.amount)
        }]);
      
      if (error) throw error;
      
      toast.success("Donation request submitted successfully!");
      setDonationForm({
        amount: "",
        contact_name: "",
        contact_phone: "",
        contact_email: "",
        message: ""
      });
      setOpenDonate(false);
    } catch (error) {
      toast.error("Failed to submit donation request");
    }
  };
  const handleAdopt = (animalName: string) => {
    setAdoptionForm({...adoptionForm, animal_name: animalName});
    setOpenAdopt(true);
  };

  const handleDonate = (amount?: string) => {
    if (amount) {
      setDonationForm({...donationForm, amount: amount.replace('₹', '')});
    }
    setOpenDonate(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Adopt & Support</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Give a loving home to animals in need or support their treatment through donations.
          </p>
        </div>

        <Tabs defaultValue="adopt" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="adopt">Available for Adoption</TabsTrigger>
            <TabsTrigger value="donate">Donate</TabsTrigger>
          </TabsList>

          <TabsContent value="adopt">
            {animals.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No animals available for adoption at the moment. Please check back later.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {animals.map((animal) => (
                  <Card key={animal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {animal.photo_url && (
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={animal.photo_url}
                          alt={animal.animal_type}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl capitalize">{animal.animal_type}</CardTitle>
                          <CardDescription>{animal.condition}</CardDescription>
                        </div>
                        <Badge variant="outline" className="capitalize">{animal.animal_type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    {animal.description && (
                      <p className="text-sm text-muted-foreground">{animal.description}</p>
                    )}
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">Location:</p>
                            <p className="text-muted-foreground">{animal.location}</p>
                            {animal.gmaps_link && (
                              <a 
                                href={animal.gmaps_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                              >
                                <MapPin className="h-3 w-3" />
                                Open in Google Maps
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button 
                        className="w-full gap-2"
                        onClick={() => handleAdopt(animal.animal_type)}
                      >
                        <Heart className="h-4 w-4" />
                        Adopt this {animal.animal_type}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="donate">
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Support Animal Treatment</CardTitle>
                  <CardDescription>
                    Your donations help provide medical care, food, and shelter for rescued animals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["₹500", "₹1000", "₹2000", "₹5000"].map((amount) => (
                      <Button 
                        key={amount} 
                        variant="outline" 
                        className="h-20 text-lg font-semibold"
                        onClick={() => handleDonate(amount)}
                      >
                        {amount}
                      </Button>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button 
                      size="lg" 
                      className="w-full gap-2"
                      onClick={() => handleDonate()}
                    >
                      <DollarSign className="h-5 w-5" />
                      Donate Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle>Specific Treatment Support</CardTitle>
                  <CardDescription>
                    Help fund treatment for animals currently in critical care
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
                      <div>
                        <h4 className="font-semibold">Emergency Surgery - Max</h4>
                        <p className="text-sm text-muted-foreground">Raised: ₹8,500 / ₹15,000</p>
                      </div>
                      <Button size="sm" onClick={() => handleDonate()}>Support</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
                      <div>
                        <h4 className="font-semibold">Recovery Care - Luna</h4>
                        <p className="text-sm text-muted-foreground">Raised: ₹4,200 / ₹8,000</p>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleDonate()}
                      >
                        Support
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle>Contact for Direct Donation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Call us: 9150231058</p>
                      <p className="text-sm text-muted-foreground">For GPay/UPI donations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Adoption Dialog */}
        <Dialog open={openAdopt} onOpenChange={setOpenAdopt}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adoption Request</DialogTitle>
              <DialogDescription>
                Fill in your details to request adoption. We'll contact you soon.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdoptionSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="animal_name">Animal Name/Type</Label>
                <Input
                  id="animal_name"
                  placeholder="e.g., Max"
                  value={adoptionForm.animal_name}
                  onChange={(e) => setAdoptionForm({...adoptionForm, animal_name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adopt_contact_name">Your Name</Label>
                <Input
                  id="adopt_contact_name"
                  placeholder="Your full name"
                  value={adoptionForm.contact_name}
                  onChange={(e) => setAdoptionForm({...adoptionForm, contact_name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adopt_contact_phone">Phone Number</Label>
                <Input
                  id="adopt_contact_phone"
                  placeholder="9150231058"
                  value={adoptionForm.contact_phone}
                  onChange={(e) => setAdoptionForm({...adoptionForm, contact_phone: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adopt_contact_email">Email (Optional)</Label>
                <Input
                  id="adopt_contact_email"
                  type="email"
                  placeholder="your@email.com"
                  value={adoptionForm.contact_email}
                  onChange={(e) => setAdoptionForm({...adoptionForm, contact_email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adopt_message">Message (Optional)</Label>
                <Textarea
                  id="adopt_message"
                  placeholder="Tell us about yourself and why you want to adopt"
                  value={adoptionForm.message}
                  onChange={(e) => setAdoptionForm({...adoptionForm, message: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full">Submit Request</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Donation Dialog */}
        <Dialog open={openDonate} onOpenChange={setOpenDonate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Donation Request</DialogTitle>
              <DialogDescription>
                Enter your donation details and we'll get in touch with payment information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleDonationSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Donation Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="1000"
                  value={donationForm.amount}
                  onChange={(e) => setDonationForm({...donationForm, amount: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donate_contact_name">Your Name</Label>
                <Input
                  id="donate_contact_name"
                  placeholder="Your full name"
                  value={donationForm.contact_name}
                  onChange={(e) => setDonationForm({...donationForm, contact_name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donate_contact_phone">Phone Number</Label>
                <Input
                  id="donate_contact_phone"
                  placeholder="9150231058"
                  value={donationForm.contact_phone}
                  onChange={(e) => setDonationForm({...donationForm, contact_phone: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donate_contact_email">Email (Optional)</Label>
                <Input
                  id="donate_contact_email"
                  type="email"
                  placeholder="your@email.com"
                  value={donationForm.contact_email}
                  onChange={(e) => setDonationForm({...donationForm, contact_email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donate_message">Message (Optional)</Label>
                <Textarea
                  id="donate_message"
                  placeholder="Any special message or purpose for donation"
                  value={donationForm.message}
                  onChange={(e) => setDonationForm({...donationForm, message: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full">Submit Donation</Button>
            </form>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default AdoptDonate;
