import React, { useState, useMemo } from 'react';
import { Company } from '../types';
import Pagination from './Pagination';
import CompanyLogo from './CompanyLogo';
import { IconSearch, IconX, IconBriefcase, IconDatabase } from './Icons';

interface CompaniesListProps {
    companies: Company[];
    questionCounts: Record<string, number>;
    onSelectCompany: (name: string) => void;
}

const CompaniesList: React.FC<CompaniesListProps> = ({ companies, questionCounts, onSelectCompany }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(24); // Increased for density

    // Filter and Sort companies
    const processedCompanies = useMemo(() => {
        let filtered = companies;

        // Search filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = companies.filter(c =>
                c.name.toLowerCase().includes(lowerQuery) ||
                c.sector.toLowerCase().includes(lowerQuery) ||
                c.roles.some(r => r.toLowerCase().includes(lowerQuery))
            );
        }

        // Sort by question count (Big Recruiters first) then name
        return [...filtered].sort((a, b) => {
            const countA = questionCounts[a.name] || 0;
            const countB = questionCounts[b.name] || 0;
            if (countB !== countA) return countB - countA;
            return a.name.localeCompare(b.name);
        });
    }, [companies, searchQuery, questionCounts]);

    const totalQuestions = Object.values(questionCounts).reduce((a: number, b: number) => a + b, 0);

    // Pagination logic
    const totalPages = Math.ceil(processedCompanies.length / itemsPerPage);
    const currentCompanies = processedCompanies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in">
            {/* Page Header & Stats */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Recruiting Partners</h2>
                    <p className="text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-2">
                        <IconBriefcase className="w-4 h-4 text-bits-blue" />
                        Explore {companies.length} top companies hiring from BITS Pilani MBA
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <IconBriefcase className="w-5 h-5 text-bits-blue" />
                        </div>
                        <div>
                            <span className="block text-2xl font-bold text-gray-900 leading-none">{companies.length}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Recruiters</span>
                        </div>
                    </div>
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                        <div className="p-2 bg-maroon-50 rounded-lg" style={{ backgroundColor: 'rgba(139, 0, 0, 0.05)' }}>
                            <IconDatabase className="w-5 h-5 text-bits-maroon" />
                        </div>
                        <div>
                            <span className="block text-2xl font-bold text-gray-900 leading-none">{totalQuestions}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Questions</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-10 max-w-2xl mx-auto relative group">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by company, sector, or role (e.g., 'Abbott', 'Finance', 'Data Science')..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-bits-blue/10 focus:border-bits-blue outline-none shadow-sm transition-all text-lg tracking-tight"
                    />
                    <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-bits-blue transition-colors" />
                    {searchQuery && (
                        <button
                            onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full"
                        >
                            <IconX className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {currentCompanies.map(company => {
                    const qCount = questionCounts[company.name] || 0;
                    return (
                        <div
                            key={company.id}
                            onClick={() => onSelectCompany(company.name)}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-bits-blue/30 transition-all cursor-pointer group flex flex-col items-center text-center relative overflow-hidden"
                        >
                            {/* Question Count Badge */}
                            {qCount > 5 && (
                                <div className="absolute top-0 right-0 p-2">
                                    <span className="flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-bits-blue opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-bits-blue"></span>
                                    </span>
                                </div>
                            )}

                            {/* Logo */}
                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 mb-4 group-hover:scale-110 transition-transform">
                                <CompanyLogo
                                    url={company.logo}
                                    name={company.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* Info */}
                            <div className="space-y-1 flex-grow">
                                <h3 className="text-sm font-bold text-gray-900 group-hover:text-bits-blue transition-colors line-clamp-1">{company.name}</h3>
                                <p className="text-[10px] font-medium text-bits-maroon uppercase tracking-tight opacity-70">{company.sector}</p>
                            </div>

                            {/* Footer Activity */}
                            <div className="mt-4 pt-3 border-t border-gray-50 w-full flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                    <IconDatabase className="w-3 h-3" /> {qCount} Qs
                                </span>
                                <span className="text-[10px] font-extrabold text-bits-blue group-hover:underline">VIEW &rarr;</span>
                            </div>
                        </div>
                    );
                })}

                {processedCompanies.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <div className="inline-flex p-6 bg-gray-50 rounded-full mb-4">
                            <IconSearch className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700">No recruiters found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search query.</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-6 text-bits-blue font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-12">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={processedCompanies.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default CompaniesList;
