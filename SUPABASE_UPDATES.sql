-- Add company to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company text;

-- Create project_views table
CREATE TABLE IF NOT EXISTS project_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  viewer_id uuid REFERENCES auth.users ON DELETE SET NULL,
  viewer_name text,
  viewer_company text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE project_views ENABLE ROW LEVEL SECURITY;

-- Project views policies
CREATE POLICY "Public can insert views" ON project_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can see views of their projects" ON project_views FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_views.project_id 
    AND projects.user_id = auth.uid()
  )
);
