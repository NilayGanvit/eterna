'use client';

import { useState, useEffect } from 'react';
import { Token } from '@/types/token';
import { mockTokens } from '@/lib/mockData';
import { motion } from 'framer-motion';

interface TokenTableProps {
  category: Token['category'];
}

export function TokenTable({ category }: TokenTableProps) {
  const [tokens, setTokens] = useState<Token[]>(
    mockTokens.filter(token => token.category === category)
  );
  const [sortBy, setSortBy] = useState<keyof Token>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(prevTokens =>
        prevTokens.map(token => ({
          ...token,
          price: token.price * (1 + (Math.random() - 0.5) * 0.01), // small random change
          change24h: token.change24h + (Math.random() - 0.5) * 0.1,
        }))
      );
    }, 2000); // update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const sortedTokens = [...tokens].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const handleSort = (key: keyof Token) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 capitalize text-gray-900 dark:text-white">{category.replace('-', ' ')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg shadow">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left p-4 cursor-pointer text-gray-900 dark:text-white" onClick={() => handleSort('name')}>
                Token
              </th>
              <th className="text-right p-4 cursor-pointer text-gray-900 dark:text-white" onClick={() => handleSort('price')}>
                Price
              </th>
              <th className="text-right p-4 cursor-pointer text-gray-900 dark:text-white" onClick={() => handleSort('change24h')}>
                24h Change
              </th>
              <th className="text-right p-4 cursor-pointer text-gray-900 dark:text-white" onClick={() => handleSort('volume24h')}>
                Volume
              </th>
              <th className="text-right p-4 cursor-pointer text-gray-900 dark:text-white" onClick={() => handleSort('marketCap')}>
                Market Cap
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTokens.map((token) => (
              <motion.tr
                key={token.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{token.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{token.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <motion.div
                    key={token.price}
                    initial={{ color: 'inherit' }}
                    animate={{ color: token.change24h >= 0 ? 'green' : 'red' }}
                    transition={{ duration: 0.5 }}
                    className="text-gray-900 dark:text-white"
                  >
                    ${token.price.toFixed(2)}
                  </motion.div>
                </td>
                <td className="p-4 text-right">
                  <motion.span
                    key={token.change24h}
                    className={token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                  </motion.span>
                </td>
                <td className="p-4 text-right text-gray-900 dark:text-white">${token.volume24h.toLocaleString()}</td>
                <td className="p-4 text-right text-gray-900 dark:text-white">${token.marketCap.toLocaleString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}