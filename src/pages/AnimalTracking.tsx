import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MapPin, Activity, Clock, AlertCircle } from "lucide-react";

interface AnimalGPS {
  id: string;
  name: string;
  species: string;
  tagId: string;
  lat: number;
  lng: number;
  speed: number; // km/h
  lastUpdate: string;
  batteryLevel: number;
  path: Array<{ lat: number; lng: number; time: string }>;
}

const AnimalTracking = () => {
  const [trackedAnimals, setTrackedAnimals] = useState<AnimalGPS[]>([
    {
      id: "1",
      name: "Bruno",
      species: "Street Dog",
      tagId: "GPS-001",
      lat: 13.0827,
      lng: 80.2707,
      speed: 2.5,
      lastUpdate: new Date().toLocaleString(),
      batteryLevel: 85,
      path: [
        { lat: 13.0827, lng: 80.2707, time: "10:00 AM" },
        { lat: 13.0830, lng: 80.2710, time: "10:15 AM" },
        { lat: 13.0828, lng: 80.2708, time: "10:30 AM" },
      ],
    },
    {
      id: "2",
      name: "Mia",
      species: "Street Dog",
      tagId: "GPS-002",
      lat: 11.0168,
      lng: 76.9558,
      speed: 0.5,
      lastUpdate: new Date().toLocaleString(),
      batteryLevel: 45,
      path: [
        { lat: 11.0168, lng: 76.9558, time: "10:00 AM" },
        { lat: 11.0169, lng: 76.9559, time: "10:15 AM" },
        { lat: 11.0168, lng: 76.9558, time: "10:30 AM" },
      ],
    },
    {
      id: "3",
      name: "Rocky",
      species: "Street Dog",
      tagId: "GPS-003",
      lat: 9.9252,
      lng: 78.1198,
      speed: 5.8,
      lastUpdate: new Date().toLocaleString(),
      batteryLevel: 92,
      path: [
        { lat: 9.9252, lng: 78.1198, time: "10:00 AM" },
        { lat: 9.9260, lng: 78.1210, time: "10:15 AM" },
        { lat: 9.9268, lng: 78.1220, time: "10:30 AM" },
      ],
    },
    {
      id: "4",
      name: "Luna",
      species: "Street Dog",
      tagId: "GPS-004",
      lat: 10.7905,
      lng: 78.7047,
      speed: 3.2,
      lastUpdate: new Date().toLocaleString(),
      batteryLevel: 67,
      path: [
        { lat: 10.7905, lng: 78.7047, time: "10:00 AM" },
        { lat: 10.7910, lng: 78.7050, time: "10:15 AM" },
        { lat: 10.7912, lng: 78.7052, time: "10:30 AM" },
      ],
    },
  ]);

  const getHealthStatus = (speed: number) => {
    if (speed < 1) return { status: "Critical - Minimal Movement", color: "destructive", icon: AlertCircle };
    if (speed < 2) return { status: "Concerning - Low Activity", color: "warning", icon: AlertCircle };
    if (speed < 4) return { status: "Healthy - Normal Activity", color: "success", icon: Activity };
    return { status: "Excellent - High Activity", color: "success", icon: Activity };
  };

  useEffect(() => {
    // Simulate real-time GPS updates
    const interval = setInterval(() => {
      setTrackedAnimals((prev) =>
        prev.map((animal) => ({
          ...animal,
          lat: animal.lat + (Math.random() - 0.5) * 0.001,
          lng: animal.lng + (Math.random() - 0.5) * 0.001,
          speed: Math.max(0, animal.speed + (Math.random() - 0.5) * 0.5),
          lastUpdate: new Date().toLocaleString(),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">GPS Animal Tracking</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of animals with GPS neck bands across Tamil Nadu
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-8">
          {trackedAnimals.map((animal) => {
            const health = getHealthStatus(animal.speed);
            const HealthIcon = health.icon;

            return (
              <Card key={animal.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{animal.name}</CardTitle>
                      <CardDescription>{animal.species} • Tag: {animal.tagId}</CardDescription>
                    </div>
                    <Badge variant={health.color === "success" ? "default" : "destructive"}>
                      <HealthIcon className="w-3 h-3 mr-1" />
                      {health.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Movement Visualization */}
                  <div className="bg-muted/30 rounded-lg p-4 h-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                    <svg className="w-full h-full" viewBox="0 0 200 100">
                      <defs>
                        <linearGradient id={`gradient-${animal.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>
                      {/* Movement path */}
                      <path
                        d={`M 20,50 Q 60,${80 - animal.speed * 5} 100,50 T 180,${70 - animal.speed * 3}`}
                        fill="none"
                        stroke={`url(#gradient-${animal.id})`}
                        strokeWidth="3"
                        className="animate-pulse"
                      />
                      {/* Current position marker */}
                      <circle
                        cx="180"
                        cy={70 - animal.speed * 3}
                        r="6"
                        fill="hsl(var(--primary))"
                        className="animate-pulse"
                      />
                    </svg>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Activity className="w-4 h-4 mr-2" />
                        Movement Speed
                      </div>
                      <p className="text-2xl font-bold">{animal.speed.toFixed(1)} km/h</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        Location
                      </div>
                      <p className="text-xs font-mono">
                        {animal.lat.toFixed(4)}, {animal.lng.toFixed(4)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        Last Update
                      </div>
                      <p className="text-xs">{animal.lastUpdate}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        Battery Level
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-full rounded-full transition-all"
                            style={{ width: `${animal.batteryLevel}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{animal.batteryLevel}%</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href={`https://www.google.com/maps?q=${animal.lat},${animal.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      View on Google Maps
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Health Status Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-4">
            <div className="space-y-1">
              <Badge variant="destructive" className="w-full justify-center">Critical</Badge>
              <p className="text-xs text-muted-foreground">Speed &lt; 1 km/h</p>
            </div>
            <div className="space-y-1">
              <Badge variant="destructive" className="w-full justify-center bg-warning text-warning-foreground">Concerning</Badge>
              <p className="text-xs text-muted-foreground">Speed 1-2 km/h</p>
            </div>
            <div className="space-y-1">
              <Badge variant="default" className="w-full justify-center">Healthy</Badge>
              <p className="text-xs text-muted-foreground">Speed 2-4 km/h</p>
            </div>
            <div className="space-y-1">
              <Badge variant="default" className="w-full justify-center">Excellent</Badge>
              <p className="text-xs text-muted-foreground">Speed &gt; 4 km/h</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AnimalTracking;
