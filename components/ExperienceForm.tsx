import React, { useState } from 'react';
import { Company, Difficulty, InterviewExperience, InterviewRound } from '../types';
import { IconBriefcase, IconCheckCircle, IconPlus, IconTrash, IconUser } from './Icons';
import * as api from '../services/api';

interface ExperienceFormProps {
    companies: Company[];
    contributorId?: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ companies, contributorId, onSuccess, onCancel }) => {
    // Basic Info
    const [companyName, setCompanyName] = useState('');
    const [role, setRole] = useState('');
    const [studentName, setStudentName] = useState(''); // Optional, default to Anonymous
    const [outcome, setOutcome] = useState<'Offer' | 'Rejected' | 'Waitlisted' | 'Unknown'>('Unknown');
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
    const [overallExp, setOverallExp] = useState('');

    // Rounds State
    const [rounds, setRounds] = useState<InterviewRound[]>([
        { id: '1', type: 'Online Test', difficulty: Difficulty.Medium, questions: [] }
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddRound = () => {
        const newRound: InterviewRound = {
            id: String(Date.now()),
            type: 'Technical',
            difficulty: Difficulty.Medium,
            questions: []
        };
        setRounds([...rounds, newRound]);
    };

    const handleRemoveRound = (index: number) => {
        const newRounds = [...rounds];
        newRounds.splice(index, 1);
        setRounds(newRounds);
    };

    const updateRound = (index: number, field: keyof InterviewRound, value: any) => {
        const newRounds = [...rounds];
        newRounds[index] = { ...newRounds[index], [field]: value };
        setRounds(newRounds);
    };

    const addQuestionToRound = (roundIndex: number) => {
        const newRounds = [...rounds];
        newRounds[roundIndex].questions.push({ text: '' });
        setRounds(newRounds);
    };

    const updateQuestion = (roundIndex: number, qIndex: number, text: string) => {
        const newRounds = [...rounds];
        newRounds[roundIndex].questions[qIndex].text = text;
        setRounds(newRounds);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Find or Create Company ID (Simplified: maintain name mainly)
            // In a real app, we'd force selection or create new company properly
            const existingCompany = companies.find(c => c.name.toLowerCase() === companyName.toLowerCase());
            const companyId = existingCompany ? existingCompany.id : 'unknown_company'; // Fallback

            const newExp: Omit<InterviewExperience, 'id'> = {
                companyId,
                companyName,
                studentName: studentName || 'Anonymous',
                role,
                date: new Date().toISOString(),
                difficulty,
                outcome,
                overallExperience: overallExp,
                questions: [], // Legacy empty
                roundsSnapshot: rounds,
                status: 'pending',
                contributorId
            };

            const result = await api.addExperience(newExp);
            if (result) {
                onSuccess();
            } else {
                throw new Error('Failed to save experience.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle = "w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-bits-blue focus:border-bits-blue outline-none transition-all text-sm shadow-sm hover:border-gray-400 placeholder-gray-400";
    const labelStyle = "block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5 ml-1";

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ring-1 ring-black/5 animate-in fade-in">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                        <IconBriefcase className="w-5 h-5 text-bits-blue" />
                        Share Interview Experience
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Help your juniors ace their interviews by sharing detailed insights.</p>
                </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
                {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-center gap-2"><IconTrash className="w-4 h-4" /> {error}</div>}

                {/* Section 1: Context */}
                <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100/50">
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-bits-blue text-white flex items-center justify-center text-xs">1</span>
                        Context & Outcome
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className={labelStyle}>Company Name *</label>
                            <input list="company-list" value={companyName} onChange={e => setCompanyName(e.target.value)} className={inputStyle} required placeholder="e.g. Google" />
                            <datalist id="company-list">
                                {companies.map(c => <option key={c.id} value={c.name} />)}
                            </datalist>
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelStyle}>Role Applied For *</label>
                            <input value={role} onChange={e => setRole(e.target.value)} className={inputStyle} required placeholder="e.g. Product Analyst" />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelStyle}>Final Verdict</label>
                            <div className="relative">
                                <select value={outcome} onChange={e => setOutcome(e.target.value as any)} className={`${inputStyle} appearance-none`}>
                                    <option value="Offer">✅ Offer Received</option>
                                    <option value="Rejected">❌ Rejected</option>
                                    <option value="Waitlisted">⏳ Waitlisted</option>
                                    <option value="Unknown">❓ Unknown</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelStyle}>Perceived Difficulty</label>
                            <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className={`${inputStyle} appearance-none`}>
                                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 2: The Story */}
                <div>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-bits-blue text-white flex items-center justify-center text-xs">2</span>
                        The Process (Rounds)
                    </h4>

                    <div className="mb-4 p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-100">
                        <strong>💡 PM Tip:</strong> Break down the interview into specific rounds. Mention the platform used (e.g., HackerRank) or the type of interviewer (e.g., "VP of Engineering").
                    </div>

                    <div className="space-y-6">
                        {rounds.map((round, rIndex) => (
                            <div key={rIndex} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm relative group hover:border-bits-blue transition-colors">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button type="button" onClick={() => handleRemoveRound(rIndex)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Remove Round">
                                        <IconTrash className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <span className="font-bold text-gray-400 text-lg">#{rIndex + 1}</span>
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block">Round Type</label>
                                            <select
                                                value={round.type}
                                                onChange={e => updateRound(rIndex, 'type', e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-bits-blue outline-none"
                                            >
                                                <option>Online Test</option>
                                                <option>Technical</option>
                                                <option>HR</option>
                                                <option>Case Study</option>
                                                <option>Managerial</option>
                                                <option>Group Discussion</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block">Duration</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 45m"
                                                value={round.duration || ''}
                                                onChange={e => updateRound(rIndex, 'duration', e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block">Diff</label>
                                            <select
                                                value={round.difficulty}
                                                onChange={e => updateRound(rIndex, 'difficulty', e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm"
                                            >
                                                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="text-xs font-bold text-gray-600 mb-1 block">What happened in this round?</label>
                                    <textarea
                                        placeholder="E.g. The interviewer asked about my resume project, then gave me a SQL query to write on a shared doc..."
                                        value={round.description || ''}
                                        onChange={e => updateRound(rIndex, 'description', e.target.value)}
                                        rows={2}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-bits-blue focus:border-transparent outline-none"
                                    />
                                </div>

                                {/* Questions in Round */}
                                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-gray-600 block">Specific Questions Asked</label>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">High Value</span>
                                    </div>

                                    {round.questions.map((q, qIndex) => (
                                        <div key={qIndex} className="relative">
                                            <input
                                                type="text"
                                                placeholder={round.type === 'Online Test' ? "e.g. Given an array, find the max sum subarray..." : "e.g. Why do you want to join us?"}
                                                value={q.text}
                                                onChange={e => updateQuestion(rIndex, qIndex, e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm pr-8 focus:border-bits-blue outline-none"
                                            />
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addQuestionToRound(rIndex)} className="text-xs text-bits-blue hover:text-blue-700 font-bold flex items-center gap-1">
                                        <IconPlus className="w-3 h-3" /> Add Question
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="button" onClick={handleAddRound} className="w-full py-3 mt-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-bold hover:border-bits-blue hover:text-bits-blue hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                        <IconPlus className="w-5 h-5" /> Add Another Round
                    </button>
                </div>

                {/* Section 3: Summary */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-bits-blue text-white flex items-center justify-center text-xs">3</span>
                        Final Thoughts
                    </h4>
                    <label className={labelStyle}>Overall Experience & Tips</label>
                    <p className="text-xs text-gray-400 mb-2">What would you tell a junior preparing for this role right now?</p>
                    <textarea value={overallExp} onChange={e => setOverallExp(e.target.value)} rows={4} className={inputStyle} placeholder="Focus on SQL joins and Window functions. The interviewer was friendly but drilled deep into..." />
                </div>

                <div className="pt-6 border-t border-gray-100 flex gap-4">
                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-bits-blue text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex justify-center text-base">
                        {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
                    </button>
                    <button type="button" onClick={onCancel} className="px-8 py-4 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50">
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ExperienceForm;
