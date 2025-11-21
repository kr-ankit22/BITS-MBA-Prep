
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

console.log('Testing access with ANON key...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const verify = async () => {
    // Try to fetch companies
    const { data: companies, error: cError } = await supabase.from('companies').select('*');

    if (cError) {
        console.error('Error fetching companies:', cError);
    } else {
        console.log(`Companies found (Anon): ${companies?.length}`);
        if (companies && companies.length > 0) {
            console.log('Sample Company:', companies[0]);
        }
    }

    // Try to fetch questions
    const { data: questions, error: qError } = await supabase.from('questions').select('*');

    if (qError) {
        console.error('Error fetching questions:', qError);
    } else {
        console.log(`Questions found (Anon): ${questions?.length}`);
    }
};

verify();
