
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

async function testAuth() {
    console.log('Testing Supabase Auth API connectivity...');
    console.log(`Target URL: ${supabaseUrl}`);

    const start = Date.now();

    // Attempt to sign in with intentionally wrong credentials
    // If the service is UP, it should reject us quickly.
    // If the service is DOWN, it will timeout or return a 500/503.
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test_connectivity_check@example.com',
        password: 'this_is_a_wrong_password_12345'
    });

    const duration = Date.now() - start;

    if (error) {
        console.log(`\nResponse received in ${duration}ms`);
        console.log(`Status: ${error.status}`);
        console.log(`Message: ${error.message}`);

        if (error.message === 'Invalid login credentials') {
            console.log('\n✅ SUCCESS: Supabase Auth API is ONLINE and responding.');
            console.log('The service correctly rejected invalid credentials, which means the Auth server is active.');
        } else if (error.status && error.status >= 500) {
            console.log('\n❌ FAILURE: Supabase Auth API appears to be DOWN (Server Error).');
        } else {
            console.log('\n⚠️  UNCERTAIN: Received an unexpected error. The API might be reachable but returning errors.');
        }
    } else {
        // This shouldn't happen with wrong creds unless the account actually exists (unlikely)
        console.log('\n⚠️  Unexpected Success: Logged in? (This should not happen with fake creds)');
    }
}

testAuth();
