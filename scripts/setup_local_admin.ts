
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Read .env file manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: { [key: string]: string } = {};

envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        envVars[match[1].trim()] = match[2].trim();
    }
});

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const localAdmin = {
    email: 'admin@local.com',
    password: 'AdminPassword123!',
    role: 'admin',
    name: 'Local Super Admin',
    provider: 'local'
};

async function setupLocalAdmin() {
    console.log(`\nSetting up Local Admin: ${localAdmin.email}...`);

    // 1. Add to user_roles (Whitelist)
    const { data: existingRole, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('email', localAdmin.email)
        .maybeSingle();

    if (!existingRole) {
        console.log('Adding to whitelist...');
        const { error: insertError } = await supabase
            .from('user_roles')
            .insert({
                email: localAdmin.email,
                role: localAdmin.role,
                auth_provider: localAdmin.provider,
                full_name: localAdmin.name
            });
        if (insertError) console.error('Insert Error:', insertError.message);
        else console.log('Whitelisted successfully.');
    } else {
        console.log('Already in whitelist.');
    }

    // 2. Create Auth User
    console.log('Creating Auth user...');
    const { data, error: authError } = await supabase.auth.signUp({
        email: localAdmin.email,
        password: localAdmin.password,
        options: {
            data: {
                full_name: localAdmin.name,
                role: localAdmin.role
            }
        }
    });

    if (authError) {
        console.error('Auth Error:', authError.message);
    } else {
        console.log('Auth user ready. If email confirmation is ON, you might need to confirm it in Supabase dashboard.');
    }
}

setupLocalAdmin();
