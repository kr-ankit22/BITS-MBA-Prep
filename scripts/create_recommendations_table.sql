-- Create the recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    faculty_name TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT,
    description TEXT NOT NULL,
    subject TEXT NOT NULL,
    goal TEXT NOT NULL,
    expected_learning TEXT NOT NULL,
    remarks TEXT,
    time_to_complete TEXT
);

-- Enable Row Level Security
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow read access for all users (authenticated and anonymous)
CREATE POLICY "Allow read access for all users" 
ON recommendations FOR SELECT 
USING (true);

-- Policy: Allow insert access for authenticated users only (Faculty)
CREATE POLICY "Allow insert access for authenticated users" 
ON recommendations FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Policy: Allow update/delete for authenticated users (optional, for management)
CREATE POLICY "Allow update/delete for authenticated users" 
ON recommendations FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
