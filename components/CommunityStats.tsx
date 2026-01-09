import React, { useMemo } from 'react';
import { InterviewExperience } from '../types';
import { IconChart, IconCheckCircle, IconBriefcase, IconSparkles, IconUser } from './Icons';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface CommunityStatsProps {
    experiences: InterviewExperience[];
}

const CommunityStats: React.FC<CommunityStatsProps> = ({ experiences }) => {
    const stats = useMemo(() => {
        const total = experiences.length;
        if (total === 0) return null;

        const offers = experiences.filter(e => e.outcome === 'Offer').length;
        const successRate = Math.round((offers / total) * 100);

        const companyCounts = experiences.reduce((acc, curr) => {
            acc[curr.companyName] = (acc[curr.companyName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const sortedCompanies = Object.entries(companyCounts)
            .sort((a, b) => (b[1] as number) - (a[1] as number))
            .slice(0, 3); // Top 3

        const topCompany = sortedCompanies[0] ? sortedCompanies[0][0] : 'N/A';
        const activeCompanies = Object.keys(companyCounts).length;

        // Data for Pie Chart
        const outcomes = experiences.reduce((acc, curr) => {
            const out = curr.outcome || 'Unknown';
            acc[out] = (acc[out] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const chartData = Object.keys(outcomes).map(key => ({
            name: key,
            value: outcomes[key]
        }));

        return { total, successRate, topCompany, activeCompanies, chartData, sortedCompanies };
    }, [experiences]);

    if (!stats) return null;

    const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#9CA3AF']; // Green, Red, Yellow, Gray

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-in slide-in-from-top-4 duration-500">
            {/* 1. Hero Stat: Total Contributions */}
            <div className="md:col-span-2 bg-gradient-to-br from-bits-blue to-blue-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <IconSparkles className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-blue-200 text-sm font-bold uppercase tracking-wider">
                        <IconUser className="w-4 h-4" /> Community Pulse
                    </div>
                    <div className="text-5xl font-extrabold mb-1 tracking-tight">{stats.total}</div>
                    <div className="text-lg font-medium text-blue-100">Interview Experiences Shared</div>
                    <p className="mt-4 text-xs text-blue-300 max-w-sm">
                        Real stories from seniors who cracked the code. Join the movement and pay it forward! 🚀
                    </p>
                </div>
            </div>

            {/* 2. Success Rate & Companies Box */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <IconCheckCircle className="w-4 h-4 text-green-500" /> Success Rate
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-gray-900">{stats.successRate}%</span>
                        <span className="text-sm text-gray-500 font-medium mb-1">offers received</span>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <IconBriefcase className="w-4 h-4 text-bits-blue" /> Top Targets
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {stats.sortedCompanies.map(([name, count]) => (
                            <span key={name} className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-full border border-gray-200">
                                {name} ({count})
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Outcome Distribution Chart */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow relative">
                <div className="absolute top-4 left-4 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <IconChart className="w-4 h-4 text-purple-500" /> Outcomes
                </div>
                <div className="w-full h-32 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={25}
                                outerRadius={40}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {stats.chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex gap-3 justify-center w-full mt-1">
                    {stats.chartData.slice(0, 2).map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-1 text-[10px] text-gray-500">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            {entry.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommunityStats;
