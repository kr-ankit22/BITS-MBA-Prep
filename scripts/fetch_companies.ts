
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const fetchCompanies = async () => {
    console.log('Fetching companies...');
    const { data: companies, error } = await supabase
        .from('companies')
        .select('id, name, logo');

    if (error) {
        console.error('Error fetching companies:', error);
        return;
    }

    console.log(`Found ${companies.length} companies:`);
    companies.forEach(c => {
        console.log(`- ${c.name} (Logo: ${c.logo || 'None'})`);
    });
};

fetchCompanies();
