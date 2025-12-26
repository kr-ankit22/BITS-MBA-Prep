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

const FormTip: React.FC<{ children: React.ReactNode; color?: 'blue' | 'yellow' | 'pink' }> = ({ children, color = 'blue' }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-700 border-blue-100",
        yellow: "bg-yellow-50 text-yellow-800 border-yellow-100",
        pink: "bg-pink-50 text-pink-700 border-pink-100"
    };

    return (
        <div className={`mt-1.5 p-2 rounded-lg border text-[11px] font-medium flex gap-2 animate-in fade-in slide-in-from-top-1 ${colors[color]}`}>
            <span className="shrink-0">💡</span>
            <div>{children}</div>
        </div>
    );
};

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
        { id: '1', type: 'Online Test', difficulty: Difficulty.Medium, questions: [{ text: '' }] }
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddRound = () => {
        const newRound: InterviewRound = {
            id: String(Date.now()),
            type: 'Technical',
            difficulty: Difficulty.Medium,
            questions: [{ text: '' }]
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

    const removeQuestionFromRound = (roundIndex: number, qIndex: number) => {
        const newRounds = [...rounds];
        newRounds[roundIndex].questions.splice(qIndex, 1);
        setRounds(newRounds);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Data Integrity & Quality Guard: Ensure meaningful content is submitted
        const totalQuestions = rounds.reduce((acc, r) => acc + r.questions.filter(q => q.text.trim().length > 5).length, 0);
        if (totalQuestions === 0) {
            setError("Wait! 🛑 Juniors need specific questions to practice. Please add at least one detailed question.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const existingCompany = companies.find(c => c.name.toLowerCase() === companyName.toLowerCase());
            const companyId = existingCompany ? existingCompany.id : 'unknown_company';

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
            <div className="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-bits-blue/10 to-white flex justify-between items-center text-center sm:text-left">
                <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 text-xl justify-center sm:justify-start">
                        <IconBriefcase className="w-6 h-6 text-bits-blue" />
                        Share Your Success Story! 🚀
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium italic">"The best way to predict your junior's future is to document your past."</p>
                </div>
            </div>

            <div className="p-6 md:p-8 space-y-10">
                {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-center gap-3 font-bold animate-shake">
                    <span className="text-xl">⚠️</span> {error}
                </div>}

                {/* Section 1: Context */}
                <div className="bg-blue-50/30 p-6 rounded-2xl border border-blue-100/50">
                    <h4 className="text-sm font-bold text-bits-blue uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-bits-blue/10 pb-2">
                        <span className="w-8 h-8 rounded-full bg-bits-blue text-white flex items-center justify-center text-xs shadow-md">1</span>
                        Context & Outcome
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className={labelStyle}>Company Name *</label>
                            <input list="company-list" value={companyName} onChange={e => setCompanyName(e.target.value)} className={inputStyle} required placeholder="e.g. JPMorgan Chase" />
                            <datalist id="company-list">
                                {companies.map(c => <option key={c.id} value={c.name} />)}
                            </datalist>
                            <FormTip>Be precise! "Accenture Strategy" is way more helpful than just "Accenture". 🎯</FormTip>
                        </div>
                        <div className="space-y-2">
                            <label className={labelStyle}>Role Applied For *</label>
                            <input value={role} onChange={e => setRole(e.target.value)} className={inputStyle} required placeholder="e.g. Associate Product Manager" />
                            <FormTip>Specify the role - was it an Internship or Full-time? 💼</FormTip>
                        </div>
                        <div className="space-y-2">
                            <label className={labelStyle}>Final Verdict</label>
                            <div className="relative">
                                <select value={outcome} onChange={e => setOutcome(e.target.value as any)} className={`${inputStyle} appearance-none`}>
                                    <option value="Offer">✅ Offer Received - You're Hired!</option>
                                    <option value="Rejected">❌ Rejected - A learning experience</option>
                                    <option value="Waitlisted">⏳ Waitlisted - Fingers crossed</option>
                                    <option value="Unknown">❓ Secret - Keeping it a mystery</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className={labelStyle}>Perceived Difficulty</label>
                            <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className={`${inputStyle} appearance-none`}>
                                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d} (Be honest!)</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 2: The Story */}
                <div>
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-gray-100 pb-2">
                        <span className="w-8 h-8 rounded-full bg-bits-blue text-white flex items-center justify-center text-xs shadow-md">2</span>
                        The Rounds (Where the magic happened)
                    </h4>

                    <div className="space-y-8">
                        {rounds.map((round, rIndex) => (
                            <div key={rIndex} className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm relative group hover:border-bits-blue transition-all duration-300 hover:shadow-lg">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button type="button" onClick={() => handleRemoveRound(rIndex)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Remove Round">
                                        <IconTrash className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                                    <span className="font-extrabold text-bits-blue/20 text-4xl italic select-none">#{rIndex + 1}</span>
                                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block tracking-wider">Round Type</label>
                                            <select
                                                value={round.type}
                                                onChange={e => updateRound(rIndex, 'type', e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-bits-blue outline-none transition-all"
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
                                            <label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block tracking-wider">Duration</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 1 hour"
                                                value={round.duration || ''}
                                                onChange={e => updateRound(rIndex, 'duration', e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-bits-blue outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block tracking-wider">Vibe</label>
                                            <select
                                                value={round.difficulty}
                                                onChange={e => updateRound(rIndex, 'difficulty', e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-bits-blue outline-none"
                                            >
                                                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="text-xs font-bold text-gray-700 mb-2 block">Tell the Story: What happened?</label>
                                    <textarea
                                        placeholder="E.g. They started with my summer internship project, then jumped into SQL window functions. They were really picky about performance optimization!"
                                        value={round.description || ''}
                                        onChange={e => updateRound(rIndex, 'description', e.target.value)}
                                        rows={3}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-bits-blue focus:border-transparent outline-none shadow-inner"
                                    />
                                    <FormTip color="yellow">Avoid generic comments. Share the specific topics or the 'Aha!' moments! 💡</FormTip>
                                </div>

                                {/* Questions in Round */}
                                <div className="space-y-4 bg-gray-50/80 p-6 rounded-2xl border border-dashed border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-gray-800 block uppercase tracking-wider">Questions Asked (The Gold Mine 💰)</label>
                                        <span className="text-[10px] font-bold text-bits-gold bg-white px-2 py-0.5 rounded shadow-sm">HIGH VALUE</span>
                                    </div>

                                    {round.questions.map((q, qIndex) => (
                                        <div key={qIndex} className="relative flex gap-2 animate-in zoom-in-95 duration-200">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder={round.type === 'Online Test' ? "e.g. Find the longest palindromic substring..." : "e.g. Design a database schema for a ride-sharing app..."}
                                                    value={q.text}
                                                    onChange={e => updateQuestion(rIndex, qIndex, e.target.value)}
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-bits-blue focus:ring-2 focus:ring-bits-blue/10 outline-none shadow-sm"
                                                />
                                                {q.text.length > 0 && q.text.length < 10 && <FormTip color="pink">Help us out! A bit more detail makes this a pro-tip. ✍️</FormTip>}
                                            </div>
                                            {round.questions.length > 1 && (
                                                <button type="button" onClick={() => removeQuestionFromRound(rIndex, qIndex)} className="text-gray-300 hover:text-red-400 p-2">
                                                    <IconTrash className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addQuestionToRound(rIndex)} className="text-sm text-bits-blue hover:text-blue-700 font-bold flex items-center gap-2 py-2 px-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow transition-all w-fit mt-2">
                                        <IconPlus className="w-4 h-4" /> Add Another Question
                                    </button>
                                    <FormTip color="pink">Don't just say "Asked SQL". Try: "Write a query to find students with GPA &gt; 9 using subqueries". 🚀</FormTip>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="button" onClick={handleAddRound} className="w-full py-5 mt-6 border-2 border-dashed border-bits-blue/30 rounded-2xl text-bits-blue font-bold hover:border-bits-blue hover:bg-blue-50/50 transition-all flex items-center justify-center gap-3 group">
                        <IconPlus className="w-6 h-6 group-hover:scale-125 transition-transform" /> Add Another Round
                    </button>
                </div>

                {/* Section 3: Summary */}
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-gray-200 pb-2">
                        <span className="w-8 h-8 rounded-full bg-bits-blue text-white flex items-center justify-center text-xs shadow-md">3</span>
                        The Secret Sauce 🧪
                    </h4>
                    <label className={labelStyle}>Overall Prep Tips & Advice</label>
                    <textarea
                        value={overallExp}
                        onChange={e => setOverallExp(e.target.value)}
                        rows={4}
                        className={inputStyle}
                        placeholder="What's the one thing you wish someone told you before this interview? Focus on the culture? Brush up on Guesstimates? Be the mentor you needed!"
                    />
                    <FormTip>Your advice could be the turning point for a junior. Make it count! 🌟</FormTip>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                    <button type="submit" disabled={isSubmitting} className="flex-2 bg-bits-blue text-white font-bold py-5 px-10 rounded-2xl hover:bg-blue-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:opacity-70 flex justify-center items-center gap-3 text-lg order-1 sm:order-2">
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Saving Your Journey...
                            </>
                        ) : (
                            <>
                                <IconCheckCircle className="w-6 h-6" />
                                Publish Experience
                            </>
                        )}
                    </button>
                    <button type="button" onClick={onCancel} className="flex-1 py-5 px-8 border-2 border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all order-2 sm:order-1">
                        Save as Draft (Cancel)
                    </button>
                </div>
            </div>
        </form>
    );
};


export default ExperienceForm;
