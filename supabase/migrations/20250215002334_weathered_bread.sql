/*
  # Update profiles table schema

  1. Changes
    - Add email column
    - Make name column non-nullable
    - Add email column constraints
    - Update trigger function to include email

  2. Security
    - Maintain existing RLS policies
*/

-- Add email column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;
END $$;

-- Make name column non-nullable
ALTER TABLE profiles 
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN email SET NOT NULL,
  ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- Update the trigger function to include email
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, location, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'User'),
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'location',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;