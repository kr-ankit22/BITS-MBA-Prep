import React, { useState } from 'react';
import { Recommendation, RecommendationSubject } from '../types';
import { IconBook, IconUser, IconClock, IconLink, IconInfo, IconSearch } from './Icons';
import { usePagination } from '../hooks/usePagination';
import Pagination from './Pagination';

interface RecommendationListProps {
    recommendations: Recommendation[];
}

const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations }) => {
    const [activeSubject, setActiveSubject] = useState<RecommendationSubject>(RecommendationSubject.Python);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter recommendations by subject and search query
    const filteredRecs = recommendations.filter(rec => {
        const matchesSubject = rec.subject === activeSubject;
        const matchesSearch = searchQuery === '' ||
            rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rec.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rec.goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rec.expectedLearning.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSubject && matchesSearch;
    });

    const {
        currentItems,
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        handlePageChange
    } = usePagination({ items: filteredRecs, defaultItemsPerPage: 6 });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Faculty Recommendations</h2>
                <p className="text-gray-500 mt-2 text-sm">Curated resources and practice sets from your professors.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3 space-y-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Subjects</h3>
                        <div className="space-y-1">
                            {Object.values(RecommendationSubject).map((subject) => (
                                <button
                                    key={subject}
                                    onClick={() => { setActiveSubject(subject); setSearchQuery(''); handlePageChange(1); }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between group
                                    ${activeSubject === subject
                                            ? 'bg-bits-blue text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    <span>{subject}</span>
                                    {activeSubject === subject && <IconBook className="w-4 h-4 opacity-80" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9 space-y-6">
                    {/* Header & Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-gray-900">{activeSubject}</h3>
                            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                                {filteredRecs.length} Resources
                            </span>
                        </div>

                        <div className="relative w-full md:w-64">
                            <IconSearch className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search recommendations..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); handlePageChange(1); }}
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-bits-blue focus:border-bits-blue outline-none transition-all"
                            />
                        </div>
                    </div>

                    {currentItems.length === 0 ? (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
                            <IconBook className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No recommendations found</h3>
                            <p className="text-gray-500 text-sm mt-1">
                                {searchQuery ? 'Try adjusting your search terms.' : 'Check back later for resources on this subject.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-6">
                                {currentItems.map((rec) => (
                                    <div key={rec.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ring-1 ring-black/5">
                                        {/* Header */}
                                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-gradient-to-r from-gray-50/50 to-white">
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 leading-tight mb-1">{rec.title}</h4>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <IconUser className="w-3 h-3" /> {rec.facultyName}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{rec.date}</span>
                                                </div>
                                            </div>
                                            {rec.timeToComplete && (
                                                <span className="flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
                                                    <IconClock className="w-3.5 h-3.5" />
                                                    {rec.timeToComplete}
                                                </span>
                                            )}
                                        </div>

                                        <div className="p-6 space-y-6">
                                            {/* Description */}
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {rec.description}
                                            </p>

                                            {/* Pedagogy Box */}
                                            <div className="bg-amber-50/50 rounded-lg border border-amber-100 p-4 space-y-3">
                                                <div>
                                                    <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1 flex items-center gap-1">
                                                        <IconInfo className="w-3.5 h-3.5" /> Goal
                                                    </h5>
                                                    <p className="text-sm text-gray-800 font-medium">{rec.goal}</p>
                                                </div>
                                                <div>
                                                    <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1">Expected Learning</h5>
                                                    <p className="text-sm text-gray-700">{rec.expectedLearning}</p>
                                                </div>
                                                {rec.remarks && (
                                                    <div className="pt-2 border-t border-amber-200/50 mt-2">
                                                        <p className="text-xs text-amber-900/80 italic">
                                                            <span className="font-semibold not-italic">Note:</span> {rec.remarks}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action */}
                                            {rec.url && (
                                                <div className="pt-2">
                                                    <a
                                                        href={rec.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-sm font-bold text-bits-blue hover:text-blue-800 hover:underline transition-colors"
                                                    >
                                                        <IconLink className="w-4 h-4" />
                                                        View Resource
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendationList;
