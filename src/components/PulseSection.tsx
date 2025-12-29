'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PulseTokenCard from './PulseTokenCard';
import { Token } from '@/types/token';
import { mockData } from '@/lib/mockData';
import { usePulseTokens } from '@/hooks/usePulseTokens';

type SortBy = 'price' | 'change24h' | 'marketCap' | 'volume';

export default function PulseSection() {
  const { data: apiTokens, isLoading: apiLoading } = usePulseTokens();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('marketCap');

  useEffect(() => {
    if (apiTokens && apiTokens.length > 0) {
      setTokens(apiTokens);
    } else if (!apiLoading) {
      setTokens(mockData);
    }
  }, [apiTokens, apiLoading]);

  const sortTokens = (items: Token[]) => {
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'change24h':
          return b.change24h - a.change24h;
        case 'marketCap':
          return b.marketCap - a.marketCap;
        case 'volume':
          return b.volume24h - a.volume24h;
        default:
          return 0;
      }
    });
  };

  const newPairs = sortTokens(tokens.filter(t => t.category === 'new' || t.category === 'new-pairs')).slice(0, 7);
  const finalStretch = sortTokens(tokens.filter(t => t.category === 'final' || t.category === 'final-stretch')).slice(0, 7);
  const migrated = sortTokens(tokens.filter(t => t.category === 'migrated')).slice(0, 7);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="w-full bg-gray-900 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-textPrimary">Pulse</h1>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primaryBlue animate-pulse">
              <path d="M10 2L12.4 7.4L18 8.2L13.8 12.1L14.8 18L10 15.2L5.2 18L6.2 12.1L2 8.2L7.6 7.4L10 2Z" fill="currentColor" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-textSecondary font-medium">Sort by:</span>
            <div className="flex gap-1.5">
              {(['price', 'change24h', 'marketCap', 'volume'] as const).map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded transition-all ${
                    sortBy === sort
                      ? 'bg-primaryBlue text-white'
                      : 'bg-gray-800 text-textSecondary hover:bg-gray-700'
                  }`}
                >
                  {sort === 'price' && 'Price'}
                  {sort === 'change24h' && '24h %'}
                  {sort === 'marketCap' && 'MC'}
                  {sort === 'volume' && 'Volume'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {apiLoading && tokens.length === 0 ? (
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
        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="show">
          <motion.div className="space-y-4" variants={itemVariants}>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-textPrimary">New Pairs</h2>
              <span className="text-xs text-textSecondary bg-gray-800 px-2.5 py-1 rounded-sm font-semibold">{newPairs.length}</span>
            </div>
            {newPairs.length > 0 ? (
              <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="show">
                {newPairs.map((token, idx) => (
                  <motion.div key={token.id || idx} variants={itemVariants}>
                    <PulseTokenCard token={token} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-8 text-textSecondary text-sm">No tokens found</div>
            )}
          </motion.div>

          <motion.div className="space-y-4" variants={itemVariants}>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-textPrimary">Final Stretch</h2>
              <span className="text-xs text-textSecondary bg-gray-800 px-2.5 py-1 rounded-sm font-semibold">{finalStretch.length}</span>
            </div>
            {finalStretch.length > 0 ? (
              <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="show">
                {finalStretch.map((token, idx) => (
                  <motion.div key={token.id || idx} variants={itemVariants}>
                    <PulseTokenCard token={token} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-8 text-textSecondary text-sm">No tokens found</div>
            )}
          </motion.div>

          <motion.div className="space-y-4" variants={itemVariants}>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-textPrimary">Migrated</h2>
              <span className="text-xs text-textSecondary bg-gray-800 px-2.5 py-1 rounded-sm font-semibold">{migrated.length}</span>
            </div>
            {migrated.length > 0 ? (
              <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="show">
                {migrated.map((token, idx) => (
                  <motion.div key={token.id || idx} variants={itemVariants}>
                    <PulseTokenCard token={token} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-8 text-textSecondary text-sm">No tokens found</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
