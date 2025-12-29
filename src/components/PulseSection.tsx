'use client';

import { useState, useEffect } from 'react';
import PulseTokenCard from './PulseTokenCard';
import { Token } from '@/types/token';
import { mockData } from '@/lib/mockData';

export default function PulseSection() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use mock data for now
        setTokens(mockData);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setTokens(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const newPairs = tokens.filter(t => t.category === 'new' || t.category === 'new-pairs').slice(0, 7);
  const finalStretch = tokens.filter(t => t.category === 'final' || t.category === 'final-stretch').slice(0, 7);
  const migrated = tokens.filter(t => t.category === 'migrated').slice(0, 7);

  return (
    <div className="w-full bg-gray-900 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-center gap-2 mb-8">
        <h1 className="text-3xl font-bold text-textPrimary">Pulse</h1>
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primaryBlue animate-pulse">
          <path d="M10 2L12.4 7.4L18 8.2L13.8 12.1L14.8 18L10 15.2L5.2 18L6.2 12.1L2 8.2L7.6 7.4L10 2Z" fill="currentColor" />
        </svg>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(col => (
            <div key={col} className="space-y-4">
              <div className="h-8 bg-gray-800 rounded w-24 animate-pulse" />
              {[1, 2, 3, 4, 5, 6, 7].map(item => (
                <div key={item} className="h-32 bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New Pairs Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-textPrimary">New Pairs</h2>
              <span className="text-xs text-textSecondary bg-gray-800 px-2.5 py-1 rounded-sm font-semibold">
                {newPairs.length}
              </span>
            </div>
            {newPairs.length > 0 ? (
              <div className="space-y-3">
                {newPairs.map((token, idx) => (
                  <PulseTokenCard key={token.id || idx} token={token} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-textSecondary text-sm">
                No tokens found
              </div>
            )}
          </div>

          {/* Final Stretch Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-textPrimary">Final Stretch</h2>
              <span className="text-xs text-textSecondary bg-gray-800 px-2.5 py-1 rounded-sm font-semibold">
                {finalStretch.length}
              </span>
            </div>
            {finalStretch.length > 0 ? (
              <div className="space-y-3">
                {finalStretch.map((token, idx) => (
                  <PulseTokenCard key={token.id || idx} token={token} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-textSecondary text-sm">
                No tokens found
              </div>
            )}
          </div>

          {/* Migrated Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-textPrimary">Migrated</h2>
              <span className="text-xs text-textSecondary bg-gray-800 px-2.5 py-1 rounded-sm font-semibold">
                {migrated.length}
              </span>
            </div>
            {migrated.length > 0 ? (
              <div className="space-y-3">
                {migrated.map((token, idx) => (
                  <PulseTokenCard key={token.id || idx} token={token} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-textSecondary text-sm">
                No tokens found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
