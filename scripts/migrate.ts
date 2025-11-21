
import { createClient } from '@supabase/supabase-js';
import { COMPANIES, RESOURCES } from '../constants';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const migrate = async () => {
    console.log('Starting migration...');

    // Migrate Companies
    console.log('Migrating companies...');
    for (const company of COMPANIES) {
        // Upsert based on name to avoid duplicates if they already exist
        const { error } = await supabase.from('companies').upsert({
            name: company.name,
            sector: company.sector,
            logo: company.logo,
            description: company.description,
            roles: company.roles
        }, { onConflict: 'name' });

        if (error) {
            console.error(`Error migrating company ${company.name}:`, error);
        } else {
            console.log(`Migrated company: ${company.name}`);
        }
    }

    // Migrate Resources
    console.log('Migrating resources...');
    for (const resource of RESOURCES) {
        const { error } = await supabase.from('resources').insert({
            title: resource.title,
            url: resource.url,
            description: resource.description,
            category: resource.category,
            source: resource.source,
            duration: resource.duration
        });
        if (error) {
            console.error(`Error migrating resource ${resource.title}:`, error);
        } else {
            console.log(`Migrated resource: ${resource.title}`);
        }
    }

    console.log('Migration complete! (Skipped questions as per user request)');
};

migrate();
