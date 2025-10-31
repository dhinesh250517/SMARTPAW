-- Create table for reported animals
CREATE TABLE public.reported_animals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_type TEXT NOT NULL,
  condition TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  photo_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for hospital registrations
CREATE TABLE public.hospital_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_name TEXT NOT NULL,
  address TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  email TEXT,
  services TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reported_animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for this app)
CREATE POLICY "Anyone can view reported animals" 
ON public.reported_animals 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert reported animals" 
ON public.reported_animals 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view hospital registrations" 
ON public.hospital_registrations 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert hospital registrations" 
ON public.hospital_registrations 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reported_animals_updated_at
BEFORE UPDATE ON public.reported_animals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();