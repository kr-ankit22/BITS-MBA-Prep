
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

const COMPANY_DOMAINS: { [key: string]: string } = {
    "Abbott": "abbott.com",
    "Accenture AIOC": "accenture.com",
    "Accenture Strategy": "accenture.com",
    "Aditya Birla Management Corp.": "adityabirla.com",
    "Amazon": "amazon.com",
    "Credit Suisse": "credit-suisse.com",
    "EY": "ey.com",
    "Guidewire Software": "guidewire.com",
    "HSBC": "hsbc.com",
    "IDFC First Bank": "idfcfirstbank.com",
    "Indian Bank": "indianbank.in",
    "JPMorgan Chase": "jpmorganchase.com",
    "Kyoren Labs": "kyorenlabs.com",
    "LenDen Club": "lendenclub.com",
    "Liquidmind.ai": "liquidmind.ai",
    "MiQ": "miq.com",
    "Mitigata": "mitigata.com",
    "Moody's Analytics": "moodysanalytics.com",
    "Noccarc Robotics": "noccarc.com",
    "Raaz App": "raaz.app",
    "Reliance Industries - AJIO": "ajio.com",
    "Sodexo": "sodexo.com",
    "Tata Capital": "tatacapital.com",
    "Taurus Mutual Funds": "taurusmutualfund.com",
    "Vodafone-Idea": "myvi.in"
};

const updateLogos = async () => {
    console.log('Updating company logos...');

    const { data: companies, error } = await supabase
        .from('companies')
        .select('id, name');

    if (error) {
        console.error('Error fetching companies:', error);
        return;
    }

    console.log(`Found ${companies.length} companies to update.`);

    for (const company of companies) {
        const domain = COMPANY_DOMAINS[company.name];
        if (!domain) {
            console.warn(`No domain mapping found for company: ${company.name}`);
            continue;
        }

        const logoUrl = `https://logo.clearbit.com/${domain}`;

        const { error: updateError } = await supabase
            .from('companies')
            .update({ logo: logoUrl })
            .eq('id', company.id);

        if (updateError) {
            console.error(`Error updating logo for ${company.name}:`, updateError);
        } else {
            console.log(`Updated logo for ${company.name} to ${logoUrl}`);
        }
    }

    console.log('Logo update complete!');
};

updateLogos();
