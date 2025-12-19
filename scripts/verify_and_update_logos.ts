
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

const LOGO_DEV_KEY = 'pk_UWOqpPygSO-A2Tpc-uUYpg';

// Manual Overrides for tricky domains
const DOMAIN_OVERRIDES: Record<string, string> = {
    "Moody's Analytics": 'moodys.com',
    'Taurus Mutual Funds': 'taurusmutualfund.com',
    'Noccarc Robotics': 'noccarc.com',
    'Raaz App': 'raaz.co.in',
    'Reliance Industries - AJIO': 'ajio.com',
    'MiQ': 'miqdigital.com',
    'Vodafone-Idea': 'myvi.in',
    'Lenden': 'lendenclub.com',
    'Kyoren': 'kyoren.com',
    'Guidewire': 'guidewire.com',
    'Liquidmind.ai': 'liquidmind.ai',
    'Aditya Birla Management Corp.': 'adityabirla.com',
    'Accenture AIOC': 'accenture.com',
    'Sodexo': 'sodexo.com',
    'Tata Capital': 'tatacapital.com',
    'Indian Bank': 'indianbank.in'
};

const checkUrl = (url: string): Promise<number> => {
    return new Promise((resolve) => {
        const req = https.get(url, (res) => {
            resolve(res.statusCode || 500);
        });
        req.on('error', () => resolve(500));
    });
};

const verifyAndUpdate = async () => {
    console.log('Fetching companies...');
    const { data: companies, error } = await supabase.from('companies').select('*');
    if (error || !companies) {
        console.error('Fetch error:', error);
        return;
    }

    console.log(`Processing ${companies.length} companies...`);

    for (const company of companies) {
        let domain = DOMAIN_OVERRIDES[company.name] ||
            `${company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

        // Strategy 1: Logo.dev
        const logoDevUrl = `https://img.logo.dev/${domain}?token=${LOGO_DEV_KEY}`;
        let status = await checkUrl(logoDevUrl);

        let finalUrl = '';

        if (status === 200) {
            console.log(`✅ [Logo.dev] ${company.name} (${domain})`);
            finalUrl = logoDevUrl;
        } else {
            console.log(`⚠️ [Logo.dev Failed ${status}] ${company.name} (${domain}) - Trying fallback...`);

            // Strategy 2: Unavatar (uses Clearbit/DuckDuckGo/Google)
            const unavatarUrl = `https://unavatar.io/${domain}`;
            status = await checkUrl(unavatarUrl);

            if (status === 200) {
                console.log(`✅ [Unavatar] ${company.name}`);
                finalUrl = unavatarUrl;
            } else {
                console.log(`❌ [All Failed] ${company.name} - Keeping initials.`);
                finalUrl = ''; // Or keep existing if we want
            }
        }

        if (finalUrl) {
            const { error: upErr } = await supabase
                .from('companies')
                .update({ logo: finalUrl })
                .eq('id', company.id);

            if (upErr) console.error(`   DB Update Failed: ${upErr.message}`);
        }
    }
    console.log('Verification & Update Complete.');
};

verifyAndUpdate();
