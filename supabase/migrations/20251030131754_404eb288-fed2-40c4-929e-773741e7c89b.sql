-- Create storage bucket for animal photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'animal-photos',
  'animal-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Create storage policies for animal photos
CREATE POLICY "Anyone can upload animal photos"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'animal-photos');

CREATE POLICY "Anyone can view animal photos"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'animal-photos');

CREATE POLICY "Anyone can update their animal photos"
ON storage.objects
FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'animal-photos');