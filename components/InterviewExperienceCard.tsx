import React, { useState } from 'react';
import { InterviewExperience, InterviewRound } from '../types';
import { IconUser, IconCalendar, IconBriefcase, IconCheckCircle, IconX, IconClock, IconChevronDown, IconChevronUp, IconSparkles } from './Icons';

interface InterviewExperienceCardProps {
    experience: InterviewExperience;
}

const InterviewExperienceCard: React.FC<InterviewExperienceCardProps> = ({ experience }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // --- Helper Components ---

    const OutcomeBadge = ({ outcome }: { outcome: string }) => {
        switch (outcome) {
            case 'Offer': return <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-green-200 shadow-sm"><IconCheckCircle className="w-3.5 h-3.5" /> Offer Received</span>;
            case 'Rejected': return <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-red-100"><IconX className="w-3.5 h-3.5" /> Rejected</span>;
            case 'Waitlisted': return <span className="bg-yellow-50 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-yellow-100"><IconClock className="w-3.5 h-3.5" /> Waitlisted</span>;
            default: return <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">Result Unknown</span>;
        }
    };

    const DifficultyMeter = ({ level }: { level: string }) => {
        const colors = level === 'Hard' ? 'bg-red-500' : level === 'Medium' ? 'bg-yellow-400' : 'bg-green-500';
        return (
            <div className="flex items-center gap-1.5" title={`Difficulty: ${level}`}>
                <div className="flex gap-0.5">
                    <div className={`w-1.5 h-3 rounded-sm ${colors}`}></div>
                    <div className={`w-1.5 h-3 rounded-sm ${level !== 'Easy' ? colors : 'bg-gray-200'}`}></div>
                    <div className={`w-1.5 h-3 rounded-sm ${level === 'Hard' ? colors : 'bg-gray-200'}`}></div>
                </div>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{level}</span>
            </div>
        );
    };

    const Timeline = ({ rounds }: { rounds: InterviewRound[] }) => (
        <div className="flex items-center w-full overflow-x-auto py-4 custom-scrollbar">
            {rounds.map((round, idx) => (
                <div key={idx} className="flex items-center shrink-0">
                    {/* Circle Node */}
                    <div className="flex flex-col items-center gap-2 w-24">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${idx === rounds.length - 1 ? 'bg-bits-blue text-white border-bits-blue' : 'bg-white text-gray-500 border-gray-300'}`}>
                            {idx + 1}
                        </div>
                        <div className="text-[10px] font-bold text-gray-600 text-center uppercase leading-tight px-1 truncate w-full" title={round.type}>
                            {round.type}
                        </div>
                    </div>
                    {/* Connecting Line (except last) */}
                    {idx < rounds.length - 1 && (
                        <div className="h-0.5 w-12 bg-gray-200 mb-6 mx-1"></div>
                    )}
                </div>
            ))}
            {/* Final Outcome Checkmark */}
            <div className="flex items-center shrink-0">
                <div className="h-0.5 w-12 bg-gray-200 mb-6 mx-1"></div>
                <div className="flex flex-col items-center gap-2 w-24">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${experience.outcome === 'Offer' ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                        {experience.outcome === 'Offer' ? '✓' : '?'}
                    </div>
                    <div className="text-[10px] font-bold text-gray-600 text-center uppercase leading-tight px-1">
                        verdict
                    </div>
                </div>
            </div>
        </div>
    );

    // --- Render Logic ---

    // Check if we have rich rounds data (SaaS V2 structure)
    const hasRichRounds = experience.roundsSnapshot && experience.roundsSnapshot.length > 0;
    const roundsToDisplay = hasRichRounds ? experience.roundsSnapshot! : [];


    return (
        <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden mb-5">
            {/* Header: Clickable for expansion */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-6 cursor-pointer bg-gradient-to-r from-white via-white to-gray-50/50"
            >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-bits-blue font-bold text-xl border border-blue-100 shadow-sm">
                                {experience.studentName.charAt(0)}
                            </div>
                            {experience.studentName !== 'Anonymous' && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white" title="Verified Student">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-bits-blue transition-colors">
                                {experience.role} <span className="text-gray-400 font-normal">at</span> {experience.companyName}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-gray-500 font-medium">
                                <span className="flex items-center gap-1.5"><IconUser className="w-3.5 h-3.5 text-gray-400" /> {experience.studentName}</span>
                                <span className="hidden sm:inline text-gray-300">|</span>
                                <span className="flex items-center gap-1.5"><IconCalendar className="w-3.5 h-3.5 text-gray-400" /> {experience.date}</span>
                                <span className="hidden sm:inline text-gray-300">|</span>
                                <DifficultyMeter level={experience.difficulty} />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <OutcomeBadge outcome={experience.outcome} />
                    </div>
                </div>

                {/* Mini Timeline (Preview) - Only if rich rounds exist */}
                {hasRichRounds && (
                    <div className="mt-2 border-t border-dashed border-gray-100 pt-4 hidden sm:block">
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">
                            <IconSparkles className="w-3 h-3 text-bits-gold" /> Interview Journey
                        </div>
                        <Timeline rounds={roundsToDisplay} />
                    </div>
                )}

                {/* Expand Chevron */}
                <div className="flex justify-center mt-2 sm:mt-0 sm:absolute sm:bottom-6 sm:right-6">
                    {isExpanded ? <IconChevronUp className="w-5 h-5 text-gray-400" /> : <IconChevronDown className="w-5 h-5 text-gray-300 group-hover:text-bits-blue transition-colors" />}
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 animate-in slide-in-from-top-2">

                    <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                        {/* LEFT: Interview Details (7/12) */}
                        <div className="lg:col-span-8 p-6 lg:p-8 space-y-8">

                            {/* Pro Tip / Secret Sauce */}
                            {experience.overallExperience && (
                                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-5 rounded-xl border border-yellow-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-10"><IconSparkles className="w-16 h-16 text-yellow-600" /></div>
                                    <h4 className="text-sm font-bold text-yellow-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                                        <span className="text-lg">💡</span> The Secret Sauce
                                    </h4>
                                    <p className="text-gray-800 text-sm leading-relaxed italic relative z-10">"{experience.overallExperience}"</p>
                                </div>
                            )}

                            {/* Round by Round Breakdown */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Round-by-Round Breakdown</h4>
                                <div className="space-y-6">
                                    {hasRichRounds ? (
                                        // V2: Structured Rounds
                                        roundsToDisplay.map((round, rIdx) => (
                                            <div key={rIdx} className="relative pl-6 border-l-2 border-gray-200 hover:border-bits-blue transition-colors pb-2">
                                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-gray-300 group-hover:border-bits-blue"></div>

                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                                    <h5 className="font-bold text-gray-900 text-lg">{round.type} Round</h5>
                                                    <div className="flex gap-2">
                                                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold border border-gray-200">{round.difficulty}</span>
                                                        {round.duration && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold border border-blue-100">{round.duration}</span>}
                                                    </div>
                                                </div>

                                                {round.description && <p className="text-sm text-gray-600 mb-4 leading-relaxed">{round.description}</p>}

                                                {round.questions && round.questions.length > 0 && round.questions[0].text && (
                                                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Questions Asked</span>
                                                        <ul className="space-y-3">
                                                            {round.questions.map((q, qIdx) => (
                                                                <li key={qIdx} className="flex gap-3 text-sm text-gray-800">
                                                                    <span className="font-bold text-bits-blue shrink-0">Q{qIdx + 1}.</span>
                                                                    <span>{q.text}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        // V1: Legacy Flat Questions
                                        <div className="space-y-4">
                                            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Legacy Question Dataset</span>
                                                <ul className="space-y-3">
                                                    {experience.questions.map((q, qIdx) => (
                                                        <li key={q.id} className="flex gap-3 text-sm text-gray-800">
                                                            <span className="font-bold text-bits-blue shrink-0">Q{qIdx + 1}.</span>
                                                            <span>{q.text}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Metadata Sidebar (5/12) */}
                        <div className="lg:col-span-4 bg-gray-50 p-6 lg:p-8 space-y-6">
                            <div>
                                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Submission Details</h5>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between border-b border-gray-200 pb-2">
                                        <span className="text-gray-500">Date</span>
                                        <span className="font-medium text-gray-900">{experience.date}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-2">
                                        <span className="text-gray-500">Outcome</span>
                                        <span className={`font-bold ${experience.outcome === 'Offer' ? 'text-green-600' : 'text-gray-900'}`}>{experience.outcome}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-2">
                                        <span className="text-gray-500">Total Rounds</span>
                                        <span className="font-medium text-gray-900">{hasRichRounds ? roundsToDisplay.length : '?'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Contributor</span>
                                        <span className="font-medium text-gray-900 flex items-center gap-1">
                                            {experience.studentName}
                                            {experience.studentName !== 'Anonymous' && <IconCheckCircle className="w-3 h-3 text-blue-500" />}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-900 rounded-xl p-4 text-white text-center">
                                <p className="text-xs font-medium text-blue-200 mb-2">Found this helpful?</p>
                                <button className="w-full bg-white text-bits-blue font-bold py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors shadow-sm">
                                    Say Thanks! 👋
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewExperienceCard;
