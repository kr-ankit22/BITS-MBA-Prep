
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

const inspectSchema = async () => {
    console.log('Inspecting schema...');

    // Try to insert a dummy row with the column to see if it fails, 
    // or better, just select * limit 1 and print keys.
    const { data, error } = await supabase.from('questions').select('*').limit(1);

    if (error) {
        console.error('Error selecting from questions:', error);
    } else {
        console.log('Successfully selected from questions.');
        if (data && data.length > 0) {
            console.log('Columns found in first row:', Object.keys(data[0]));
        } else {
            console.log('Table is empty, cannot infer columns from data.');
            // Try to insert a dummy row to force an error or success
            const { error: insertError } = await supabase.from('questions').insert({
                text: 'Schema Test',
                asked_in_bits: true
            });
            if (insertError) {
                console.error('Insert test failed:', insertError);
            } else {
                console.log('Insert test successful! Column asked_in_bits exists.');
                // Clean up
                await supabase.from('questions').delete().eq('text', 'Schema Test');
            }
        }
    }
};

inspectSchema();
