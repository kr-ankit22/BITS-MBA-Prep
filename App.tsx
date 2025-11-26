
import React, { useState, useEffect } from 'react';
import { Question, ViewState, Resource, Company, Recommendation } from './types';
import * as api from './services/api';

import ChatAssistant from './components/ChatAssistant';
import AdminPanel from './components/AdminPanel';
import QuestionBank from './components/QuestionBank';
import ResourceLibrary from './components/ResourceLibrary';
import FacultyDashboard from './components/FacultyDashboard';
import RecommendationList from './components/RecommendationList';
import LoginPage from './components/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import { IconBook, IconBriefcase, IconChart, IconHome, IconUser, IconLogOut } from './components/Icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import CompaniesList from './components/CompaniesList';

const Typewriter: React.FC<{ text: string; delay?: number }> = ({ text, delay = 150 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}<span className="animate-pulse">|</span></span>;
};

const MainContent: React.FC = () => {
  const { user, role, signOut } = useAuth();
  const [view, setView] = useState<ViewState>('home');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [q, r, c, rec] = await Promise.all([
        api.fetchQuestions(),
        api.fetchResources(),
        api.fetchCompanies(),
        api.fetchRecommendations()
      ]);
      setQuestions(q);
      setResources(r);
      setCompanies(c);
      setRecommendations(rec);
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
    const savedC = await api.addCompany(newOrUpdatedCompany);
    if (savedC) {
      setCompanies(prev => [...prev, savedC]);
      return savedC;
    }
    return undefined;
  };

  const handleAddRecommendation = async (newRec: Recommendation) => {
    const savedRec = await api.addRecommendation(newRec);
    if (savedRec) {
      setRecommendations(prev => [savedRec, ...prev]);
    }
  };

  const [selectedCompany, setSelectedCompany] = useState<string | undefined>(undefined);

  const renderNav = () => (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
            <img
              src="/BITS_Pilani-Logo.svg.png"
              alt="BITS Pilani"
              className="h-10 w-auto group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-gray-900 leading-none">BITS Pilani</span>
              <span className="text-[10px] font-bold text-bits-gold uppercase tracking-widest">MBA Analytics Prep</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => setView('home')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'home' ? 'bg-blue-50 text-bits-blue' : 'text-gray-600 hover:bg-gray-50'}`}>Home</button>
            <button onClick={() => setView('questions')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'questions' ? 'bg-blue-50 text-bits-blue' : 'text-gray-600 hover:bg-gray-50'}`}>Questions</button>
            <button onClick={() => setView('resources')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'resources' ? 'bg-blue-50 text-bits-blue' : 'text-gray-600 hover:bg-gray-50'}`}>Resources</button>
            <button onClick={() => setView('companies')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'companies' ? 'bg-blue-50 text-bits-blue' : 'text-gray-600 hover:bg-gray-50'}`}>Companies</button>
            <button onClick={() => setView('analytics')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'analytics' ? 'bg-blue-50 text-bits-blue' : 'text-gray-600 hover:bg-gray-50'}`}>Analytics</button>
            <button onClick={() => setView('recommendations')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'recommendations' ? 'bg-blue-50 text-bits-blue' : 'text-gray-600 hover:bg-gray-50'}`}>Faculty Recs</button>

            {role === 'admin' && (
              <button onClick={() => setView('admin')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'admin' ? 'bg-blue-50 text-bits-blue' : 'text-gray-600 hover:bg-gray-50'}`}>Admin</button>
            )}
            {role === 'faculty' && (
              <button onClick={() => setView('faculty')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'faculty' ? 'bg-blue-50 text-bits-blue' : 'text-gray-600 hover:bg-gray-50'}`}>Faculty Portal</button>
            )}

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500 hidden lg:inline-block">
                  {user.email} ({role})
                </span>
                <button onClick={() => { signOut(); setView('home'); }} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Sign Out">
                  <IconLogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button onClick={() => setView('login')} className="px-4 py-2 rounded-lg text-sm font-bold bg-bits-blue text-white hover:bg-blue-800 transition-colors flex items-center gap-2">
                <IconUser className="w-4 h-4" /> Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const renderHome = () => (
    <div className="animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-bits-blue via-bits-dark to-bits-maroon text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"> Unlock your Analytics <span className="text-bits-gold"><Typewriter text="Career" /></span></h1>
          <p className="text-xl text-blue-100 mb-10 font-light">
            Student Led preparation portal for BITS Pilani MBA Analytics. Access {questions.length}+ interview questions, {resources.length}+ curated resources, and comprehensive placement preparation.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setView('questions')} className="bg-bits-gold text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-500 transition-transform transform hover:scale-105 shadow-lg">
              Start Practice
            </button>
            <button onClick={() => setView('recommendations')} className="bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/20 transition-colors">
              Faculty Recs
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
            <p className="text-gray-600">Self-Analyze trends [or lack thereof :-] in questions asked. Focussed & Smart Preparation is the way!</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => {
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
                <Bar dataKey="count" fill="#003366" radius={[4, 4, 0, 0]} barSize={50}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#003366' : '#8B0000'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  // Protected Route Logic
  const renderContent = () => {
    if (view === 'home') return renderHome();
    if (view === 'questions') return <QuestionBank questions={questions} companies={companies} initialCompany={selectedCompany} />;
    if (view === 'resources') return <ResourceLibrary resources={resources} />;
    if (view === 'companies') return <CompaniesList companies={companies} onSelectCompany={(name) => { setSelectedCompany(name); setView('questions'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />;
    if (view === 'analytics') return renderAnalytics();
    if (view === 'recommendations') return <RecommendationList recommendations={recommendations} />;

    if (view === 'login') {
      if (user) {
        // Already logged in, redirect based on role
        if (role === 'admin') setView('admin');
        else if (role === 'faculty') setView('faculty');
        else setView('home');
        return null;
      }
      return <LoginPage onLoginSuccess={() => {
        // View will be updated by the useEffect or manual redirect if needed, 
        // but AuthContext update triggers re-render. 
        // We can force a view change here if we want to be explicit.
        // Let's just let the user decide or redirect to home.
        setView('home');
      }} />;
    }

    if (view === 'admin') {
      if (role !== 'admin') return <div className="p-8 text-center text-red-600">Access Denied. Admins only.</div>;
      return <AdminPanel onAddQuestion={handleAddQuestion} onAddResource={handleAddResource} onAddRecommendation={handleAddRecommendation} onAddCompany={handleAddCompany} companies={companies} />;
    }

    if (view === 'faculty') {
      if (role !== 'faculty') return <div className="p-8 text-center text-red-600">Access Denied. Faculty only.</div>;
      return <FacultyDashboard onAddRecommendation={handleAddRecommendation} />;
    }

    return renderHome();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col selection:bg-bits-gold selection:text-white">
      {renderNav()}
      <main className="flex-grow">
        {renderContent()}
      </main>
      <ChatAssistant />
      <footer className="bg-gradient-to-r from-bits-dark to-bits-blue border-t border-gray-200 py-10 mt-auto text-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left flex items-center gap-3">
            <img src="/BITS_Pilani-Logo.svg.png" alt="BITS Pilani" className="h-8 w-auto" />
            <div>
              <span className="font-bold">BITS Pilani MBA Analytics Prep</span>
              <p className="text-blue-200 text-sm mt-1">© 2024-26 BITS Pilani MBA Placement Committee</p>
            </div>
          </div>
          <div className="flex gap-6 text-blue-200 text-sm">
            <a href="#" className="hover:text-bits-gold">Privacy Policy</a>
            <a href="#" className="hover:text-bits-gold">Terms of Use</a>
            <a href="#" className="hover:text-bits-gold">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
};

export default App;
