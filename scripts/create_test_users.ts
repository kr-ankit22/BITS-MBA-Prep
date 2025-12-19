
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

console.log(`Using Supabase URL: ${supabaseUrl}`);
console.log(`Using Key: ${supabaseKey.substring(0, 5)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

const testUsers = [
    {
        email: 'faculty@test.com',
        password: 'Password@123',
        role: 'faculty',
        name: 'Test Faculty',
        provider: 'local'
    },
    {
        email: 'contributor@test.com',
        password: 'Password@123',
        role: 'contributor',
        name: 'Test Contributor',
        provider: 'local'
    }
];

async function createUsers() {
    for (const user of testUsers) {
        console.log(`\nProcessing ${user.email}...`);

        // 1. Add to user_roles (Whitelist)
        // Check if exists first
        const { data: existingRole, error: roleCheckError } = await supabase
            .from('user_roles')
            .select('*')
            .eq('email', user.email)
            .single();

        if (roleCheckError && roleCheckError.code !== 'PGRST116') { // PGRST116 is 'not found'
            console.error(`Error checking role: ${roleCheckError.message}`);
        }

        if (!existingRole) {
            console.log(`Adding ${user.email} to user_roles (whitelist)...`);
            const { error: insertError } = await supabase
                .from('user_roles')
                .insert({
                    email: user.email,
                    role: user.role,
                    auth_provider: user.provider,
                    full_name: user.name
                });

            if (insertError) {
                console.error(`Failed to insert into user_roles: ${insertError.message}`);
                console.log('Skipping auth creation due to whitelist failure.');
                continue;
            } else {
                console.log('Successfully added to whitelist.');
            }
        } else {
            console.log(`${user.email} is already in user_roles.`);
        }

        // 2. Create Auth User
        console.log(`Creating Auth user for ${user.email}...`);
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
            options: {
                data: {
                    full_name: user.name,
                    role: user.role // storing role in metadata too just in case
                }
            }
        });

        if (authError) {
            console.error(`Auth Error: ${authError.message}`);
            if (authError.message.includes('already registered')) {
                console.log('User already registered in Auth.');
            }
        } else {
            if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
                console.log('User already exists (Auth).');
            } else {
                console.log(`Auth user created! ID: ${authData.user?.id}`);
                if (!authData.session) {
                    console.warn('NOTE: Email confirmation may be required depending on project settings.');
                }
            }
        }
    }
}

createUsers();
