

import React, { useState, useMemo, useEffect } from 'react';
import { Question, Topic, Company } from '../types';
import Pagination from './Pagination';
import CompanyLogo from './CompanyLogo';
import { IconFilter, IconBriefcase, IconUser, IconChart, IconX, IconChevronDown, IconChevronUp } from './Icons';

interface QuestionBankProps {
  questions: Question[];
  companies: Company[];
  initialCompany?: string;
}

// -- Helper Component for a Single Company Group --
const CompanyGroupCard: React.FC<{
  companyName: string;
  companyLogo?: string;
  companySector?: string;
  questions: Question[];
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ companyName, companyLogo, companySector, questions, isExpanded, onToggle }) => {
  // Internal pagination for questions inside the company card
  const [internalPage, setInternalPage] = useState(1);
  const itemsPerPage = 5;
  const totalInternalPages = Math.ceil(questions.length / itemsPerPage);

  const currentInternalQuestions = questions.slice(
    (internalPage - 1) * itemsPerPage,
    internalPage * itemsPerPage
  );

  // Reset internal page if collapsed or questions change
  useMemo(() => {
    if (!isExpanded) setInternalPage(1);
  }, [isExpanded, questions]);

  return (
    <div className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden group ${isExpanded ? 'shadow-lg border-bits-blue ring-1 ring-bits-blue/10' : 'shadow-sm border-gray-200 hover:shadow-md'}`}>
      {/* Card Header */}
      <div
        onClick={onToggle}
        className="p-6 cursor-pointer flex items-center justify-between select-none bg-gradient-to-r from-white to-gray-50/30"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1 shadow-sm overflow-hidden">
            <CompanyLogo
              url={companyLogo}
              name={companyName}
              className="w-full h-full"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{companyName}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span className="bg-blue-50 text-bits-blue px-2 py-0.5 rounded font-medium">{questions.length} Questions</span>
              <span>•</span>
              <span>{companySector || 'General'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isExpanded ? <IconChevronUp className="w-5 h-5 text-bits-blue" /> : <IconChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 animate-in slide-in-from-top-2 duration-200">
          <div className="p-2 sm:p-4 space-y-3">
            {currentInternalQuestions.map((q) => (
              <div key={q.id} className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {/* Category Badge Removed */}

                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border
                                ${q.difficulty === 'Easy' ? 'text-green-700 bg-green-50 border-green-100' :
                          q.difficulty === 'Medium' ? 'text-yellow-700 bg-yellow-50 border-yellow-100' :
                            'text-red-700 bg-red-50 border-red-100'}`}>
                        {q.difficulty}
                      </span>
                      {q.askedInBITS && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-bits-gold text-white border border-yellow-600 shadow-sm">
                          BITS Pilani
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-gray-900 leading-snug">{q.text}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-3 border-b border-gray-50 pb-3">
                  <span className="flex items-center gap-1"><IconChart className="w-3 h-3" /> {q.topic}</span>
                  <span className="flex items-center gap-1"><IconUser className="w-3 h-3" /> {q.role}</span>
                </div>

                {q.idealApproach && (
                  <details className="group/ans">
                    <summary className="cursor-pointer text-bits-blue text-xs font-bold flex items-center gap-1.5 hover:text-blue-800 select-none">
                      <span>View Ideal Approach</span>
                      <IconChevronDown className="w-3 h-3 group-open/ans:rotate-180 transition-transform" />
                    </summary>
                    <div className="mt-3 p-4 bg-blue-50/30 rounded-lg border border-blue-100/50 text-gray-800 text-sm leading-relaxed">
                      <div className="flex gap-2">
                        <span className="text-base shrink-0">💡</span>
                        <div>{q.idealApproach}</div>
                      </div>
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>

          {/* Internal Pagination (only if > 5 questions) */}
          {questions.length > itemsPerPage && (
            <div className="px-4 pb-4 flex justify-center">
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm">
                <button
                  onClick={(e) => { e.stopPropagation(); setInternalPage(p => Math.max(1, p - 1)); }}
                  disabled={internalPage === 1}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                >
                  <IconChevronDown className="w-4 h-4 rotate-90 text-gray-600" />
                </button>
                <span className="text-xs font-medium text-gray-600 px-2">
                  Page {internalPage} of {totalInternalPages}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setInternalPage(p => Math.min(totalInternalPages, p + 1)); }}
                  disabled={internalPage === totalInternalPages}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                >
                  <IconChevronDown className="w-4 h-4 -rotate-90 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


const QuestionBank: React.FC<QuestionBankProps> = ({ questions, companies, initialCompany }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>(initialCompany || 'All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  // const [selectedCategory, setSelectedCategory] = useState<string>('All'); // Removed
  const [onlyBITS, setOnlyBITS] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [companiesPerPage, setCompaniesPerPage] = useState(5);
  const [showFilters, setShowFilters] = useState(false);

  // Update selected company if initialCompany changes (e.g. navigation)
  useEffect(() => {
    if (initialCompany) {
      setSelectedCompany(initialCompany);
    }
  }, [initialCompany]);

  // State to track which company card is expanded. Null means none. 
  // You could use an array for multiple expansions, but single expansion is often cleaner.
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  // Filter Lists
  // Filter Lists
  const topics = useMemo(() => {
    const uniqueTopics = Array.from(new Set(questions.map(q => q.topic).filter(Boolean)));
    return ['All', ...uniqueTopics.sort()];
  }, [questions]);
  // const categories = ['All', 'Technical', 'Behavioral', 'HR', 'Case']; // Removed
  const companyNames = ['All', ...Array.from(new Set(companies.map(c => c.name)))];



  // 1. Filter the raw questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCompany = selectedCompany === 'All' || q.companyName === selectedCompany;
      const matchTopic = selectedTopic === 'All' || q.topic === selectedTopic;
      // const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory; // Removed
      const matchBITS = !onlyBITS || q.askedInBITS;

      return matchSearch && matchCompany && matchTopic && matchBITS;

    });
  }, [questions, searchQuery, selectedCompany, selectedTopic, onlyBITS]);

  // 2. Group filtered questions by Company Name
  const groupedByCompany = useMemo(() => {
    const groups: Record<string, Question[]> = {};
    filteredQuestions.forEach(q => {
      if (!groups[q.companyName]) {
        groups[q.companyName] = [];
      }
      groups[q.companyName].push(q);
    });
    return groups;
  }, [filteredQuestions]);

  // 3. Pagination Logic (Based on Companies, not questions)
  const filteredCompanyNames = Object.keys(groupedByCompany);
  const totalPages = Math.ceil(filteredCompanyNames.length / companiesPerPage);

  const currentCompanyNames = filteredCompanyNames.slice(
    (currentPage - 1) * companiesPerPage,
    currentPage * companiesPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedCompany(null); // Collapse all on page change
  };

  const toggleCompany = (name: string) => {
    setExpandedCompany(prev => prev === name ? null : name);
  };

  const selectClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-bits-blue outline-none bg-white text-gray-900 shadow-sm";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-bits-blue/10 rounded-lg">
          <IconBriefcase className="w-8 h-8 text-bits-blue" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Interview Questions</h2>
          <p className="text-gray-500">Practice with real questions asked by top recruiters.</p>
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`w-full flex items-center justify-center gap-2 font-medium py-3 rounded-lg shadow-sm transition-all ${showFilters ? 'bg-bits-blue text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
        >
          <IconFilter className="w-5 h-5" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Sidebar Filters */}
        <aside className={`w-full lg:w-72 bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-24 transition-all duration-300 ease-in-out ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
              <IconFilter className="w-5 h-5 text-bits-gold" />
              Filters
            </div>
            <button onClick={() => setShowFilters(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
              <IconX className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Search</label>
              <input
                type="text"
                placeholder="Keywords..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-bits-blue outline-none bg-white text-gray-900 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Topic</label>
              {/* Topic Filter */}
              <div className="relative">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="appearance-none w-full bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-bits-blue/20 focus:border-bits-blue text-sm font-medium transition-all cursor-pointer hover:border-gray-300"
                >
                  {topics.map(t => (
                    <option key={t} value={t}>{t === 'All' ? 'All Topics' : t}</option>
                  ))}
                </select>
                <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Company</label>
              <select
                value={selectedCompany}
                onChange={e => { setSelectedCompany(e.target.value); setCurrentPage(1); }}
                className={selectClass}
              >
                {companyNames.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-50 rounded-lg transition-colors select-none">
                <input
                  type="checkbox"
                  checked={onlyBITS}
                  onChange={e => { setOnlyBITS(e.target.checked); setCurrentPage(1); }}
                  className="w-5 h-5 text-bits-blue rounded border-gray-300 focus:ring-bits-blue bg-white"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-bits-blue transition-colors">
                  Asked in BITS Only
                </span>
              </label>
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCompany('All');
                setSelectedTopic('All');
                // setSelectedCategory('All'); // Removed
                setOnlyBITS(false);
                setCurrentPage(1);

              }}
              className="w-full text-sm text-gray-500 hover:text-gray-700 underline mt-2"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div className="text-sm text-gray-500">
              Found <span className="font-bold text-gray-900">{filteredQuestions.length}</span> questions across <span className="font-bold text-gray-900">{filteredCompanyNames.length}</span> companies
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline">Companies per page:</span>
              <select
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none bg-white text-gray-900 shadow-sm"
                value={companiesPerPage}
                onChange={(e) => { setCompaniesPerPage(Number(e.target.value)); setCurrentPage(1); }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {currentCompanyNames.map(companyName => {
              const company = companies.find(c => c.name === companyName);
              return (
                <CompanyGroupCard
                  key={companyName}
                  companyName={companyName}
                  companyLogo={company?.logo}
                  companySector={company?.sector}
                  questions={groupedByCompany[companyName]}
                  isExpanded={expandedCompany === companyName}
                  onToggle={() => toggleCompany(companyName)}
                />
              );
            })}

            {currentCompanyNames.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                  <IconFilter className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No questions found</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto mt-2">Try adjusting your search or filters to find what you're looking for.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCompany('All');
                    setSelectedTopic('All');
                    // setSelectedCategory('All'); // Removed
                    setOnlyBITS(false);

                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredCompanyNames.length}
            itemsPerPage={companiesPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
