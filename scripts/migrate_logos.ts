
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const PK_KEY = 'pk_UWOqpPygSO-A2Tpc-uUYpg';

const guessDomain = (name: string): string => {
    const cleanName = name.toLowerCase().trim();
    if (cleanName.includes('.')) return cleanName; // e.g. liquidmind.ai
    return `${cleanName.replace(/[^a-z0-9]/g, '')}.com`;
};

const migrateLogos = async () => {
    console.log('Fetching companies...');
    const { data: companies, error } = await supabase.from('companies').select('*');

    if (error) {
        console.error('Error fetching companies:', error);
        return;
    }

    console.log(`Found ${companies.length} companies.`);

    for (const company of companies) {
        const domain = guessDomain(company.name);
        const newLogo = `https://img.logo.dev/${domain}?token=${PK_KEY}`;

        // Skip if already updated (optimization)
        if (company.logo && company.logo.includes('logo.dev') && company.logo === newLogo) {
            console.log(`Skipping ${company.name} (already updated)`);
            continue;
        }

        console.log(`Updating ${company.name}: ${company.logo} -> ${newLogo}`);

        const { error: updateError } = await supabase
            .from('companies')
            .update({ logo: newLogo })
            .eq('id', company.id);

        if (updateError) {
            console.error(`Failed to update ${company.name}:`, updateError);
        }
    }

    console.log('Migration complete.');
};

migrateLogos();
