/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `price` (numeric, required)
      - `stock` (integer, required)
      - `status` (text, required)
      - `sku` (text, unique)
      - `image_url` (text)
      - `category` (text)
      - `brand` (text)
      - `dimensions` (text)
      - `weight` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `products` table
    - Add policies for authenticated users to:
      - Read all products
      - Create their own products
      - Update their own products
      - Delete their own products
*/

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  status text NOT NULL CHECK (status IN ('Live', 'Saved')),
  sku text UNIQUE,
  image_url text,
  category text,
  brand text,
  dimensions text,
  weight text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger to update the updated_at timestamp
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();