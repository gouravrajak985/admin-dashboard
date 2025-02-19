/*
  # Create discounts table

  1. New Tables
    - `discounts`
      - `id` (uuid, primary key)
      - `code` (text, required, unique)
      - `type` (text, required)
      - `value` (numeric, required)
      - `value_type` (text, required)
      - `min_purchase_amount` (numeric)
      - `usage_count` (integer)
      - `max_uses` (integer)
      - `status` (text, required)
      - `start_date` (timestamptz, required)
      - `end_date` (timestamptz, required)
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on discounts table
    - Add policies for authenticated users to:
      - Read their own discounts
      - Create discounts
      - Update their own discounts
      - Delete their own discounts
*/

CREATE TABLE discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('discount_code', 'coupon_codes')),
  value numeric(10,2) NOT NULL CHECK (value >= 0),
  value_type text NOT NULL CHECK (value_type IN ('percentage', 'fixed')),
  min_purchase_amount numeric(10,2) CHECK (min_purchase_amount >= 0),
  usage_count integer DEFAULT 0,
  max_uses integer CHECK (max_uses > 0),
  status text NOT NULL CHECK (status IN ('Active', 'Expired', 'Scheduled')),
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL,
  CONSTRAINT valid_date_range CHECK (start_date <= end_date)
);

ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own discounts"
  ON discounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create discounts"
  ON discounts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discounts"
  ON discounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own discounts"
  ON discounts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger to update the updated_at timestamp
CREATE TRIGGER update_discounts_updated_at
  BEFORE UPDATE ON discounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();