-- Add UPDATE policies for adoption_requests
CREATE POLICY "Anyone can update adoption requests status"
ON public.adoption_requests
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Add UPDATE policies for donation_requests
CREATE POLICY "Anyone can update donation requests status"
ON public.donation_requests
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Add UPDATE policies for hospital_registrations
CREATE POLICY "Anyone can update hospital registrations status"
ON public.hospital_registrations
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);