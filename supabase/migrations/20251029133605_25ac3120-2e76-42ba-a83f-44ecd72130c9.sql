-- Create adoption_requests table
CREATE TABLE public.adoption_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.adoption_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert adoption requests"
ON public.adoption_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can view adoption requests"
ON public.adoption_requests
FOR SELECT
TO anon, authenticated
USING (true);

-- Create donation_requests table
CREATE TABLE public.donation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  amount NUMERIC NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.donation_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert donation requests"
ON public.donation_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can view donation requests"
ON public.donation_requests
FOR SELECT
TO anon, authenticated
USING (true);

-- Add UPDATE policy for reported_animals to allow status updates
CREATE POLICY "Anyone can update reported animals status"
ON public.reported_animals
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);