import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { InterviewExperience, Company } from '../types';
import * as api from '../services/api';
import ExperienceForm from './ExperienceForm';
import { IconCheckCircle, IconPlus, IconTime } from './Icons';

interface ContributorDashboardProps {
    companies: Company[];
}

const ContributorDashboard: React.FC<ContributorDashboardProps> = ({ companies }) => {
    const { user } = useAuth();
    const [experiences, setExperiences] = useState<InterviewExperience[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadMyExperiences();
        }
    }, [user]);

    const loadMyExperiences = async () => {
        if (!user) return;
        setLoading(true);
        const data = await api.fetchContributorExperiences(user.id);
        setExperiences(data as any); // Type assertion if needed due to strict matching
        setLoading(false);
    };

    if (isCreating) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <ExperienceForm
                    companies={companies}
                    contributorId={user?.id}
                    onSuccess={() => { setIsCreating(false); loadMyExperiences(); }}
                    onCancel={() => setIsCreating(false)}
                />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in">
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900">My Contributions</h2>
                    <p className="text-gray-500 mt-2">Share your interview journey and help juniors succeed.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-bits-blue text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-blue-800 transition-all flex items-center gap-2"
                >
                    <IconPlus className="w-5 h-5" /> Share New Experience
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading your submissions...</div>
            ) : experiences.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconPlus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No contributions yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">Your insights are valuable! Click the button above to add your first interview experience.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {experiences.map(exp => (
                        <div key={exp.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex justify-between items-center group">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{exp.companyName} - {exp.role}</h3>
                                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                    <span>{exp.date}</span>
                                    {exp.roundsSnapshot && <span>{exp.roundsSnapshot.length} Rounds</span>}
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${exp.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            exp.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {exp.status?.toUpperCase() || 'PENDING'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-gray-400">
                                {exp.status === 'approved' ? <IconCheckCircle className="w-6 h-6 text-green-500" /> : <IconTime className="w-6 h-6 text-yellow-500" />}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContributorDashboard;
