import React, { useEffect, useRef, useState } from 'react';

function StatCard({ title, value, icon, color, trend, trendValue }) {
    const [displayValue, setDisplayValue] = useState(0);
    const cardRef = useRef(null);
    const hasAnimated = useRef(false);

    // Animated count-up effect
    useEffect(() => {
        if (hasAnimated.current || !value) return;
        
        const numValue = typeof value === 'number' ? value : parseInt(value) || 0;
        if (numValue === 0) return;

        hasAnimated.current = true;
        const duration = 1200;
        const steps = 40;
        const stepDuration = duration / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current++;
            const progress = current / steps;
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setDisplayValue(Math.round(numValue * eased));
            
            if (current >= steps) {
                setDisplayValue(numValue);
                clearInterval(timer);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [value]);

    const gradients = {
        blue: 'from-blue-500 to-cyan-400',
        green: 'from-emerald-500 to-teal-400',
        purple: 'from-violet-500 to-purple-400',
        orange: 'from-amber-500 to-orange-400',
        red: 'from-rose-500 to-pink-400',
        indigo: 'from-indigo-500 to-blue-400',
    };

    const bgGradients = {
        blue: 'from-blue-500/10 to-cyan-400/5 dark:from-blue-500/20 dark:to-cyan-400/10',
        green: 'from-emerald-500/10 to-teal-400/5 dark:from-emerald-500/20 dark:to-teal-400/10',
        purple: 'from-violet-500/10 to-purple-400/5 dark:from-violet-500/20 dark:to-purple-400/10',
        orange: 'from-amber-500/10 to-orange-400/5 dark:from-amber-500/20 dark:to-orange-400/10',
        red: 'from-rose-500/10 to-pink-400/5 dark:from-rose-500/20 dark:to-pink-400/10',
        indigo: 'from-indigo-500/10 to-blue-400/5 dark:from-indigo-500/20 dark:to-blue-400/10',
    };

    return (
        <div
            ref={cardRef}
            className={`relative overflow-hidden bg-gradient-to-br ${bgGradients[color] || bgGradients.blue} bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sm:p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 group`}
        >
            {/* Decorative gradient circle */}
            <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${gradients[color] || gradients.blue} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
            
            <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2 tabular-nums">
                        {displayValue?.toLocaleString() || '0'}
                    </p>
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            <svg className={`w-4 h-4 ${trend === 'up' ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            <span>{trendValue}%</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[color] || gradients.blue} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-xl">{icon}</span>
                </div>
            </div>
        </div>
    );
}

export default StatCard;
