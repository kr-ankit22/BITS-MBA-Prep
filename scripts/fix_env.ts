
import fs from 'fs';
import path from 'path';

const envContent = `VITE_SUPABASE_URL=https://wnnwvrcvzegyblofjqfy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indubnd2cmN2emVneWJsb2ZqcWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MjMzMjAsImV4cCI6MjA3Njk5OTMyMH0.KrY5C_MLo09WIkXpSb_tth9RN99u_CHoGZqMsDqka5k
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indubnd2cmN2emVneWJsb2ZqcWZ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQyMzMyMCwiZXhwIjoyMDc2OTk5MzIwfQ.lSG_WNAlpRFlmqCh8GwtupFiX52hmpG0XJ3j-OzbSsc
`;

fs.writeFileSync(path.join(process.cwd(), '.env'), envContent, { encoding: 'utf8' });
console.log('.env file rewritten successfully.');
