
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { LogoService } from '../services/logoService'; // Uses the new Search logic

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

const migrate = async () => {
    console.log('Fetching companies for Search-First migration...');
    const { data: companies, error } = await supabase.from('companies').select('*');
    if (error) {
        console.error(error);
        return;
    }

    console.log(`Processing ${companies.length} companies...`);

    for (const company of companies) {
        // Use the new service which tries Search API -> Guess -> Unavatar
        const newLogoUrl = await LogoService.getLogoUrl(company.name);

        console.log(`[${company.name}]: ${newLogoUrl}`);

        if (newLogoUrl && newLogoUrl !== company.logo) {
            const { error: upErr } = await supabase
                .from('companies')
                .update({ logo: newLogoUrl })
                .eq('id', company.id);
            if (upErr) console.error(`Failed to update ${company.name}`);
        }
    }
    console.log('Done.');
};

migrate();
