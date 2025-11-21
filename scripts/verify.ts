
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const verify = async () => {
    console.log('Verifying data...');

    const { data: companies, error: cError } = await supabase.from('companies').select('*');
    if (cError) console.error('Error fetching companies:', cError);
    else console.log(`Companies found: ${companies?.length}`);
    if (companies) console.log('Company Names:', companies.map(c => c.name));

    const { data: questions, error: qError } = await supabase.from('questions').select('*');
    if (qError) console.error('Error fetching questions:', qError);
    else console.log(`Questions found: ${questions?.length}`);

    const { data: resources, error: rError } = await supabase.from('resources').select('*');
    if (rError) console.error('Error fetching resources:', rError);
    else console.log(`Resources found: ${resources?.length}`);
};

verify();
