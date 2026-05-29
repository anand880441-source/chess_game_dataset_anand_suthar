import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
        <div className="relative" ref={dropdownRef}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => query.trim() && suggestions.length > 0 && setShowDropdown(true)}
                    placeholder="Search players, openings, matches..."
                    className="w-64 md:w-80 pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
                    onClick={handleSearch}
                />
                {query && (
                    <XMarkIcon 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                        onClick={clearSearch}
                    />
                )}
            </div>

            {/* Dropdown Suggestions */}
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Loading...</div>
                    ) : suggestions.length > 0 ? (
                        <div>
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                >
                                    <span className="text-xl">{suggestion.icon}</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {suggestion.label}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                            {suggestion.type}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : query.trim() && (
                        <div className="p-4 text-center text-gray-500">
                            No results found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
