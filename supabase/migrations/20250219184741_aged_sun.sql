/*
  # Create updated_at trigger function

  Creates a function that will be used by triggers to automatically
  update the updated_at timestamp whenever a row is modified.
*/

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';