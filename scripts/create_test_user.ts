
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
    const email = 'test_admin_bits_prep@gmail.com';
    const password = 'password123';

    console.log(`Attempting to create user: ${email}`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error('Error creating user:', error.message);
        return;
    }

    if (data.user) {
        console.log('User created successfully!');
        console.log('ID:', data.user.id);
        console.log('Email:', data.user.email);

        if (data.session) {
            console.log('✅ Session created! Auto-confirm is likely ENABLED.');
            console.log('You can log in immediately.');
        } else {
            console.log('⚠️  User created but NO session. Email confirmation might be required.');
            console.log('Since emails are down, you might not be able to log in unless "Enable Email Confirmations" is OFF in your project settings.');
        }
    }
}

createTestUser();
