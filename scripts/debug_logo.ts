
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

const checkUrl = (url: string) => {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            console.log(`URL: ${url}`);
            console.log(`Status: ${res.statusCode}`);
            console.log(`Headers: ${JSON.stringify(res.headers)}`);
            resolve(res.statusCode);
        }).on('error', (e) => {
            console.error(`Error: ${e.message}`);
            resolve(500);
        });
    });
};

const debug = async () => {
    console.log('Fetching one company...');
    const { data, error } = await supabase.from('companies').select('*').limit(1);

    if (error) {
        console.error(error);
        return;
    }

    if (!data || data.length === 0) {
        console.log('No companies found.');
        return;
    }

    const company = data[0];
    console.log(`Company: ${company.name}`);
    console.log(`Stored Logo: ${company.logo}`);

    if (company.logo && company.logo.startsWith('http')) {
        await checkUrl(company.logo);
    } else {
        console.log('Logo field is empty or invalid.');
    }
};

debug();
