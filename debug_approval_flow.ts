
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
    console.log('--- Starting Approval Workflow Debug ---');

    // 1. Login as Admin
    console.log('1. Attempting Admin Login...');
    const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'admin@local.com',
        password: 'AdminPassword123!'
    });

    if (loginError || !session) {
        console.error('Login Failed:', loginError?.message);
        return;
    }
    console.log('Login Success. User ID:', session.user.id);

    // 2. Create Dummy Experience
    console.log('\n2. Creating "Pending" Experience...');
    const { data: exp, error: createError } = await supabase
        .from('interview_experiences')
        .insert([{
            student_name: 'Test Bot',
            company_name: 'TEST_CORP',
            role: 'Debugger',
            status: 'pending',
            difficulty: 'Medium',
            outcome: 'Waitlisted',
            overall_experience: 'Testing persistence',
            rounds_snapshot: []
        }])
        .select()
        .single();

    if (createError) {
        console.error('Create Failed:', createError.message);
        return;
    }
    console.log('Experience Created:', exp.id, '| Status:', exp.status);

    // 3. Attempt Approval (The Critical Step)
    console.log('\n3. Attempting Approval (UPDATE status="approved")...');
    const { data: updateData, error: updateError } = await supabase
        .from('interview_experiences')
        .update({ status: 'approved' })
        .eq('id', exp.id)
        .select()
        .single();

    if (updateError) {
        console.error('❌ UPDATE FAILED. RLS or DB Error:', updateError.message);
        console.error('Details:', updateError);
    } else {
        console.log('✅ UPDATE API Call Success. Returned Status:', updateData?.status);
    }

    // 4. Verification Check (Read back)
    console.log('\n4. Verifying Persistence (Read back from DB)...');
    const { data: checkData, error: checkError } = await supabase
        .from('interview_experiences')
        .select('*')
        .eq('id', exp.id)
        .single();

    if (checkData?.status === 'approved') {
        console.log('✅ PASS: Persistence Verified. Status is "approved".');
    } else {
        console.error('❌ FAIL: Persistence Failed. Status is:', checkData?.status);
        console.warn('Hypothesis: RLS Policy allowed SELECT/INSERT but blocked UPDATE silently?');
    }

    // Cleanup
    console.log('\n5. Cleaning up test data...');
    await supabase.from('interview_experiences').delete().eq('id', exp.id);
    console.log('Done.');
}

runTest();
