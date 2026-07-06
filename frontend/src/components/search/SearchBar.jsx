import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import searchService from '../../services/searchService';
import { debounce } from '../../utils/debounce';

function SearchBar() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        setLoading(true);
        try {
            const response = await searchService.getAutocomplete(searchQuery);
            if (response.success) {
                const allSuggestions = [];
                if (response.suggestions?.openings) {
                    allSuggestions.push(...response.suggestions.openings.map(o => ({ 
                        type: 'opening', 
                        label: o.name, 
                        value: o.eco,
                        icon: '📚'
                    })));
                }
                if (response.suggestions?.players) {
                    allSuggestions.push(...response.suggestions.players.map(p => ({ 
                        type: 'player', 
                        label: p.username, 
                        value: p.username,
                        icon: '👤'
                    })));
                }
                setSuggestions(allSuggestions.slice(0, 8));
                setShowDropdown(allSuggestions.length > 0);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = debounce(fetchSuggestions, 300);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedFetch(value);
    };

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
            setShowDropdown(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        if (suggestion.type === 'player') {
            navigate(`/players/${suggestion.value}`);
        } else if (suggestion.type === 'opening') {
            navigate(`/openings/${suggestion.value}`);
        }
        setShowDropdown(false);
        setQuery('');
    };

    const clearSearch = () => {
        setQuery('');
        setSuggestions([]);
        setShowDropdown(false);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative w-full">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => query.trim() && suggestions.length > 0 && setShowDropdown(true)}
                    placeholder="Search database (players, openings)..."
                    className="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 text-gray-900 dark:text-white transition-all duration-300 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                
                {/* Search Icon SVG */}
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 select-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>

                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Dropdown Suggestions */}
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800/50 animate-fade-in">
                    {loading ? (
                        <div className="p-4 text-center text-xs text-gray-400">Searching...</div>
                    ) : suggestions.length > 0 ? (
                        <div className="py-1">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                                >
                                    <span className="text-base select-none bg-gray-100 dark:bg-slate-800 p-1.5 rounded-lg group-hover:scale-105 transition-transform">{suggestion.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                            {suggestion.label}
                                        </p>
                                        <p className="text-[10px] font-bold text-primary-500 uppercase tracking-wide mt-0.5">
                                            {suggestion.type}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : query.trim() && (
                        <div className="p-4 text-center text-xs text-gray-500">
                            No match found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
