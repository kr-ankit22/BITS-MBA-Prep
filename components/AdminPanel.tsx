import React, { useState, useRef } from 'react';
import { Question, Resource, Company, Recommendation, RecommendationSubject, Difficulty, Topic } from '../types';
import { IconUpload, IconCheckCircle, IconX, IconDatabase, IconBriefcase, IconBook, IconUser, IconLink } from './Icons';
import { readFileContent, parseCSV, validateHeaders } from '../utils/csvHelpers';
import { supabase } from '../services/supabaseClient';

interface UserRoleData {
    id: string;
    email: string;
    role: 'admin' | 'faculty' | 'student';
    auth_provider: 'google' | 'local';
    full_name?: string;
    created_at: string;
}

interface AdminPanelProps {
    onAddQuestion: (q: Question) => void;
    onAddResource: (r: Resource) => void;
    onAddRecommendation: (rec: Recommendation) => void;
    companies: Company[];
    onAddCompany: (c: Company) => Promise<Company | null>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onAddQuestion, onAddResource, onAddRecommendation, companies, onAddCompany }) => {
    const [activeTab, setActiveTab] = useState<'question' | 'resource' | 'recommendation' | 'users'>('question');
    const [users, setUsers] = useState<UserRoleData[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStats, setUploadStats] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Question Form State
    const [qCompany, setQCompany] = useState('');
    const [qDomain, setQDomain] = useState('');
    const [qRole, setQRole] = useState('');
    const [qTopic, setQTopic] = useState<Topic>(Topic.General);
    const [qDifficulty, setQDifficulty] = useState<Difficulty>(Difficulty.Medium);
    const [qText, setQText] = useState('');
    const [qApproach, setQApproach] = useState('');
    const [qAskedBits, setQAskedBits] = useState(false);

    // Resource Form State
    const [rTitle, setRTitle] = useState('');
    const [rUrl, setRUrl] = useState('');
    const [rDesc, setRDesc] = useState('');
    const [rCategory, setRCategory] = useState('General');
    const [rSource, setRSource] = useState('');
    const [rDuration, setRDuration] = useState('');

    // Recommendation Form State
    const [recTitle, setRecTitle] = useState('');
    const [recFaculty, setRecFaculty] = useState('');
    const [recUrl, setRecUrl] = useState('');
    const [recSubject, setRecSubject] = useState<RecommendationSubject>(RecommendationSubject.Python);
    const [recDesc, setRecDesc] = useState('');
    const [recGoal, setRecGoal] = useState('');
    const [recLearning, setRecLearning] = useState('');
    const [recRemarks, setRecRemarks] = useState('');
    const [recTime, setRecTime] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // User Form State
    const [uEmail, setUEmail] = useState('');
    const [uRole, setURole] = useState<'admin' | 'faculty' | 'student'>('student');
    const [uProvider, setUProvider] = useState<'google' | 'local'>('google');
    const [uName, setUName] = useState('');

    // Fetch Users
    React.useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('user_roles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching users:', error);
        else setUsers(data as UserRoleData[]);
    };


    // --- Submit Handlers ---

    const handleQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let companyId = '';
        let companyName = qCompany;

        const existingCompany = companies.find(c => c.name === qCompany);
        if (existingCompany) {
            companyId = existingCompany.id;
            companyName = existingCompany.name;
        } else {
            // Create new company
            const newCompany: Company = {
                id: '', // DB will assign
                name: qCompany,
                sector: qDomain || 'General',
                logo: `https://logo.clearbit.com/${qCompany.toLowerCase().replace(/\s/g, '')}.com`,
                description: 'Added via Admin Panel.',
                roles: qRole ? [qRole] : []
            };
            try {
                const savedCompany = await onAddCompany(newCompany);
                if (savedCompany) {
                    companyId = savedCompany.id;
                    companyName = savedCompany.name;
                } else {
                    alert('Failed to create company.');
                    return;
                }
            } catch (error) {
                console.error('Error creating company:', error);
                alert('Error creating company.');
                return;
            }
        }

        const newQuestion: Question = {
            id: `q_admin_${Date.now()}`,
            companyId: companyId,
            companyName: companyName,
            domain: qDomain || 'General',
            role: qRole || 'General',
            topic: qTopic,
            difficulty: qDifficulty,
            text: qText,
            idealApproach: qApproach,
            askedInBITS: qAskedBits,
            frequency: 1
        };
        onAddQuestion(newQuestion);
        setSuccessMsg('Question added successfully!');

        // Reset form
        setQCompany(''); setQDomain(''); setQRole(''); setQTopic(Topic.General); setQDifficulty(Difficulty.Medium);
        setQText(''); setQApproach(''); setQAskedBits(false);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleResourceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newResource: Resource = {
            id: `r_admin_${Date.now()}`,
            title: rTitle,
            url: rUrl,
            description: rDesc,
            category: rCategory,
            source: rSource,
            duration: rDuration
        };
        onAddResource(newResource);
        setSuccessMsg('Resource added successfully!');

        // Reset form
        setRTitle(''); setRUrl(''); setRDesc(''); setRCategory('General'); setRSource(''); setRDuration('');
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleRecSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newRec: Recommendation = {
            id: `rec_admin_${Date.now()}`,
            facultyName: recFaculty,
            date: new Date().toLocaleDateString(),
            title: recTitle,
            url: recUrl || undefined,
            description: recDesc,
            subject: recSubject,
            goal: recGoal,
            expectedLearning: recLearning,
            remarks: recRemarks || undefined,
            timeToComplete: recTime || undefined
        };
        onAddRecommendation(newRec);
        setSuccessMsg('Recommendation added successfully!');

        // Reset
        setRecTitle(''); setRecFaculty(''); setRecUrl(''); setRecDesc('');
        setRecGoal(''); setRecLearning(''); setRecRemarks(''); setRecTime('');
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Domain Check for Google
        if (uProvider === 'google' && !uEmail.endsWith('@pilani.bits-pilani.ac.in')) {
            alert('Google Login requires a @pilani.bits-pilani.ac.in email address.');
            return;
        }

        const { error } = await supabase.from('user_roles').insert({
            email: uEmail,
            role: uRole,
            auth_provider: uProvider,
            full_name: uName
        });

        if (error) {
            alert('Error adding user: ' + error.message);
        } else {
            setSuccessMsg('User added to whitelist successfully!');
            setUEmail(''); setUName('');
            fetchUsers(); // Refresh list
            setTimeout(() => setSuccessMsg(''), 3000);
        }
    };

    // --- CSV Logic ---

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);
        setUploadStats(null);

        try {
            setUploadProgress(10);
            const text = await readFileContent(file);
            setUploadProgress(30);
            const rows = parseCSV(text);
            setUploadProgress(50);

            let results;
            if (activeTab === 'question') {
                results = await processQuestions(rows);
            } else if (activeTab === 'resource') {
                results = processResources(rows);
            } else if (activeTab === 'recommendation') {
                results = processRecommendations(rows);
            } else {
                results = await processUsers(rows);
            }

            setUploadProgress(100);
            setUploadStats(results);
            if (fileInputRef.current) fileInputRef.current.value = '';

        } catch (error: any) {
            console.error(error);
            setUploadStats({ success: 0, failed: 1, errors: ['Failed to read or parse file: ' + error.message] });
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    const processQuestions = async (rows: string[][]) => {
        let success = 0;
        let failed = 0;
        const errors: string[] = [];

        // Expected: Company,Domain,Role,Topic,Difficulty,Question,Ideal_Approach,Asked_In_BITS
        if (rows.length < 2) return { success: 0, failed: 0, errors: ['File is empty or missing header row'] };

        const headers = rows[0];
        const expectedHeaders = ['Company', 'Domain', 'Role', 'Topic', 'Difficulty', 'Question', 'Ideal_Approach', 'Asked_In_BITS'];

        if (!validateHeaders(headers, expectedHeaders)) {
            return {
                success: 0,
                failed: rows.length - 1,
                errors: [`Invalid CSV Format. Expected headers: ${expectedHeaders.join(', ')}. Found: ${headers.join(', ')}`]
            };
        }

        // Pass 1: Identify Companies to create or update
        const processedCompanies = new Map<string, Company>(); // Key: CompanyName
        const uniqueCompanyNames = Array.from(new Set(rows.slice(1).map(r => r[0]?.trim()).filter(Boolean)));

        for (const cName of uniqueCompanyNames) {
            let existing = companies.find(c => c.name === cName);

            if (existing) {
                processedCompanies.set(cName, existing);
            } else {
                // Find the first row for this company to get its domain/role
                const rowForCompany = rows.slice(1).find(r => r[0]?.trim() === cName);
                const cDomain = rowForCompany ? rowForCompany[1]?.trim() : 'General';
                const cRole = rowForCompany ? rowForCompany[2]?.trim() : '';

                const newC: Company = {
                    id: '', // DB will assign
                    name: cName,
                    sector: cDomain || 'General',
                    logo: `https://logo.clearbit.com/${cName.toLowerCase().replace(/\s/g, '')}.com`,
                    description: 'Added via Bulk Upload.',
                    roles: cRole ? [cRole] : []
                };

                try {
                    const savedC = await onAddCompany(newC);
                    if (savedC) {
                        processedCompanies.set(cName, savedC);
                    } else {
                        errors.push(`Failed to create company: ${cName}`);
                    }
                } catch (err: any) {
                    errors.push(`Error creating company ${cName}: ${err.message}`);
                }
            }
        }

        // Pass 2: Create Questions
        for (let index = 0; index < rows.slice(1).length; index++) {
            const row = rows.slice(1)[index];
            const lineNum = index + 2;
            if (row.length < 6) {
                failed++;
                if (row.length > 0) errors.push(`Line ${lineNum}: Not enough fields (found ${row.length}, expected min 6).`);
                continue;
            }

            try {
                const cName = row[0]?.trim();
                const questionText = row[5];
                if (!questionText) throw new Error("Missing 'Question' text.");

                const companyObj = processedCompanies.get(cName);
                if (!companyObj) {
                    throw new Error(`Company '${cName}' could not be found or created.`);
                }

                const companyId = companyObj.id;

                const q: Question = {
                    id: `q_bulk_${Date.now()}_${index}`,
                    companyId: companyId,
                    companyName: cName || 'Unknown',
                    domain: row[1] || 'General',
                    role: row[2] || 'General',
                    topic: (Object.values(Topic).includes(row[3] as Topic) ? row[3] : Topic.General) as Topic,
                    difficulty: (['Easy', 'Medium', 'Hard'].includes(row[4]) ? row[4] : 'Medium') as Difficulty,
                    text: questionText,
                    idealApproach: row[6] || '',
                    askedInBITS: row[7]?.toLowerCase() === 'yes' || row[7]?.toLowerCase() === 'true',
                    frequency: 1
                };
                onAddQuestion(q);
                success++;
            } catch (e: any) {
                failed++;
                errors.push(`Line ${lineNum}: ${e.message}`);
            }
        }

        return { success, failed, errors };
    };

    const processResources = (rows: string[][]) => {
        let success = 0;
        let failed = 0;
        const errors: string[] = [];

        // Expected: Title,URL,Description,Category,Source,Duration
        if (rows.length < 2) return { success: 0, failed: 0, errors: ['File is empty or missing header row'] };

        const headers = rows[0];
        const expectedHeaders = ['Title', 'URL', 'Description', 'Category', 'Source', 'Duration'];

        if (!validateHeaders(headers, expectedHeaders)) {
            return {
                success: 0,
                failed: rows.length - 1,
                errors: [`Invalid CSV Format. Expected headers: ${expectedHeaders.join(', ')}. Found: ${headers.join(', ')}`]
            };
        }

        rows.slice(1).forEach((row, index) => {
            const lineNum = index + 2;
            if (row.length < 3) {
                failed++;
                if (row.length > 0) errors.push(`Line ${lineNum}: Not enough fields (found ${row.length}, expected min 3).`);
                return;
            }

            try {
                const title = row[0];
                const url = row[1];

                if (!title) throw new Error("Missing 'Title'.");
                if (!url) throw new Error("Missing 'URL'.");

                const r: Resource = {
                    id: `r_bulk_${Date.now()}_${index}`,
                    title: title,
                    url: url,
                    description: row[2] || '',
                    category: row[3] || 'General',
                    source: row[4] || 'External',
                    duration: row[5] || 'Self-paced'
                };
                onAddResource(r);
                success++;
            } catch (e: any) {
                failed++;
                errors.push(`Line ${lineNum}: ${e.message}`);
            }
        });

        return { success, failed, errors };
    };

    const processRecommendations = (rows: string[][]) => {
        let success = 0;
        let failed = 0;
        const errors: string[] = [];

        // Expected: Faculty Name, Title, URL, Description, Subject, Goal, Expected Learning, Remarks, Time Estimate
        if (rows.length < 2) return { success: 0, failed: 0, errors: ['File is empty'] };

        const headers = rows[0];
        const expected = ['Faculty Name', 'Title', 'URL', 'Description', 'Subject', 'Goal', 'Expected Learning', 'Remarks', 'Time Estimate'];
        if (!validateHeaders(headers, expected)) {
            return { success: 0, failed: rows.length - 1, errors: [`Invalid Headers. Expected: ${expected.join(', ')}`] };
        }

        rows.slice(1).forEach((row, idx) => {
            const lineNum = idx + 2;
            try {
                if (row.length < 7) throw new Error('Missing required fields');

                const subjectStr = row[4];
                const validSubjects = Object.values(RecommendationSubject);
                const subject = validSubjects.includes(subjectStr as RecommendationSubject)
                    ? (subjectStr as RecommendationSubject)
                    : RecommendationSubject.Python;

                const rec: Recommendation = {
                    id: `rec_bulk_${Date.now()}_${idx}`,
                    facultyName: row[0],
                    date: new Date().toLocaleDateString(),
                    title: row[1],
                    url: row[2] || undefined,
                    description: row[3],
                    subject: subject,
                    goal: row[5],
                    expectedLearning: row[6],
                    remarks: row[7] || undefined,
                    timeToComplete: row[8] || undefined
                };
                onAddRecommendation(rec);
                success++;
            } catch (e: any) {
                failed++;
                errors.push(`Line ${lineNum}: ${(e as Error).message}`);
            }
        });
        return { success, failed, errors };
    };

    const processUsers = async (rows: string[][]) => {
        let success = 0;
        let failed = 0;
        const errors: string[] = [];

        if (rows.length < 2) return { success: 0, failed: 0, errors: ['File is empty'] };

        const headers = rows[0];
        const expected = ['Email', 'Role', 'Auth Provider', 'Name'];
        if (!validateHeaders(headers, expected)) {
            return { success: 0, failed: rows.length - 1, errors: [`Invalid Headers. Expected: ${expected.join(', ')}`] };
        }

        for (let i = 0; i < rows.slice(1).length; i++) {
            const row = rows.slice(1)[i];
            const lineNum = i + 2;
            try {
                if (row.length < 3) throw new Error('Missing required fields');

                const email = row[0]?.trim();
                const role = row[1]?.trim().toLowerCase();
                const provider = row[2]?.trim().toLowerCase();
                const name = row[3]?.trim();

                if (!['admin', 'faculty', 'student'].includes(role)) throw new Error(`Invalid role: ${role}`);
                if (!['google', 'local'].includes(provider)) throw new Error(`Invalid provider: ${provider}`);

                if (provider === 'google' && !email.endsWith('@pilani.bits-pilani.ac.in')) {
                    throw new Error('Google provider requires @pilani.bits-pilani.ac.in email');
                }

                const { error } = await supabase.from('user_roles').insert({
                    email,
                    role,
                    auth_provider: provider,
                    full_name: name
                });

                if (error) throw error;
                success++;
            } catch (e: any) {
                failed++;
                errors.push(`Line ${lineNum}: ${e.message}`);
            }
        }
        fetchUsers(); // Refresh list after upload
        return { success, failed, errors };
    };

    const downloadTemplate = (tab: 'question' | 'resource' | 'recommendation' | 'users') => {
        let headers = '';
        let content = '';
        let filename = '';

        if (tab === 'question') {
            headers = 'Company,Domain,Role,Topic,Difficulty,Question,Ideal_Approach,Asked_In_BITS\n';
            content = 'Google,Tech,Software Engineer,Algorithms,Hard,"Describe merge sort.","Explain the divide and conquer strategy, then detail the steps of splitting, sorting, and merging. Analyze time complexity.","yes"';
            filename = 'questions_template.csv';
        } else if (tab === 'resource') {
            headers = 'Title,URL,Description,Category,Source,Duration\n';
            content = 'Complete Python Bootcamp,https://www.udemy.com/course/complete-python-bootcamp/,A comprehensive course on Python programming,Python,Udemy,40 hours';
            filename = 'resources_template.csv';
        } else if (tab === 'recommendation') {
            headers = 'Faculty Name,Title,URL,Description,Subject,Goal,Expected Learning,Remarks,Time Estimate\n';
            content = 'Dr. Smith,Pandas 101,https://pandas.pydata.org,Intro to Pandas,Python,Basics,Dataframes,"Good start",1 Hour';
            filename = 'recommendations_template_admin.csv';
        } else {
            headers = 'Email,Role,Auth Provider,Name\n';
            content = 'faculty@pilani.bits-pilani.ac.in,faculty,google,Dr. Sharma\nstudent@example.com,student,local,John Doe';
            filename = 'users_template.csv';
        }

        const blob = new Blob([headers + content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const inputStyle = "w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-bits-blue focus:border-bits-blue outline-none transition-all text-sm shadow-sm hover:border-gray-400 placeholder-gray-400";
    const labelStyle = "block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5 ml-1";

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Content Management</h2>
                    <p className="text-gray-500 mt-2 text-sm">Manage the interview database and learning resources for the cohort.</p>
                </div>

                <div className="bg-gray-100 p-1 rounded-lg border border-gray-200 shadow-inner inline-flex shrink-0">
                    <button
                        onClick={() => { setActiveTab('question'); setUploadStats(null); }}
                        className={`px-5 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'question' ? 'bg-white text-bits-blue shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                    >
                        <IconBriefcase className="w-4 h-4" /> Questions
                    </button>
                    <button
                        onClick={() => { setActiveTab('resource'); setUploadStats(null); }}
                        className={`px-5 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'resource' ? 'bg-white text-bits-blue shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                    >
                        <IconBook className="w-4 h-4" /> Resources
                    </button>
                    <button
                        onClick={() => { setActiveTab('recommendation'); setUploadStats(null); }}
                        className={`px-5 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'recommendation' ? 'bg-white text-bits-blue shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                    >
                        <IconUser className="w-4 h-4" /> Recommendations
                    </button>
                    <button
                        onClick={() => { setActiveTab('users'); setUploadStats(null); }}
                        className={`px-5 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-white text-bits-blue shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                    >
                        <IconUser className="w-4 h-4" /> Users
                    </button>
                </div>
            </div>

            {successMsg && (
                <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center gap-3 shadow-sm animate-in slide-in-from-top-2">
                    <IconCheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">{successMsg}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Form Column */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ring-1 ring-black/5">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                {activeTab === 'question' && <IconBriefcase className="w-5 h-5 text-bits-blue" />}
                                {activeTab === 'resource' && <IconBook className="w-5 h-5 text-bits-blue" />}
                                {activeTab === 'recommendation' && <IconUser className="w-5 h-5 text-bits-blue" />}
                                {activeTab === 'users' && <IconUser className="w-5 h-5 text-bits-blue" />}
                                {activeTab === 'question' ? 'New Interview Question' : activeTab === 'resource' ? 'New Curated Resource' : activeTab === 'recommendation' ? 'New Faculty Recommendation' : 'Add New User'}
                            </h3>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Entry Form</span>
                        </div>

                        <div className="p-6 md:p-8">
                            {activeTab === 'question' ? (
                                <form onSubmit={handleQuestionSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Company Name</label>
                                            <input list="companies" value={qCompany} onChange={e => setQCompany(e.target.value)} className={inputStyle} placeholder="e.g. Google" required />
                                            <datalist id="companies">
                                                {companies.map(c => <option key={c.id} value={c.name} />)}
                                            </datalist>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Domain</label>
                                            <input type="text" value={qDomain} onChange={e => setQDomain(e.target.value)} className={inputStyle} placeholder="e.g. Finance" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Role</label>
                                            <input type="text" value={qRole} onChange={e => setQRole(e.target.value)} className={inputStyle} placeholder="e.g. Product Manager" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Difficulty</label>
                                            <select value={qDifficulty} onChange={e => setQDifficulty(e.target.value as Difficulty)} className={inputStyle}>
                                                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        {/* Category Input Removed */}
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Topic</label>
                                            <select value={qTopic} onChange={e => setQTopic(e.target.value as Topic)} className={inputStyle}>
                                                {Object.values(Topic).map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={labelStyle}>Question Text <span className="text-red-500">*</span></label>
                                        <textarea value={qText} onChange={e => setQText(e.target.value)} rows={3} className={inputStyle} placeholder="Enter the full question text here..." required />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={labelStyle}>Ideal Approach (MBA Framework)</label>
                                        <textarea value={qApproach} onChange={e => setQApproach(e.target.value)} rows={4} className={inputStyle} placeholder="Example: Use the STAR method to explain... &#10;1. Situation...&#10;2. Task..." />
                                        <p className="text-xs text-gray-400 mt-1">Provide a structured answer guide for students.</p>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-lg border border-blue-100/50 hover:bg-blue-50 transition-colors">
                                        <input
                                            type="checkbox"
                                            id="bits"
                                            checked={qAskedBits}
                                            onChange={e => setQAskedBits(e.target.checked)}
                                            className="w-5 h-5 text-bits-blue rounded border-gray-300 focus:ring-bits-blue cursor-pointer"
                                        />
                                        <label htmlFor="bits" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                                            Verified: Asked in BITS Pilani Placements
                                        </label>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <button type="submit" className="w-full bg-bits-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-all shadow-md">
                                            <span>Save Question to Bank</span>
                                        </button>
                                    </div>
                                </form>
                            ) : activeTab === 'resource' ? (
                                <form onSubmit={handleResourceSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className={labelStyle}>Resource Title <span className="text-red-500">*</span></label>
                                            <input type="text" value={rTitle} onChange={e => setRTitle(e.target.value)} className={inputStyle} placeholder="e.g. Complete Python Bootcamp" required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Category</label>
                                            <select value={rCategory} onChange={e => setRCategory(e.target.value)} className={inputStyle}>
                                                <option value="Python">Python</option>
                                                <option value="SQL">SQL</option>
                                                <option value="Data Analytics">Data Analytics</option>
                                                <option value="Product">Product</option>
                                                <option value="Finance">Finance</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Source / Provider</label>
                                            <input type="text" value={rSource} onChange={e => setRSource(e.target.value)} className={inputStyle} placeholder="e.g. Coursera, YouTube" />
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className={labelStyle}>URL <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <IconLink className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <input type="url" value={rUrl} onChange={e => setRUrl(e.target.value)} className={`${inputStyle} pl-10`} placeholder="https://..." required />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className={labelStyle}>Description</label>
                                            <textarea value={rDesc} onChange={e => setRDesc(e.target.value)} rows={3} className={inputStyle} placeholder="Brief description of what this resource covers..." required />
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <button type="submit" className="w-full bg-bits-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-all shadow-md">
                                            Add Resource
                                        </button>
                                    </div>
                                </form>
                            ) : activeTab === 'recommendation' ? (
                                <form onSubmit={handleRecSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Faculty Name <span className="text-red-500">*</span></label>
                                            <input type="text" value={recFaculty} onChange={e => setRecFaculty(e.target.value)} className={inputStyle} required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Subject</label>
                                            <select value={recSubject} onChange={e => setRecSubject(e.target.value as RecommendationSubject)} className={inputStyle}>
                                                {Object.values(RecommendationSubject).map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className={labelStyle}>Title <span className="text-red-500">*</span></label>
                                            <input type="text" value={recTitle} onChange={e => setRecTitle(e.target.value)} className={inputStyle} required />
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className={labelStyle}>Description <span className="text-red-500">*</span></label>
                                            <textarea value={recDesc} onChange={e => setRecDesc(e.target.value)} rows={2} className={inputStyle} required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Goal <span className="text-red-500">*</span></label>
                                            <input type="text" value={recGoal} onChange={e => setRecGoal(e.target.value)} className={inputStyle} required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Expected Learning <span className="text-red-500">*</span></label>
                                            <input type="text" value={recLearning} onChange={e => setRecLearning(e.target.value)} className={inputStyle} required />
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className={labelStyle}>URL</label>
                                            <div className="relative">
                                                <IconLink className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <input type="url" value={recUrl} onChange={e => setRecUrl(e.target.value)} className={`${inputStyle} pl-10`} placeholder="https://..." />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className={labelStyle}>Remarks</label>
                                            <textarea value={recRemarks} onChange={e => setRecRemarks(e.target.value)} rows={2} className={inputStyle} placeholder="Any additional notes or context..." />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Time to Complete</label>
                                            <input type="text" value={recTime} onChange={e => setRecTime(e.target.value)} className={inputStyle} placeholder="e.g. 2 hours, 1 week" />
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <button type="submit" className="w-full bg-bits-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-all shadow-md">
                                            Add Recommendation
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleUserSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className={labelStyle}>Email Address <span className="text-red-500">*</span></label>
                                            <input type="email" value={uEmail} onChange={e => setUEmail(e.target.value)} className={inputStyle} placeholder="user@example.com" required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Role</label>
                                            <select value={uRole} onChange={e => setURole(e.target.value as any)} className={inputStyle}>
                                                <option value="student">Student</option>
                                                <option value="faculty">Faculty</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Auth Provider</label>
                                            <select value={uProvider} onChange={e => setUProvider(e.target.value as any)} className={inputStyle}>
                                                <option value="google">Google (BITS Email)</option>
                                                <option value="local">Local (Email/Pass)</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className={labelStyle}>Full Name (Optional)</label>
                                            <input type="text" value={uName} onChange={e => setUName(e.target.value)} className={inputStyle} placeholder="John Doe" />
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <button type="submit" className="w-full bg-bits-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-all shadow-md">
                                            Add User to Whitelist
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Bulk Upload Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ring-1 ring-black/5">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                            <IconUpload className="w-5 h-5 text-bits-blue" />
                            Bulk Upload
                        </h3>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            Upload a CSV file to add multiple {activeTab === 'question' ? 'questions' : activeTab === 'resource' ? 'resources' : activeTab === 'recommendation' ? 'recommendations' : 'users'} at once.
                            <br /><span className="text-xs text-gray-400">Ensure formatting matches the template.</span>
                        </p>

                        <div className="space-y-4">
                            <label className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer group bg-gray-50/50 block w-full
                        ${isUploading ? 'border-gray-300 bg-gray-100 cursor-wait' : 'border-gray-200 hover:border-bits-blue hover:bg-blue-50/30'}`}>
                                <div className="bg-white w-12 h-12 rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <IconUpload className="w-6 h-6 text-bits-blue" />
                                </div>
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-bits-blue">
                                    {isUploading ? 'Uploading...' : 'Click to upload CSV'}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1">Max file size: 5MB</p>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".csv"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                            </label>

                            {isUploading && (
                                <div className="mt-2">
                                    <div className="flex justify-between text-xs mb-1 font-medium text-gray-600">
                                        <span>Processing...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div className="bg-bits-blue h-2 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                </div>
                            )}

                            {uploadStats && (
                                <div className="mt-4 animate-in fade-in">
                                    <div className="flex gap-4 mb-4">
                                        <div className="flex-1 bg-green-50 border border-green-100 p-3 rounded-lg flex flex-col items-center justify-center">
                                            <span className="text-2xl font-bold text-green-600">{uploadStats.success}</span>
                                            <span className="text-xs font-medium text-green-800 uppercase">Success</span>
                                        </div>
                                        <div className="flex-1 bg-red-50 border border-red-100 p-3 rounded-lg flex flex-col items-center justify-center">
                                            <span className="text-2xl font-bold text-red-600">{uploadStats.failed}</span>
                                            <span className="text-xs font-medium text-red-800 uppercase">Failed</span>
                                        </div>
                                    </div>

                                    {uploadStats.errors.length > 0 && (
                                        <div className="bg-red-50 border border-red-100 rounded-lg p-3 max-h-48 overflow-y-auto">
                                            <h4 className="text-xs font-bold text-red-800 uppercase mb-2 flex items-center gap-1">
                                                <IconX className="w-4 h-4" /> Error Log
                                            </h4>
                                            <ul className="space-y-1">
                                                {uploadStats.errors.map((err, idx) => (
                                                    <li key={idx} className="text-xs text-red-700 font-mono border-b border-red-100 last:border-0 pb-1 last:pb-0 leading-normal">
                                                        • {err}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setUploadStats(null)}
                                        className="w-full mt-3 text-xs text-gray-500 hover:text-gray-800 underline text-center"
                                    >
                                        Dismiss Report
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={() => downloadTemplate(activeTab)}
                                disabled={isUploading}
                                className="w-full py-2.5 text-xs font-bold uppercase tracking-wide text-bits-blue bg-white hover:bg-blue-50 rounded-lg transition-colors border border-blue-100 flex items-center justify-center gap-2 shadow-sm"
                            >
                                <IconBriefcase className="w-4 h-4" />
                                Download CSV Template
                            </button>
                        </div>
                    </div>

                    {/* Help Card */}
                    <div className="bg-gradient-to-br from-bits-dark to-gray-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-5 rounded-full blur-2xl"></div>
                        <h3 className="font-bold text-lg mb-2 relative z-10">Admin Access</h3>
                        <p className="text-sm text-gray-300 mb-4 relative z-10 leading-relaxed">
                            You are currently logged in with administrator privileges. Changes made here directly affect the student dashboard.
                        </p>
                        <div className="text-xs text-gray-400 border-t border-gray-700/50 pt-4 flex justify-between items-center relative z-10">
                            <span>Status</span>
                            <span className="text-green-400 font-mono bg-green-400/10 px-2 py-1 rounded">Active</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Users List Table (Only visible in Users tab) */}
            {activeTab === 'users' && (
                <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <IconUser className="w-6 h-6 text-bits-blue" />
                        Registered Users ({users.length})
                    </h3>


                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-gray-900">Email</th>
                                        <th className="px-6 py-4 font-bold text-gray-900">Role</th>
                                        <th className="px-6 py-4 font-bold text-gray-900">Provider</th>
                                        <th className="px-6 py-4 font-bold text-gray-900">Name</th>
                                        <th className="px-6 py-4 font-bold text-gray-900">Created At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                No users found. Add one above.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((u) => (
                                            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-3 font-medium text-gray-900">{u.email}</td>
                                                <td className="px-6 py-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                        ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                            u.role === 'faculty' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-gray-500 capitalize">{u.auth_provider}</td>
                                                <td className="px-6 py-3 text-gray-500">{u.full_name || '-'}</td>
                                                <td className="px-6 py-3 text-gray-400 text-xs">
                                                    {new Date(u.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
