import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ReportAnimal = () => {
  const [formData, setFormData] = useState({
    animalType: "",
    condition: "",
    location: "",
    gmapsLink: "",
    description: "",
    contactName: "",
    contactPhone: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be less than 5MB");
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error("Please upload a valid image (JPG, PNG, or WEBP)");
      return;
    }

    setPhotoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.animalType || !formData.condition || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setUploading(true);
    let photoUrl = null;

    try {
      // Upload photo if provided
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('animal-photos')
          .upload(filePath, photoFile);

        if (uploadError) {
          toast.error("Failed to upload photo");
          setUploading(false);
          return;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('animal-photos')
          .getPublicUrl(filePath);
        
        photoUrl = publicUrl;
      }

      // Insert report with photo URL
      const { error } = await supabase.from('reported_animals').insert({
        animal_type: formData.animalType,
        condition: formData.condition,
        location: formData.location,
        gmaps_link: formData.gmapsLink,
        description: formData.description,
        contact_name: formData.contactName,
        contact_phone: formData.contactPhone,
        photo_url: photoUrl,
      });

      if (error) {
        toast.error("Failed to submit report. Please try again.");
        setUploading(false);
        return;
      }

      toast.success("Report submitted successfully! Our team will respond shortly.");
      
      // Reset form
      setFormData({
        animalType: "",
        condition: "",
        location: "",
        gmapsLink: "",
        description: "",
        contactName: "",
        contactPhone: "",
      });
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">Report an Animal</h1>
            <p className="text-lg text-muted-foreground">
              Help us rescue animals in need by providing detailed information about their location and condition.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Animal Report Form</CardTitle>
              <CardDescription>Fill in the details below. Fields marked with * are required.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Animal Type */}
                <div className="space-y-2">
                  <Label htmlFor="animalType">Animal Type *</Label>
                  <Select value={formData.animalType} onValueChange={(value) => setFormData({ ...formData, animalType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select animal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Condition */}
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="injured">Injured</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                      <SelectItem value="stray">Stray</SelectItem>
                      <SelectItem value="accident">Accident Victim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location Address *</Label>
                  <Input
                    id="location"
                    placeholder="Enter address or landmark"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                {/* Google Maps Link */}
                <div className="space-y-2">
                  <Label htmlFor="gmapsLink">
                    Google Maps Link 
                    <span className="text-muted-foreground text-xs ml-2">(Optional but recommended)</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="gmapsLink"
                      placeholder="Paste Google Maps link here (e.g., https://maps.app.goo.gl/...)"
                      value={formData.gmapsLink}
                      onChange={(e) => setFormData({ ...formData, gmapsLink: e.target.value })}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Share the exact location via Google Maps for faster rescue
                  </p>
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="photo">Upload Photo (Optional)</Label>
                  <input
                    type="file"
                    id="photo"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo"
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer block"
                  >
                    {photoPreview ? (
                      <div className="space-y-2">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg object-cover"
                        />
                        <p className="text-sm text-muted-foreground">Click to change photo</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</p>
                      </>
                    )}
                  </label>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Additional Details (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the situation, behavior, or any other relevant information..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Your Name (Optional)</Label>
                    <Input
                      id="contactName"
                      placeholder="Enter your name"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Your Phone (Optional)</Label>
                    <Input
                      id="contactPhone"
                      placeholder="Enter your phone"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={uploading}>
                  {uploading ? "Submitting..." : "Submit Report"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportAnimal;
