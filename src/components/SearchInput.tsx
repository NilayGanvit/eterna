'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface SearchInputProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export default function SearchInput({ onSearchChange, placeholder = 'Search by token or symbol...' }: SearchInputProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearchChange(value.toLowerCase());
  };

  const handleClear = () => {
    setQuery('');
    onSearchChange('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-md"
    >
      <div className="relative flex items-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="absolute left-3 text-textSecondary pointer-events-none"
        >
          <path
            d="M7 12.5C9.9375 12.5 12.5 9.9375 12.5 7C12.5 4.0625 9.9375 1.5 7 1.5C4.0625 1.5 1.5 4.0625 1.5 7C1.5 9.9375 4.0625 12.5 7 12.5ZM14.5 14.5L11.375 11.375"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-9 pr-9 py-2 bg-gray-800 border border-primaryStroke rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:border-primaryBlue focus:ring-1 focus:ring-primaryBlue text-sm transition-all"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-textSecondary hover:text-textPrimary transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm3.5 8.5L9.5 10.5 8 9l1.5-1.5-1-1L8 8l-1.5-1.5 1-1L8 6 6.5 4.5l1-1L8 5l1.5-1.5 1 1L9 8l1.5 1.5-1 1z" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}
