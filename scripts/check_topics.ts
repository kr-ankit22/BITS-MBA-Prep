
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

async function checkTopics() {
    console.log('Checking topics in "questions" table...');

    const { data, error } = await supabase
        .from('questions')
        .select('topic')
        .order('topic');

    if (error) {
        console.error('Error fetching topics:', error);
        return;
    }

    if (!data || data.length === 0) {
        console.log('No questions found.');
        return;
    }

    // Get unique topics
    const uniqueTopics = [...new Set(data.map((q: any) => q.topic))];

    console.log(`Found ${uniqueTopics.length} unique topics:`);
    uniqueTopics.forEach(topic => {
        console.log(`- [${topic.length} chars] ${topic.substring(0, 50)}${topic.length > 50 ? '...' : ''}`);
    });

    // Check for suspicious topics (too long)
    const suspicious = uniqueTopics.filter(t => t.length > 50);
    if (suspicious.length > 0) {
        console.log('\n⚠️  SUSPICIOUS TOPICS FOUND (Likely Descriptions):');
        suspicious.forEach(t => console.log(`- ${t}`));
    } else {
        console.log('\n✅ No obviously suspicious topics (length > 50) found.');
    }
}

checkTopics();
