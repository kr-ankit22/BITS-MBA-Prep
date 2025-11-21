
import React, { useState, useRef } from 'react';
import { Question, Topic, Difficulty, Company, Resource } from '../types';

import { IconUpload, IconBook, IconBriefcase, IconCheckCircle, IconLink, IconX } from './Icons';

interface AdminPanelProps {
    onAddQuestion: (q: Question) => void;
    onAddResource: (r: Resource) => void;
    onAddCompany: (c: Company) => Promise<Company | undefined>;
    companies: Company[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onAddQuestion, onAddResource, onAddCompany, companies }) => {
    const [activeTab, setActiveTab] = useState<'question' | 'resource'>('question');
    const [successMsg, setSuccessMsg] = useState('');

    // Upload State
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStats, setUploadStats] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Question Form State
    const [qCompany, setQCompany] = useState(companies.length > 0 ? companies[0].name : '');
    const [qDomain, setQDomain] = useState(companies.length > 0 ? companies[0].sector : '');
    const [qRole, setQRole] = useState('');
    const [qTopic, setQTopic] = useState<string>('Analytics');
    // const [qCategory, setQCategory] = useState<QuestionCategory>('Technical'); // Removed
    const [qDifficulty, setQDifficulty] = useState<Difficulty>(Difficulty.Medium);

    const [qText, setQText] = useState('');
    const [qApproach, setQApproach] = useState('');
    const [qAskedBits, setQAskedBits] = useState(false);

    // Resource Form State
    const [rTitle, setRTitle] = useState('');
    const [rCategory, setRCategory] = useState('Python');
    const [rUrl, setRUrl] = useState('');
    const [rDesc, setRDesc] = useState('');
    const [rSource, setRSource] = useState('');

    // Common Styles
    const labelStyle = "block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5 ml-1";
    const inputStyle = "w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-bits-blue focus:border-bits-blue outline-none transition-all text-sm shadow-sm hover:border-gray-400 placeholder-gray-400 disabled:bg-gray-100";
    const btnPrimaryStyle = "bg-bits-blue text-white font-bold py-2.5 px-6 rounded-lg hover:bg-blue-800 transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70";

    // --- Single Entry Handlers ---

    const handleQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if company exists, if not create it, if yes check role
        let targetCompany = companies.find(c => c.name === qCompany);
        let companyId = targetCompany?.id;

        if (!targetCompany) {
            // Create new company
            const newCompany: Company = {
                id: '', // ID will be assigned by DB
                name: qCompany,
                sector: qDomain || 'General',
                logo: `https://logo.clearbit.com/${qCompany.toLowerCase().replace(/\s/g, '')}.com`,
                description: 'Added via Admin Panel.',
                roles: qRole ? [qRole] : []
            };
            const savedCompany = await onAddCompany(newCompany);
            if (savedCompany) {
                companyId = savedCompany.id;
                targetCompany = savedCompany;
            } else {
                console.error("Failed to create company");
                return;
            }
        } else if (qRole && !targetCompany.roles.includes(qRole)) {
            // Update existing company role logic (skipped for now as per previous context)
        }

        const newQ: Question = {
            id: `q${Date.now()}`,
            companyId: companyId || 'unknown',
            companyName: qCompany,
            domain: qDomain,
            role: qRole || 'General',
            text: qText,
            topic: qTopic,
            difficulty: qDifficulty,
            idealApproach: qApproach,
            askedInBITS: qAskedBits,
            frequency: 1
        };
        onAddQuestion(newQ);
        showSuccess('Question successfully added to the bank.');
        setQText('');
        setQApproach('');
    };

    const handleResourceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newR: Resource = {
            id: `r${Date.now()}`,
            title: rTitle,
            category: rCategory,
            url: rUrl,
            description: rDesc,
            source: rSource || 'External',
            duration: 'Self-paced'
        };
        onAddResource(newR);
        showSuccess('Resource successfully added to the library.');
        setRTitle('');
        setRUrl('');
        setRDesc('');
    };

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    // --- CSV Logic ---

    const downloadTemplate = (type: 'question' | 'resource') => {
        let headers = '';
        let filename = '';
        let content = '';

        if (type === 'question') {
            headers = 'Company,Domain,Role,Topic,Difficulty,Question,Ideal_Approach,Asked_In_BITS\n';
            content = 'JPMorgan,Finance,Analyst,Analytics,Medium,"Describe a project...","STAR method...",Yes';
            filename = 'question_upload_template.csv';
        } else {
            headers = 'Title,Category,URL,Description,Source,Duration\n';
            content = 'Advanced Python,Python,https://example.com,Deep dive into pandas...,Coursera,10 Hours';
            filename = 'resource_upload_template.csv';
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);
        setUploadStats(null);

        try {
            // Simulate read progress
            setUploadProgress(10);
            const text = await readFileContent(file);
            setUploadProgress(40);

            // Parse CSV
            const rows = parseCSV(text);
            setUploadProgress(60);

            // Process Data
            let results;
            if (activeTab === 'question') {
                results = await processQuestions(rows);
            } else {
                results = processResources(rows);
            }

            setUploadProgress(100);
            setUploadStats(results);

            // Clear input to allow re-upload of same file if needed
            if (fileInputRef.current) fileInputRef.current.value = '';

        } catch (error) {
            console.error(error);
            setUploadStats({ success: 0, failed: 1, errors: ['Failed to read or parse file.'] });
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    const readFileContent = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    };

    // Robust CSV Parser that handles quotes
    const parseCSV = (text: string): string[][] => {
        const rows: string[][] = [];
        let currentRow: string[] = [];
        let currentField = '';
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (inQuotes) {
                if (char === '"' && nextChar === '"') {
                    currentField += '"';
                    i++; // Skip escaped quote
                } else if (char === '"') {
                    inQuotes = false;
                } else {
                    currentField += char;
                }
            } else {
                if (char === '"') {
                    inQuotes = true;
                } else if (char === ',') {
                    currentRow.push(currentField.trim());
                    currentField = '';
                } else if (char === '\n' || char === '\r') {
                    if (currentField || currentRow.length > 0) {
                        currentRow.push(currentField.trim());
                        rows.push(currentRow);
                    }
                    currentRow = [];
                    currentField = '';
                    if (char === '\r' && nextChar === '\n') i++;
                } else {
                    currentField += char;
                }
            }
        }
        // Push last field/row if exists
        if (currentField || currentRow.length > 0) {
            currentRow.push(currentField.trim());
            rows.push(currentRow);
        }
        return rows;
    };

    const processQuestions = async (rows: string[][]) => {
        let success = 0;
        let failed = 0;
        const errors: string[] = [];

        // Expected: Company,Domain,Role,Topic,Difficulty,Question,Ideal_Approach,Asked_In_BITS
        if (rows.length < 2) return { success: 0, failed: 0, errors: ['File is empty or missing header row'] };

        // Pass 1: Identify Companies to create or update
        const processedCompanies = new Map<string, Company>(); // Key: CompanyName
        const uniqueCompanyNames = Array.from(new Set(rows.slice(1).map(r => r[0]?.trim()).filter(Boolean)));

        for (const cName of uniqueCompanyNames) {
            let existing = companies.find(c => c.name === cName);

            if (existing) {
                processedCompanies.set(cName, existing);
            } else {
                const row = rows.find(r => r[0]?.trim() === cName);
                const cDomain = row ? row[1]?.trim() : 'General';
                const cRole = row ? row[2]?.trim() : '';

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
                } catch (err) {
                    errors.push(`Error creating company ${cName}: ${err}`);
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
                    topic: row[3] || 'General',
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

        // Expected: Title,Category,URL,Description,Source,Duration
        if (rows.length < 2) return { success: 0, failed: 0, errors: ['File is empty or missing header row'] };

        rows.slice(1).forEach((row, index) => {
            const lineNum = index + 2;
            if (row.length < 3) {
                failed++;
                if (row.length > 0) errors.push(`Line ${lineNum}: Not enough fields (found ${row.length}, expected min 3).`);
                return;
            }

            try {
                const title = row[0];
                const url = row[2];

                if (!title) throw new Error("Missing 'Title'.");
                if (!url) throw new Error("Missing 'URL'.");

                const r: Resource = {
                    id: `r_bulk_${Date.now()}_${index}`,
                    title: title,
                    category: row[1] || 'General',
                    url: url,
                    description: row[3] || '',
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
                                {activeTab === 'question' ? <IconBriefcase className="w-5 h-5 text-bits-blue" /> : <IconBook className="w-5 h-5 text-bits-blue" />}
                                {activeTab === 'question' ? 'New Interview Question' : 'New Curated Resource'}
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
                                            <select value={qTopic} onChange={e => setQTopic(e.target.value)} className={inputStyle}>
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
                                        <button type="submit" className={btnPrimaryStyle}>
                                            <span>Save Question to Bank</span>
                                        </button>
                                    </div>
                                </form>
                            ) : (
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
                                        <button type="submit" className={btnPrimaryStyle}>
                                            Add Resource
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
                            Upload a CSV file to add multiple {activeTab === 'question' ? 'questions' : 'resources'} at once.
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
        </div>
    );
};

export default AdminPanel;
