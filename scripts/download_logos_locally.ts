
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const LOGO_DIR = path.join(__dirname, '../public/logos');

const ensureDirectoryExists = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
};

const downloadImage = async (url: string, filepath: string): Promise<boolean> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.warn(`Failed to fetch logo from ${url}: ${response.status} ${response.statusText}`);
            return false;
        }

        // Check content type to ensure it's an image
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.startsWith('image/')) {
            console.warn(`Invalid content type from ${url}: ${contentType}`);
            return false;
        }

        const buffer = await response.arrayBuffer();
        fs.writeFileSync(filepath, Buffer.from(buffer));
        return true;
    } catch (error) {
        console.error(`Error downloading ${url}:`, error);
        return false;
    }
};

const run = async () => {
    console.log('Starting logo download process...');
    ensureDirectoryExists(LOGO_DIR);

    const { data: companies, error } = await supabase
        .from('companies')
        .select('id, name');

    if (error) {
        console.error('Error fetching companies from DB:', error);
        return;
    }

    console.log(`Found ${companies.length} companies.`);

    for (const company of companies) {
        const domain = COMPANY_DOMAINS[company.name];
        if (!domain) {
            console.warn(`No domain mapping for: ${company.name}`);
            continue;
        }

        // Clean filename
        const safeName = company.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const filename = `${safeName}.png`;
        const localPath = `/logos/${filename}`;
        const filePath = path.join(LOGO_DIR, filename);

        // Try downloading from Logo.dev
        const LOGO_DEV_TOKEN = 'pk_UWOqpPygSO-A2Tpc-uUYpg';
        let success = false;

        // 1. Try Logo.dev
        const logoUrl = `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=128&format=png`;
        console.log(`Downloading logo for ${company.name} from Logo.dev...`);
        success = await downloadImage(logoUrl, filePath);

        // 2. Fallback to Unavatar
        if (!success) {
            console.log(`Logo.dev failed for ${company.name}. Falling back to Unavatar...`);
            const unavatarUrl = `https://unavatar.io/${domain}?fallback=false`;
            success = await downloadImage(unavatarUrl, filePath);
        }

        if (success) {
            // Update DB with local path
            const { error: updateError } = await supabase
                .from('companies')
                .update({ logo: localPath })
                .eq('id', company.id);

            if (updateError) {
                console.error(`Failed to update DB for ${company.name}:`, updateError);
            } else {
                console.log(`Updated ${company.name} -> ${localPath}`);
            }
        } else {
            console.error(`Could not download logo for ${company.name}. Keeping existing value.`);
        }
    }

    console.log('Logo update process finished.');
};

run();
