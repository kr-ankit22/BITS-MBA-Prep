import React, { useState, useMemo, useEffect } from 'react';
import { Question, Topic, Company, InterviewExperience } from '../types';
import { FEATURED_COMPANIES } from '../constants';
import Pagination from './Pagination';
import CompanyLogo from './CompanyLogo';
import { IconFilter, IconBriefcase, IconUser, IconChart, IconX, IconChevronDown, IconChevronUp } from './Icons';
import InterviewExperienceCard from './InterviewExperienceCard';
import CommunityStats from './CommunityStats';

interface QuestionBankProps {
  questions: Question[];
  companies: Company[];
  initialCompany?: string;
  experiences: InterviewExperience[];
}

// -- Helper Component for a Single Company Group (Questions) --
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

// -- Helper Component for a Single Company Group (Experiences) --
const CompanyExperienceGroup: React.FC<{
  companyName: string;
  companyLogo?: string;
  companySector?: string;
  experiences: InterviewExperience[];
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ companyName, companyLogo, companySector, experiences, isExpanded, onToggle }) => {
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
              <span className="bg-blue-50 text-bits-blue px-2 py-0.5 rounded font-medium">{experiences.length} Experiences</span>
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
          <div className="p-4 space-y-4">
            {experiences.map(exp => (
              <InterviewExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const QuestionBank: React.FC<QuestionBankProps> = ({ questions, companies, initialCompany, experiences }) => {
  const [viewMode, setViewMode] = useState<'questions' | 'experiences'>('questions'); // Default to questions
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>(initialCompany || 'All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
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
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  // Filter Lists
  const topics = useMemo(() => {
    const uniqueTopics = Array.from(new Set(questions.map(q => q.topic).filter(Boolean)));
    return ['All', ...uniqueTopics.sort()];
  }, [questions]);
  const companyNames = useMemo(() => {
    const names = Array.from(new Set(companies.map(c => c.name)));
    return ['All', ...names.sort((a: string, b: string) => {
      const aFeaturedIndex = FEATURED_COMPANIES.indexOf(a);
      const bFeaturedIndex = FEATURED_COMPANIES.indexOf(b);

      if (aFeaturedIndex !== -1 && bFeaturedIndex !== -1) return aFeaturedIndex - bFeaturedIndex;
      if (aFeaturedIndex !== -1) return -1;
      if (bFeaturedIndex !== -1) return 1;
      return a.localeCompare(b);
    })];
  }, [companies]);

  // Helper for sorting companies by priority
  const sortCompanies = (a: string, b: string) => {
    const aFeaturedIndex = FEATURED_COMPANIES.indexOf(a);
    const bFeaturedIndex = FEATURED_COMPANIES.indexOf(b);

    if (aFeaturedIndex !== -1 && bFeaturedIndex !== -1) return aFeaturedIndex - bFeaturedIndex;
    if (aFeaturedIndex !== -1) return -1;
    if (bFeaturedIndex !== -1) return 1;
    return a.localeCompare(b);
  };

  // 1. Filter the raw questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCompany = selectedCompany === 'All' || q.companyName === selectedCompany;
      const matchTopic = selectedTopic === 'All' || q.topic === selectedTopic;
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
  const filteredCompanyNames = useMemo(() => {
    return Object.keys(groupedByCompany).sort(sortCompanies);
  }, [groupedByCompany]);

  const totalPages = Math.ceil(filteredCompanyNames.length / companiesPerPage);

  const currentCompanyNames = filteredCompanyNames.slice(
    (currentPage - 1) * companiesPerPage,
    currentPage * companiesPerPage
  );

  // -- Experience Filtering Logic --
  const filteredExperiences = useMemo(() => {
    return experiences.filter(exp => {
      const matchCompany = selectedCompany === 'All' || exp.companyName === selectedCompany;
      const matchSearch = exp.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCompany && matchSearch;
    });
  }, [experiences, selectedCompany, searchQuery]);

  // Group Experiences by Company
  const groupedExperiences = useMemo(() => {
    const groups: Record<string, InterviewExperience[]> = {};
    filteredExperiences.forEach(exp => {
      if (!groups[exp.companyName]) {
        groups[exp.companyName] = [];
      }
      groups[exp.companyName].push(exp);
    });
    return groups;
  }, [filteredExperiences]);

  const filteredExperienceCompanies = useMemo(() => {
    return Object.keys(groupedExperiences).sort(sortCompanies);
  }, [groupedExperiences]);

  const totalExperiencePages = Math.ceil(filteredExperienceCompanies.length / companiesPerPage);

  const currentExperienceCompanies = filteredExperienceCompanies.slice(
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-bits-blue/10 rounded-lg">
            <IconBriefcase className="w-8 h-8 text-bits-blue" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Interview Questions</h2>
            <p className="text-gray-500">Practice with real questions asked by top recruiters.</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-gray-100 p-1 rounded-lg border border-gray-200 shadow-inner flex shrink-0">
          <button
            onClick={() => { setViewMode('experiences'); setCurrentPage(1); setExpandedCompany(null); }}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'experiences' ? 'bg-white text-bits-blue shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
          >
            <IconUser className="w-4 h-4" /> Experiences
          </button>
          <button
            onClick={() => { setViewMode('questions'); setCurrentPage(1); setExpandedCompany(null); }}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'questions' ? 'bg-white text-bits-blue shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
          >
            <IconBriefcase className="w-4 h-4" /> Question Bank
          </button>
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
                placeholder={viewMode === 'experiences' ? "Search student, role..." : "Keywords..."}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-bits-blue outline-none bg-white text-gray-900 shadow-sm"
              />
            </div>

            {viewMode === 'questions' && (
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
            )}

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

            {viewMode === 'questions' && (
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
            )}

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCompany('All');
                setSelectedTopic('All');
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

          {viewMode === 'experiences' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div className="text-sm text-gray-500">
                  Found <span className="font-bold text-gray-900">{filteredExperiences.length}</span> experiences across <span className="font-bold text-gray-900">{filteredExperienceCompanies.length}</span> companies
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

              {currentExperienceCompanies.length > 0 ? (
                currentExperienceCompanies.map(companyName => {
                  const company = companies.find(c => c.name === companyName);
                  return (
                    <CompanyExperienceGroup
                      key={companyName}
                      companyName={companyName}
                      companyLogo={company?.logo}
                      companySector={company?.sector}
                      experiences={groupedExperiences[companyName]}
                      isExpanded={expandedCompany === companyName}
                      onToggle={() => toggleCompany(companyName)}
                    />
                  );
                })
              ) : (
                <div className="text-center py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-purple-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                  <div className="relative z-10 max-w-lg mx-auto px-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-md animate-bounce-slow">
                      <span className="text-4xl">🚀</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Be the Trailblazer!</h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      No interview experiences here yet. This is your chance to be the first and help the entire community!
                    </p>

                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-sm text-left mx-auto max-w-sm">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="text-bits-gold">⚡</span> How to Contribute:
                      </h4>
                      <ol className="space-y-4 text-sm text-gray-700">
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center text-xs">1</span>
                          <span>Log in to the portal using your BITS Email.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 font-bold rounded-full flex items-center justify-center text-xs">2</span>
                          <span>Go to <strong>"My Contributions"</strong> and click <strong>"Add Experience"</strong>.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-pink-100 text-pink-700 font-bold rounded-full flex items-center justify-center text-xs">3</span>
                          <span>Share your journey and help juniors ace their dream roles! 🌟</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalExperiencePages}
                totalItems={filteredExperienceCompanies.length}
                itemsPerPage={companiesPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
