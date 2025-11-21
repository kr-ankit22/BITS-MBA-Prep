import React, { useState } from 'react';

interface CompanyLogoProps {
    url?: string;
    name: string;
    className?: string;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({ url, name, className = '' }) => {
    const [error, setError] = useState(false);

    // Generate initials
    const getInitials = (name: string) => {
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    // Generate consistent color from string
    const getColor = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - c.length) + c;
    };

    // Predefined nice colors to pick from instead of random hex
    const getNiceColor = (str: string) => {
        const colors = [
            'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
            'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
            'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
            'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500',
            'bg-rose-500'
        ];
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    if (!url || error) {
        return (
            <div className={`${className} ${getNiceColor(name)} flex items-center justify-center text-white font-bold shadow-sm`}>
                <span className="text-lg tracking-wider">{getInitials(name)}</span>
            </div>
        );
    }

    return (
        <img
            src={url}
            alt={name}
            className={`${className} object-contain bg-white`}
            onError={() => setError(true)}
        />
    );
};

export default CompanyLogo;
