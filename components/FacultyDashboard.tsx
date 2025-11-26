import React, { useState, useRef } from 'react';
import { Recommendation, RecommendationSubject } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { IconBook, IconCheckCircle, IconBriefcase, IconUpload, IconX } from './Icons';
import { readFileContent, parseCSV, validateHeaders } from '../utils/csvHelpers';

interface FacultyDashboardProps {
    onAddRecommendation: (rec: Recommendation) => void;
}

const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onAddRecommendation }) => {
    const { user } = useAuth();

    // Form State
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [subject, setSubject] = useState<RecommendationSubject>(RecommendationSubject.Python);
    const [description, setDescription] = useState('');

    // Pedagogy State
    const [goal, setGoal] = useState('');
    const [expectedLearning, setExpectedLearning] = useState('');
    const [remarks, setRemarks] = useState('');
    const [timeToComplete, setTimeToComplete] = useState('');

    const [successMsg, setSuccessMsg] = useState('');

    // Upload State
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStats, setUploadStats] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newRec: Recommendation = {
            id: `rec_${Date.now()}`,
            facultyName: user?.email || 'Faculty Member',
            date: new Date().toLocaleDateString(),
            title,
            url: url || undefined,
            description,
            subject,
            goal,
            expectedLearning,
            remarks: remarks || undefined,
            timeToComplete: timeToComplete || undefined
        };

        onAddRecommendation(newRec);

        setSuccessMsg('Resource recommended successfully!');

        // Reset Form
        setTitle('');
        setUrl('');
        setDescription('');
        setGoal('');
        setExpectedLearning('');
        setRemarks('');
        setTimeToComplete('');

        setTimeout(() => setSuccessMsg(''), 3000);
    };

    // --- CSV Logic ---

    const downloadTemplate = () => {
        const headers = 'Title,URL,Description,Subject,Goal,Expected Learning,Remarks,Time Estimate\n';
        const content = 'Advanced Pandas,https://example.com,Deep dive...,Python,Master Dataframes,Handling complex data,"Focus on MultiIndex",2 Hours';
        const filename = 'faculty_recommendation_template.csv';

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
            setUploadProgress(10);
            const text = await readFileContent(file);
            setUploadProgress(40);

            const rows = parseCSV(text);
            setUploadProgress(60);

            const results = processCSV(rows);

            setUploadProgress(100);
            setUploadStats(results);

            if (fileInputRef.current) fileInputRef.current.value = '';

        } catch (error) {
            console.error(error);
            setUploadStats({ success: 0, failed: 1, errors: ['Failed to read or parse file.'] });
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    const processCSV = (rows: string[][]) => {
        let success = 0;
        let failed = 0;
        const errors: string[] = [];

        // Expected: Title,URL,Description,Subject,Goal,Expected Learning,Remarks,Time Estimate
        if (rows.length < 2) return { success: 0, failed: 0, errors: ['File is empty or missing header row'] };

        const headers = rows[0];
        const expectedHeaders = ['Title', 'URL', 'Description', 'Subject', 'Goal', 'Expected Learning', 'Remarks', 'Time Estimate'];

        if (!validateHeaders(headers, expectedHeaders)) {
            return {
                success: 0,
                failed: rows.length - 1,
                errors: [`Invalid CSV Format. Expected headers: ${expectedHeaders.join(', ')}`]
            };
        }

        rows.slice(1).forEach((row, index) => {
            const lineNum = index + 2;
            if (row.length < 6) { // Min required fields
                failed++;
                if (row.length > 0) errors.push(`Line ${lineNum}: Not enough fields.`);
                return;
            }

            try {
                const title = row[0];
                const subjectStr = row[3];

                if (!title) throw new Error("Missing 'Title'.");

                // Validate Subject
                const validSubjects = Object.values(RecommendationSubject);
                const subject = validSubjects.includes(subjectStr as RecommendationSubject)
                    ? (subjectStr as RecommendationSubject)
                    : RecommendationSubject.Python; // Default or Error? Using Default for now but could error.

                const r: Recommendation = {
                    id: `rec_bulk_${Date.now()}_${index}`,
                    facultyName: user?.email || 'Faculty Member',
                    date: new Date().toLocaleDateString(),
                    title: title,
                    url: row[1] || undefined,
                    description: row[2] || '',
                    subject: subject,
                    goal: row[4] || '',
                    expectedLearning: row[5] || '',
                    remarks: row[6] || undefined,
                    timeToComplete: row[7] || undefined
                };
                onAddRecommendation(r);
                success++;
            } catch (e: any) {
                failed++;
                errors.push(`Line ${lineNum}: ${e.message}`);
            }
        });

        return { success, failed, errors };
    };

    const inputStyle = "w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-bits-blue focus:border-bits-blue outline-none transition-all text-sm shadow-sm hover:border-gray-400 placeholder-gray-400";
    const labelStyle = "block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5 ml-1";

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in">
            <div className="mb-8 border-b border-gray-200 pb-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Faculty Portal</h2>
                <p className="text-gray-500 mt-2 text-sm">Recommend resources and practice material for students.</p>
            </div>

            {successMsg && (
                <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center gap-3 shadow-sm animate-in slide-in-from-top-2">
                    <IconCheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">{successMsg}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Form */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ring-1 ring-black/5">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <IconBook className="w-5 h-5 text-bits-blue" />
                                New Recommendation
                            </h3>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Entry Form</span>
                        </div>

                        <div className="p-6 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* Context Section */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-bits-blue border-b border-gray-100 pb-2">1. Context & Subject</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Subject</label>
                                            <select
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value as RecommendationSubject)}
                                                className={inputStyle}
                                            >
                                                {Object.values(RecommendationSubject).map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Estimated Time</label>
                                            <input
                                                type="text"
                                                value={timeToComplete}
                                                onChange={e => setTimeToComplete(e.target.value)}
                                                className={inputStyle}
                                                placeholder="e.g. 30 Mins, 2 Hours"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-bits-blue border-b border-gray-100 pb-2">2. Resource Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className={labelStyle}>Title <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={title}
                                                onChange={e => setTitle(e.target.value)}
                                                className={inputStyle}
                                                placeholder="e.g. Advanced Pandas Techniques"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className={labelStyle}>URL (Optional)</label>
                                            <input
                                                type="url"
                                                value={url}
                                                onChange={e => setUrl(e.target.value)}
                                                className={inputStyle}
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className={labelStyle}>Description <span className="text-red-500">*</span></label>
                                            <textarea
                                                value={description}
                                                onChange={e => setDescription(e.target.value)}
                                                rows={2}
                                                className={inputStyle}
                                                placeholder="Brief overview of the resource..."
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Pedagogy Section */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-bits-blue border-b border-gray-100 pb-2">3. Pedagogy & Goals</h4>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Goal / Objective <span className="text-red-500">*</span></label>
                                            <textarea
                                                value={goal}
                                                onChange={e => setGoal(e.target.value)}
                                                rows={2}
                                                className={inputStyle}
                                                placeholder="e.g. Master complex data manipulation"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Expected Learning Outcomes <span className="text-red-500">*</span></label>
                                            <textarea
                                                value={expectedLearning}
                                                onChange={e => setExpectedLearning(e.target.value)}
                                                rows={4}
                                                className={inputStyle}
                                                placeholder="What will the student be able to do after this?"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={labelStyle}>Faculty Remarks (Optional)</label>
                                            <textarea
                                                value={remarks}
                                                onChange={e => setRemarks(e.target.value)}
                                                rows={2}
                                                className={inputStyle}
                                                placeholder="Any specific tips or context..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        className="w-full bg-bits-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
                                    >
                                        <IconBriefcase className="w-5 h-5" />
                                        <span>Publish Recommendation</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Bulk Upload */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ring-1 ring-black/5">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                            <IconUpload className="w-5 h-5 text-bits-blue" />
                            Bulk Upload
                        </h3>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            Upload a CSV file to add multiple recommendations at once.
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
                                onClick={downloadTemplate}
                                disabled={isUploading}
                                className="w-full py-2.5 text-xs font-bold uppercase tracking-wide text-bits-blue bg-white hover:bg-blue-50 rounded-lg transition-colors border border-blue-100 flex items-center justify-center gap-2 shadow-sm"
                            >
                                <IconBriefcase className="w-4 h-4" />
                                Download CSV Template
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
