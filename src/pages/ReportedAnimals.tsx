import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Phone, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReportedAnimal {
  id: string;
  animal_type: string;
  condition: string;
  location: string;
  gmaps_link: string | null;
  description: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  status: string;
  created_at: string;
  photo_url: string | null;
}

const ReportedAnimals = () => {
  const [animals, setAnimals] = useState<ReportedAnimal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportedAnimals();
  }, []);

  const fetchReportedAnimals = async () => {
    try {
      const { data, error } = await supabase
        .from('reported_animals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnimals(data || []);
    } catch (error) {
      toast.error("Failed to load reported animals");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'resolved':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'injured':
        return 'destructive';
      case 'aggressive':
        return 'secondary';
      case 'stray':
        return 'default';
      case 'accident':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Reported Animals</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            View all animal reports submitted by the community
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        ) : animals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No animals reported yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {animals.map((animal) => (
              <Card key={animal.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                {animal.photo_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={animal.photo_url}
                      alt={animal.animal_type}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl capitalize">{animal.animal_type}</CardTitle>
                    <Badge variant={getStatusColor(animal.status)}>
                      {animal.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Badge variant={getConditionColor(animal.condition)} className="w-fit">
                    {animal.condition}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
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

                  {animal.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {animal.description}
                    </p>
                  )}

                  {animal.contact_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{animal.contact_name}</span>
                    </div>
                  )}

                  {animal.contact_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                      <a 
                        href={`tel:${animal.contact_phone}`} 
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {animal.contact_phone}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(animal.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ReportedAnimals;
