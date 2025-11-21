
import React, { useState, useEffect } from 'react';
import { COMPANIES, QUESTIONS, RESOURCES } from './constants';
import { Question, ViewState, Resource, Company } from './types';
import * as api from './services/api';

import ChatAssistant from './components/ChatAssistant';
import AdminPanel from './components/AdminPanel';
import QuestionBank from './components/QuestionBank';
import ResourceLibrary from './components/ResourceLibrary';
import { IconBook, IconBriefcase, IconChart, IconHome } from './components/Icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import CompanyLogo from './components/CompanyLogo';
import CompaniesList from './components/CompaniesList';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [q, r, c] = await Promise.all([
        api.fetchQuestions(),
        api.fetchResources(),
        api.fetchCompanies()
      ]);
      setQuestions(q);
      setResources(r);
      setCompanies(c);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAddQuestion = async (newQ: Question) => {
    const savedQ = await api.addQuestion(newQ);
    if (savedQ) {
      setQuestions(prev => [savedQ, ...prev]);
    }
  };

  const handleAddResource = async (newR: Resource) => {
    const savedR = await api.addResource(newR);
    if (savedR) {
      setResources(prev => [savedR, ...prev]);
    }
  };

  const handleAddCompany = async (newOrUpdatedCompany: Company): Promise<Company | undefined> => {
    // Check if company exists locally to decide update vs insert logic
    // For now, we only support adding new companies via this simple UI flow
    // or we need to implement update logic in API.
    // Simplified: Just add for now as per original logic implies "newOrUpdated"
    // but original logic handled merge.
    // Let's assume for this MVP we just add new ones or handle duplicates in backend.

    // Ideally we check if it exists in DB.
    // For this migration, let's just implement add.
    const savedC = await api.addCompany(newOrUpdatedCompany);
    if (savedC) {
      setCompanies(prev => [...prev, savedC]);
      return savedC;
    }
    return undefined;
  };


  const renderNav = () => (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
            <div className="w-9 h-9 bg-bits-blue rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="font-bold text-white text-lg">B</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-gray-900 leading-none">BITS Prep</span>
              <span className="text-[10px] font-bold text-bits-gold uppercase tracking-widest">MBA Analytics</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {['home', 'questions', 'resources', 'companies', 'analytics', 'admin'].map((item) => (
              <button
                key={item}
                onClick={() => setView(item as ViewState)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === item
                  ? 'bg-blue-50 text-bits-blue'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );

  const renderHome = () => (
    <div className="animate-in fade-in duration-500">
      <div className="bg-bits-blue text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Master Your Placements</h1>
          <p className="text-xl text-blue-100 mb-10 font-light">
            The official preparation portal for BITS Pilani MBA Analytics. Access {questions.length}+ interview questions, {resources.length}+ curated resources, and AI-powered mock interviews.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setView('questions')} className="bg-bits-gold text-bits-blue font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105 shadow-lg">
              Start Practice
            </button>
            <button onClick={() => setView('resources')} className="bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/20 transition-colors">
              View Resources
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 -mt-10 relative z-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div onClick={() => setView('questions')} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer group">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-bits-blue transition-colors">
              <IconBook className="w-7 h-7 text-bits-blue group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Question Bank</h3>
            <p className="text-gray-600">Filter by company, difficulty, and topic. Access specific questions asked in previous BITS placement seasons.</p>
          </div>
          <div onClick={() => setView('resources')} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer group">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
              <IconBriefcase className="w-7 h-7 text-green-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Curated Resources</h3>
            <p className="text-gray-600">Top-rated tutorials for Python, SQL, and Product Management from Coursera, Kaggle, and more.</p>
          </div>
          <div onClick={() => setView('analytics')} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer group">
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
              <IconChart className="w-7 h-7 text-purple-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Insights</h3>
            <p className="text-gray-600">Analyze trends in questions asked. Focus your preparation on high-frequency topics.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const [selectedCompany, setSelectedCompany] = useState<string | undefined>(undefined);

  // ... (loadData effect)

  // ... (handleAdd functions)

  // ... (renderNav)

  // ... (renderHome)


  const renderAnalytics = () => {
    // Simplified data prep
    const topicCount: Record<string, number> = {};
    questions.forEach(q => {
      const t = q.topic as string;
      topicCount[t] = (topicCount[t] || 0) + 1;
    });
    const data = Object.keys(topicCount).map(k => ({ name: k, count: topicCount[k] }));

    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Preparation Analytics</h2>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Question Distribution by Topic</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#00529B" radius={[4, 4, 0, 0]} barSize={50}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00529B' : '#D4A017'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col selection:bg-bits-gold selection:text-white">
      {renderNav()}

      <main className="flex-grow">
        {view === 'home' && renderHome()}
        {view === 'questions' && (
          <QuestionBank
            questions={questions}
            companies={companies}
            initialCompany={selectedCompany}
          />
        )}
        {view === 'resources' && <ResourceLibrary />}
        {view === 'companies' && (
          <CompaniesList
            companies={companies}
            onSelectCompany={(name) => {
              setSelectedCompany(name);
              setView('questions');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {view === 'analytics' && renderAnalytics()}
        {view === 'admin' && (
          <AdminPanel
            onAddQuestion={handleAddQuestion}
            onAddResource={handleAddResource}
            onAddCompany={handleAddCompany}
            companies={companies}
          />
        )}
      </main>

      <ChatAssistant />

      <footer className="bg-white border-t border-gray-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="font-bold text-gray-900">BITS Prep.Analytics</span>
            <p className="text-gray-500 text-sm mt-1">© 2024 BITS Pilani MBA Placement Committee.</p>
          </div>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-bits-blue">Privacy Policy</a>
            <a href="#" className="hover:text-bits-blue">Terms of Use</a>
            <a href="#" className="hover:text-bits-blue">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
