import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, MapPin, TrendingUp, Users, Building2, Heart, Phone, Mail, User, Calendar, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [reportedAnimals, setReportedAnimals] = useState<any[]>([]);
  const [adoptionRequests, setAdoptionRequests] = useState<any[]>([]);
  const [donationRequests, setDonationRequests] = useState<any[]>([]);
  const [hospitalRegistrations, setHospitalRegistrations] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    hospitals: 0,
    pending: 0
  });
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    try {
      // Fetch reported animals
      const { data: animals } = await supabase
        .from('reported_animals')
        .select('*')
        .order('created_at', { ascending: false });
      setReportedAnimals(animals || []);

      // Fetch adoption requests
      const { data: adoptions } = await supabase
        .from('adoption_requests')
        .select('*')
        .order('created_at', { ascending: false });
      setAdoptionRequests(adoptions || []);

      // Fetch donation requests
      const { data: donations } = await supabase
        .from('donation_requests')
        .select('*')
        .order('created_at', { ascending: false });
      setDonationRequests(donations || []);

      // Fetch hospital registrations
      const { data: hospitals } = await supabase
        .from('hospital_registrations')
        .select('*')
        .order('created_at', { ascending: false });
      setHospitalRegistrations(hospitals || []);

      // Calculate stats
      const total = animals?.length || 0;
      const resolved = animals?.filter(a => a.status === 'resolved').length || 0;
      const pending = animals?.filter(a => a.status === 'pending').length || 0;
      const activeHospitals = hospitals?.filter(h => h.status === 'approved').length || 0;

      setStats({
        total,
        resolved,
        hospitals: activeHospitals,
        pending
      });
    } catch (error) {
      toast.error("Failed to load dashboard data");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "DHINESH") {
      setIsAuthenticated(true);
      toast.success("Access granted! Welcome to the dashboard.");
    } else {
      toast.error("Invalid password. Please try again.");
    }
  };

  const handleViewAnimal = (animal: any) => {
    setSelectedAnimal(animal);
    setViewDialogOpen(true);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('reported_animals')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Status updated to ${newStatus}`);
      fetchAllData();
      setViewDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleUpdateAdoptionStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('adoption_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Adoption request ${newStatus}`);
      fetchAllData();
    } catch (error) {
      toast.error("Failed to update adoption status");
    }
  };

  const handleUpdateDonationStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('donation_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Donation ${newStatus}`);
      fetchAllData();
    } catch (error) {
      toast.error("Failed to update donation status");
    }
  };

  const handleUpdateHospitalStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('hospital_registrations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Hospital ${newStatus}`);
      fetchAllData();
    } catch (error) {
      toast.error("Failed to update hospital status");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Smart Dashboard Access</CardTitle>
                <CardDescription>
                  This dashboard is restricted to authorized personnel only.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="text-center text-lg"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Access Dashboard
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
                  <p>Authorized for:</p>
                  <p className="mt-1">Government Officers • Hospitals • Registered NGOs</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Smart Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage animal rescue operations across the city</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Animal reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% success rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Hospitals</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.hospitals}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered & approved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Map View */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              City Map View
            </CardTitle>
            <CardDescription>Visual representation of reported animals across the city</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>Interactive map showing all reported locations</p>
                <p className="text-sm mt-1">(Map integration with markers for each report)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="animals" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="animals">Reported Animals</TabsTrigger>
            <TabsTrigger value="adoptions">Adoption Requests</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
          </TabsList>

          <TabsContent value="animals">
            <Card>
              <CardHeader>
                <CardTitle>Reported Animals</CardTitle>
                <CardDescription>Manage and approve animal rescue reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Animal</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportedAnimals.map((animal) => (
                      <TableRow key={animal.id}>
                        <TableCell className="font-medium capitalize">{animal.animal_type}</TableCell>
                        <TableCell>
                          <Badge variant={animal.condition === 'injured' ? 'destructive' : 'default'}>
                            {animal.condition}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{animal.location}</TableCell>
                        <TableCell>
                          <Badge variant={
                            animal.status === 'resolved' ? 'default' : 
                            animal.status === 'in_progress' ? 'secondary' : 
                            'outline'
                          }>
                            {animal.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(animal.created_at).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewAnimal(animal)}>
                              View
                            </Button>
                            {animal.status === 'pending' && (
                              <Button size="sm" onClick={() => handleUpdateStatus(animal.id, 'in_progress')}>
                                Accept
                              </Button>
                            )}
                            {animal.status === 'in_progress' && (
                              <Button size="sm" onClick={() => handleUpdateStatus(animal.id, 'resolved')}>
                                Mark Resolved
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adoptions">
            <Card>
              <CardHeader>
                <CardTitle>Adoption Requests</CardTitle>
                <CardDescription>Review adoption applications from potential adopters</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Animal</TableHead>
                      <TableHead>Adopter Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adoptionRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.animal_name}</TableCell>
                        <TableCell>{request.contact_name}</TableCell>
                        <TableCell>
                          <a href={`tel:${request.contact_phone}`} className="text-primary hover:underline">
                            {request.contact_phone}
                          </a>
                        </TableCell>
                        <TableCell>{request.contact_email || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={request.status === 'approved' ? 'default' : request.status === 'rejected' ? 'destructive' : 'outline'}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(request.created_at).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {request.status === 'pending' && (
                              <>
                                <Button size="sm" onClick={() => handleUpdateAdoptionStatus(request.id, 'approved')}>
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleUpdateAdoptionStatus(request.id, 'rejected')}>
                                  Reject
                                </Button>
                              </>
                            )}
                            {request.status === 'approved' && (
                              <Button size="sm" onClick={() => handleUpdateAdoptionStatus(request.id, 'completed')}>
                                Complete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>Donation Requests</CardTitle>
                <CardDescription>Manage incoming donation pledges</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amount</TableHead>
                      <TableHead>Donor Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donationRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">₹{request.amount}</TableCell>
                        <TableCell>{request.contact_name}</TableCell>
                        <TableCell>
                          <a href={`tel:${request.contact_phone}`} className="text-primary hover:underline">
                            {request.contact_phone}
                          </a>
                        </TableCell>
                        <TableCell>{request.contact_email || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={request.status === 'completed' ? 'default' : request.status === 'processing' ? 'secondary' : 'outline'}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(request.created_at).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {request.status === 'pending' && (
                              <Button size="sm" onClick={() => handleUpdateDonationStatus(request.id, 'processing')}>
                                Process
                              </Button>
                            )}
                            {request.status === 'processing' && (
                              <Button size="sm" onClick={() => handleUpdateDonationStatus(request.id, 'completed')}>
                                Complete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hospitals">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Registrations</CardTitle>
                <CardDescription>Approve and manage veterinary hospital partnerships</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hospital Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hospitalRegistrations.map((hospital) => (
                      <TableRow key={hospital.id}>
                        <TableCell className="font-medium">{hospital.hospital_name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{hospital.address}</TableCell>
                        <TableCell>
                          <a href={`tel:${hospital.contact_phone}`} className="text-primary hover:underline">
                            {hospital.contact_phone}
                          </a>
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate">{hospital.services || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={hospital.status === 'approved' ? 'default' : hospital.status === 'rejected' ? 'destructive' : 'outline'}>
                            {hospital.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(hospital.created_at).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell>
                          {hospital.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleUpdateHospitalStatus(hospital.id, 'approved')}>
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleUpdateHospitalStatus(hospital.id, 'rejected')}>
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Animal Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Animal Report Details</DialogTitle>
              <DialogDescription>Review and manage this animal report</DialogDescription>
            </DialogHeader>
            {selectedAnimal && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Animal Type</p>
                    <p className="text-lg capitalize">{selectedAnimal.animal_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Condition</p>
                    <Badge variant={selectedAnimal.condition === 'injured' ? 'destructive' : 'default'}>
                      {selectedAnimal.condition}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Location</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-foreground">{selectedAnimal.location}</p>
                        {selectedAnimal.gmaps_link ? (
                          <a 
                            href={selectedAnimal.gmaps_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline mt-1 inline-flex items-center gap-1"
                          >
                            <MapPin className="h-3 w-3" />
                            Open in Google Maps
                          </a>
                        ) : (
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAnimal.location)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline mt-1 inline-block"
                          >
                            Search on Map
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedAnimal.description && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p>{selectedAnimal.description}</p>
                    </div>
                  )}
                  {selectedAnimal.contact_name && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                      <p className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {selectedAnimal.contact_name}
                      </p>
                    </div>
                  )}
                  {selectedAnimal.contact_phone && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <a href={`tel:${selectedAnimal.contact_phone}`} className="flex items-center gap-2 text-primary hover:underline">
                        <Phone className="h-4 w-4" />
                        {selectedAnimal.contact_phone}
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={
                      selectedAnimal.status === 'resolved' ? 'default' : 
                      selectedAnimal.status === 'in_progress' ? 'secondary' : 
                      'outline'
                    }>
                      {selectedAnimal.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Reported</p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedAnimal.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  {selectedAnimal.status === 'pending' && (
                    <>
                      <Button onClick={() => handleUpdateStatus(selectedAnimal.id, 'in_progress')} className="flex-1">
                        <Check className="h-4 w-4 mr-2" />
                        Accept Report
                      </Button>
                      <Button variant="outline" onClick={() => handleUpdateStatus(selectedAnimal.id, 'rejected')} className="flex-1">
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  {selectedAnimal.status === 'in_progress' && (
                    <Button onClick={() => handleUpdateStatus(selectedAnimal.id, 'resolved')} className="flex-1">
                      <Check className="h-4 w-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  )}
                  {selectedAnimal.status === 'resolved' && (
                    <div className="text-center text-muted-foreground">
                      <Check className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p>This case has been resolved</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
