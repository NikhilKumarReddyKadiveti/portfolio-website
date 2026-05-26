-- Fix relationships to allow direct joins between profiles and other tables
-- This ensures that Supabase can correctly join projects/skills with profiles

-- Update projects table
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_user_id_fkey;
ALTER TABLE projects ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Update skills table
ALTER TABLE skills DROP CONSTRAINT IF EXISTS skills_user_id_fkey;
ALTER TABLE skills ADD CONSTRAINT skills_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Update project_views table (if viewer_id is used)
ALTER TABLE project_views DROP CONSTRAINT IF EXISTS project_views_viewer_id_fkey;
ALTER TABLE project_views ADD CONSTRAINT project_views_viewer_id_fkey FOREIGN KEY (viewer_id) REFERENCES profiles(id) ON DELETE SET NULL;
