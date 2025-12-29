'use client';

import { useState, useEffect } from 'react';
import { Token } from '@/types/token';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { mockTokens } from '@/lib/mockData';

// Function to fetch token data from CoinGecko API
const fetchTokens = async (category: Token['category']): Promise<Token[]> => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d'
  );
  const data = await response.json();

  // Map API data to Token interface and assign categories
  const tokens: Token[] = data.map((coin: any, index: number) => {
    let category: Token['category'];
    if (index < 10) category = 'migrated';
    else if (index < 25) category = 'final-stretch';
    else category = 'new-pairs';

    return {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change1h: coin.price_change_percentage_1h_in_currency || 0,
      change24h: coin.price_change_percentage_24h || 0,
      change7d: coin.price_change_percentage_7d_in_currency || 0,
      volume24h: coin.total_volume,
      marketCap: coin.market_cap,
      category,
      logo: coin.image,
    };
  });

  return tokens.filter(token => token.category === category);
};

interface TokenTableProps {
  category: Token['category'];
}

export function TokenTable({ category }: TokenTableProps) {
  const { data: tokens = [], isLoading, error } = useQuery({
    queryKey: ['tokens', category],
    queryFn: () => fetchTokens(category),
    refetchInterval: 60000, // Refetch every minute
    retry: 3, // Retry failed requests 3 times
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Fallback to mock data if API fails
  const displayTokens = error ? mockTokens.filter(token => token.category === category) : tokens;

  const [sortBy, setSortBy] = useState<keyof Token>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Simulate additional real-time updates on top of API data
  const [liveTokens, setLiveTokens] = useState<Token[]>(tokens);

  useEffect(() => {
    setLiveTokens(displayTokens);
  }, [displayTokens]);

  useEffect(() => {
    if (displayTokens.length === 0) return;

    const interval = setInterval(() => {
      setLiveTokens(prevTokens =>
        prevTokens.map(token => ({
          ...token,
          price: token.price * (1 + (Math.random() - 0.5) * 0.005), // Smaller changes
          change24h: token.change24h + (Math.random() - 0.5) * 0.05,
        }))
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [displayTokens]);

  const sortedTokens = [...liveTokens].sort((a, b) => {
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

  if (isLoading && !error) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4 capitalize text-textPrimary">{category.replace('-', ' ')}</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 capitalize text-gray-900 dark:text-white">{category.replace('-', ' ')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-background rounded-lg shadow">
          <thead>
            <tr className="border-b border-primaryStroke">
              <th className="text-left p-4 cursor-pointer text-textPrimary" onClick={() => handleSort('name')}>
                Token
              </th>
              <th className="text-right p-4 cursor-pointer text-textPrimary" onClick={() => handleSort('price')}>
                Price
              </th>
              <th className="text-right p-4 cursor-pointer text-textPrimary" onClick={() => handleSort('change1h')}>
                1h
              </th>
              <th className="text-right p-4 cursor-pointer text-textPrimary" onClick={() => handleSort('change24h')}>
                24h
              </th>
              <th className="text-right p-4 cursor-pointer text-textPrimary" onClick={() => handleSort('change7d')}>
                7d
              </th>
              <th className="text-right p-4 cursor-pointer text-textPrimary" onClick={() => handleSort('volume24h')}>
                Volume
              </th>
              <th className="text-right p-4 cursor-pointer text-textPrimary" onClick={() => handleSort('marketCap')}>
                Market Cap
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTokens.map((token) => (
              <motion.tr
                key={token.id}
                className="border-b border-primaryStroke hover:bg-primaryBlue/10 cursor-pointer transition-colors"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    {token.logo ? (
                      <img src={token.logo} alt={token.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    )}
                    <div>
                    <div className="font-semibold text-textPrimary">{token.name}</div>
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
                    className="text-textPrimary"
                  >
                    ${token.price.toFixed(2)}
                  </motion.div>
                </td>
                <td className="p-4 text-right">
                  <motion.span
                    key={token.change1h}
                    className={token.change1h >= 0 ? 'text-green-500' : 'text-red-500'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {token.change1h >= 0 ? '+' : ''}{token.change1h.toFixed(2)}%
                  </motion.span>
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
                <td className="p-4 text-right">
                  <motion.span
                    key={token.change7d}
                    className={token.change7d >= 0 ? 'text-green-500' : 'text-red-500'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {token.change7d >= 0 ? '+' : ''}{token.change7d.toFixed(2)}%
                  </motion.span>
                </td>
                <td className="p-4 text-right text-textPrimary">${token.volume24h.toLocaleString()}</td>
                <td className="p-4 text-right text-textPrimary">${token.marketCap.toLocaleString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}