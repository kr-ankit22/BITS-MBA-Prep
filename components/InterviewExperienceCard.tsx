import React, { useState } from 'react';
import { InterviewExperience } from '../types';
import { IconUser, IconCalendar, IconBriefcase, IconCheckCircle, IconX, IconClock, IconChevronDown, IconChevronUp } from './Icons';

interface InterviewExperienceCardProps {
    experience: InterviewExperience;
}

const InterviewExperienceCard: React.FC<InterviewExperienceCardProps> = ({ experience }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Pagination for questions
    const [currentQuestionPage, setCurrentQuestionPage] = useState(1);
    const questionsPerPage = 3;
    const totalQuestionPages = Math.ceil(experience.questions.length / questionsPerPage);

    const currentQuestions = experience.questions.slice(
        (currentQuestionPage - 1) * questionsPerPage,
        currentQuestionPage * questionsPerPage
    );

    const getOutcomeBadge = (outcome: string) => {
        switch (outcome) {
            case 'Offer': return <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><IconCheckCircle className="w-3 h-3" /> Offer</span>;
            case 'Rejected': return <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><IconX className="w-3 h-3" /> Rejected</span>;
            case 'Waitlisted': return <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><IconClock className="w-3 h-3" /> Waitlisted</span>;
            default: return <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-0.5 rounded-full">Unknown</span>;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden mb-4">
            {/* Header - Always Visible */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-5 cursor-pointer bg-gradient-to-r from-white to-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-bits-blue font-bold text-lg shrink-0">
                        {experience.studentName.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                            {experience.studentName}
                            {getOutcomeBadge(experience.outcome)}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><IconBriefcase className="w-3 h-3" /> {experience.role}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1"><IconCalendar className="w-3 h-3" /> {experience.date}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className={`font-medium ${experience.difficulty === 'Hard' ? 'text-red-600' :
                                experience.difficulty === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                                }`}>{experience.difficulty}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-xs font-medium text-gray-400">{experience.questions.length} Questions</span>
                    {isExpanded ? <IconChevronUp className="w-5 h-5 text-gray-400" /> : <IconChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-gray-100 p-0 animate-in slide-in-from-top-2">
                    <div className="flex flex-col lg:flex-row">

                        {/* Left: Questions List - Increased Width (7/12) */}
                        <div className="lg:w-7/12 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/50 p-5 flex flex-col">
                            <h5 className="text-xs font-bold uppercase text-gray-500 mb-3 tracking-wider">Interview Questions</h5>

                            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar max-h-[500px]">
                                {currentQuestions.map((q, idx) => (
                                    <div key={q.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-sm">
                                        <div className="flex gap-2">
                                            <span className="font-bold text-bits-blue shrink-0">Q{(currentQuestionPage - 1) * questionsPerPage + idx + 1}.</span>
                                            <p className="text-gray-800 font-medium">{q.text}</p>
                                        </div>
                                        {q.idealApproach && (
                                            <div className="mt-2 pl-6 text-xs text-gray-500 border-l-2 border-blue-100">
                                                <span className="font-bold">Approach:</span> {q.idealApproach.substring(0, 100)}...
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {experience.questions.length > questionsPerPage && (
                                <div className="mt-4 flex justify-center items-center gap-2 pt-2 border-t border-gray-200/50">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setCurrentQuestionPage(p => Math.max(1, p - 1)); }}
                                        disabled={currentQuestionPage === 1}
                                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 transition-colors"
                                    >
                                        <IconChevronDown className="w-4 h-4 rotate-90 text-gray-600" />
                                    </button>
                                    <span className="text-xs font-medium text-gray-600 px-2">
                                        Page {currentQuestionPage} of {totalQuestionPages}
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setCurrentQuestionPage(p => Math.min(totalQuestionPages, p + 1)); }}
                                        disabled={currentQuestionPage === totalQuestionPages}
                                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 transition-colors"
                                    >
                                        <IconChevronDown className="w-4 h-4 -rotate-90 text-gray-600" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right: Narrative - Decreased Width (5/12) */}
                        <div className="lg:w-5/12 p-6 lg:p-8 bg-white">
                            <h5 className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-wider flex items-center gap-2">
                                <IconUser className="w-4 h-4" /> Overall Experience
                            </h5>
                            <div className="prose prose-sm prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {experience.overallExperience}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewExperienceCard;
