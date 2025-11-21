import React, { useState, useMemo } from 'react';
import { Company } from '../types';
import Pagination from './Pagination';
import CompanyLogo from './CompanyLogo';
import { IconFilter, IconX } from './Icons';

interface CompaniesListProps {
    companies: Company[];
    onSelectCompany: (name: string) => void;
}

const CompaniesList: React.FC<CompaniesListProps> = ({ companies, onSelectCompany }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Filter companies
    const filteredCompanies = useMemo(() => {
        if (!searchQuery) return companies;
        const lowerQuery = searchQuery.toLowerCase();
        return companies.filter(c =>
            c.name.toLowerCase().includes(lowerQuery) ||
            c.sector.toLowerCase().includes(lowerQuery) ||
            c.roles.some(r => r.toLowerCase().includes(lowerQuery))
        );
    }, [companies, searchQuery]);

    // Pagination logic
    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
    const currentCompanies = filteredCompanies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">Recruiting Partners</h2>
                <p className="text-gray-500 mt-2">Top companies hiring from BITS Pilani MBA</p>
            </div>

            {/* Search Bar */}
            <div className="mb-8 max-w-md mx-auto relative">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search companies, sectors, or roles..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bits-blue focus:border-bits-blue outline-none shadow-sm transition-all"
                    />
                    <IconFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    {searchQuery && (
                        <button
                            onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <IconX className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Sector</th>
                                <th className="px-6 py-4">Target Roles</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentCompanies.map(company => (
                                <tr key={company.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1 shadow-sm overflow-hidden shrink-0">
                                                <CompanyLogo
                                                    url={company.logo}
                                                    name={company.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-gray-900">{company.name}</h3>
                                                <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{company.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-bits-blue">
                                            {company.sector}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {company.roles.slice(0, 3).map(role => (
                                                <span key={role} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                                    {role}
                                                </span>
                                            ))}
                                            {company.roles.length > 3 && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium text-gray-500">
                                                    +{company.roles.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onSelectCompany(company.name)}
                                            className="text-sm font-bold text-bits-blue hover:text-blue-800 hover:underline decoration-2 underline-offset-2 transition-all"
                                        >
                                            View Questions
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredCompanies.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        {searchQuery ? 'No companies match your search.' : 'No companies found.'}
                    </div>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredCompanies.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default CompaniesList;
