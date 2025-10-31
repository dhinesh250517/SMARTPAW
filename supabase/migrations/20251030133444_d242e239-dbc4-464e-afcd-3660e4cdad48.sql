-- Add gmaps_link column to reported_animals table
ALTER TABLE public.reported_animals 
ADD COLUMN gmaps_link TEXT;

-- Delete all existing animal data for fresh start
DELETE FROM public.reported_animals;