-- Create job_offers table
CREATE TABLE IF NOT EXISTS job_offers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  sender_company text,
  offer_details text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;

-- Job offers policies
CREATE POLICY "Public can insert job offers" ON job_offers FOR INSERT WITH CHECK (true);
CREATE POLICY "Recipients can see their own offers" ON job_offers FOR SELECT 
USING (auth.uid() = recipient_id);

-- Ensure projects has image_url (it should from initial setup, but just in case)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='image_url') THEN
    ALTER TABLE projects ADD COLUMN image_url text;
  END IF;
END $$;
