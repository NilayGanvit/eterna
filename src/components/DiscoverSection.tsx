'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Token } from '@/types/token';
import { mockData } from '@/lib/mockData';
import { usePulseTokens } from '@/hooks/usePulseTokens';
import { useRealTimePrices } from './providers/RealTimePricesProvider';
import SearchInput from './SearchInput';

type SortBy = 'name' | 'price' | 'change24h' | 'marketCap' | 'volume';
type SortOrder = 'asc' | 'desc';

export default function DiscoverSection() {
  const { data: apiTokens, isLoading: apiLoading } = usePulseTokens();
  const { prices: realTimePrices } = useRealTimePrices();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('marketCap');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    if (apiTokens && apiTokens.length > 0) {
      setTokens(apiTokens);
    } else if (!apiLoading) {
      setTokens(mockData);
    }
  }, [apiTokens, apiLoading]);

  // Update tokens with real-time prices
  const updatedTokens = useMemo(() => {
    return tokens.map(token => {
      const realTimePrice = realTimePrices[token.id];
      if (realTimePrice !== undefined) {
        return { ...token, price: realTimePrice };
      }
      return token;
    });
  }, [tokens, realTimePrices]);

  const filteredTokens = updatedTokens.filter(t =>
    t.name.toLowerCase().includes(searchQuery) ||
    t.symbol.toLowerCase().includes(searchQuery)
  );

  const sortedTokens = [...filteredTokens].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'change24h':
        comparison = a.change24h - b.change24h;
        break;
      case 'marketCap':
        comparison = a.marketCap - b.marketCap;
        break;
      case 'volume':
        comparison = a.volume24h - b.volume24h;
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const totalPages = Math.ceil(sortedTokens.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTokens = sortedTokens.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const SortIndicator = ({ column }: { column: SortBy }) => {
    if (sortBy !== column) return <span className="text-textSecondary ml-1">⬍</span>;
    return <span className="text-primaryBlue ml-1">{sortOrder === 'desc' ? '▼' : '▲'}</span>;
  };

  return (
    <div className="w-full bg-gray-900 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-textPrimary">Discover</h1>
          <span className="text-sm text-textSecondary bg-gray-800 px-3 py-1 rounded-lg font-semibold">
            {filteredTokens.length} tokens
          </span>
        </div>

        <div className="flex-1 min-w-[250px]">
          <SearchInput onSearchChange={setSearchQuery} placeholder="Search tokens..." />
        </div>
      </div>

      {apiLoading && tokens.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-x-auto border border-primaryStroke rounded-lg"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primaryStroke bg-gray-800">
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="font-semibold text-textPrimary hover:text-primaryBlue transition-colors flex items-center"
                  >
                    Token <SortIndicator column="name" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('price')}
                    className="font-semibold text-textPrimary hover:text-primaryBlue transition-colors flex items-center justify-end w-full"
                  >
                    Price <SortIndicator column="price" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('change24h')}
                    className="font-semibold text-textPrimary hover:text-primaryBlue transition-colors flex items-center justify-end w-full"
                  >
                    24h Change <SortIndicator column="change24h" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('marketCap')}
                    className="font-semibold text-textPrimary hover:text-primaryBlue transition-colors flex items-center justify-end w-full"
                  >
                    Market Cap <SortIndicator column="marketCap" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('volume')}
                    className="font-semibold text-textPrimary hover:text-primaryBlue transition-colors flex items-center justify-end w-full"
                  >
                    Volume 24h <SortIndicator column="volume" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTokens.map((token, idx) => {
                const isPositive = token.change24h >= 0;
                return (
                  <motion.tr
                    key={token.id || idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-primaryStroke hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {token.logo ? (
                          <img
                            src={token.logo}
                            alt={token.symbol}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = `https://via.placeholder.com/32?text=${token.symbol.charAt(0)}`;
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {token.symbol.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-textPrimary">{token.name}</p>
                          <p className="text-xs text-textSecondary uppercase">{token.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-textPrimary">
                      ${token.price.toFixed(6)}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {isPositive ? '▲' : '▼'} {Math.abs(token.change24h).toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right text-textPrimary">
                      ${(token.marketCap / 1e9).toFixed(2)}B
                    </td>
                    <td className="px-4 py-3 text-right text-textPrimary">
                      ${(token.volume24h / 1e6).toFixed(1)}M
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-xs font-semibold rounded bg-gray-800 text-textSecondary hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages)
            .map((page, idx, arr) => (
              <div key={page}>
                {idx > 0 && arr[idx - 1] !== page - 1 && (
                  <span className="text-textSecondary">...</span>
                )}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-xs font-semibold rounded transition-colors ${
                    currentPage === page
                      ? 'bg-primaryBlue text-white'
                      : 'bg-gray-800 text-textSecondary hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              </div>
            ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-xs font-semibold rounded bg-gray-800 text-textSecondary hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
