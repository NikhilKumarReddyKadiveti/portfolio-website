-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  username text unique,
  avatar_url text,
  bio text,
  website text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Recreate projects table with user ownership
drop table if exists projects;
create table projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  image_url text,
  live_url text,
  github_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Recreate skills table with user ownership
drop table if exists skills;
create table skills (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table projects enable row level security;
alter table skills enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Projects policies
create policy "Public read projects" on projects for select using (true);
create policy "Users can insert their own projects" on projects for insert with check (auth.uid() = user_id);
create policy "Users can update their own projects" on projects for update using (auth.uid() = user_id);
create policy "Users can delete their own projects" on projects for delete using (auth.uid() = user_id);

-- Skills policies
create policy "Public read skills" on skills for select using (true);
create policy "Users can insert their own skills" on skills for insert with check (auth.uid() = user_id);
create policy "Users can update their own skills" on skills for update using (auth.uid() = user_id);
create policy "Users can delete their own skills" on skills for delete using (auth.uid() = user_id);

-- Public portfolio image uploads
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do update set public = true;

create policy "Public read portfolio images" on storage.objects
  for select using (bucket_id = 'portfolio-images');

create policy "Users can upload own portfolio images" on storage.objects
  for insert with check (
    bucket_id = 'portfolio-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update own portfolio images" on storage.objects
  for update using (
    bucket_id = 'portfolio-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own portfolio images" on storage.objects
  for delete using (
    bucket_id = 'portfolio-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, username)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
