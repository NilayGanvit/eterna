'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Token } from '@/types/token';
import { useRealTimePrices } from './providers/RealTimePricesProvider';

// Function to fetch trending tokens from CoinGecko API
const fetchTrendingTokens = async (): Promise<Token[]> => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d'
  );
  const data = await response.json();

  return data.map((coin: any) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    price: coin.current_price,
    change1h: coin.price_change_percentage_1h_in_currency || 0,
    change24h: coin.price_change_percentage_24h || 0,
    change7d: coin.price_change_percentage_7d_in_currency || 0,
    volume24h: coin.total_volume,
    marketCap: coin.market_cap,
    category: 'trending' as Token['category'],
    logo: coin.image,
  }));
};

interface TrackerCardProps {
  token: Token;
  type: 'gainer' | 'loser';
}

function TrackerCard({ token, type }: TrackerCardProps) {
  const change = type === 'gainer' ? token.change24h : token.change24h;
  const isPositive = change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 dark:bg-gray-800 rounded-lg p-4 border border-primaryStroke hover:border-primaryBlue/50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={token.logo} alt={token.name} className="w-8 h-8 rounded-full" />
          <div>
            <h3 className="font-semibold text-textPrimary">{token.name}</h3>
            <p className="text-sm text-textSecondary">{token.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-textPrimary">${token.price.toFixed(2)}</p>
          <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrackersSection() {
  const { data: tokens = [], isLoading, error } = useQuery({
    queryKey: ['trending-tokens'],
    queryFn: fetchTrendingTokens,
    refetchInterval: 60000,
  });
  const { prices: realTimePrices } = useRealTimePrices();

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

  const [topGainers, setTopGainers] = useState<Token[]>([]);
  const [topLosers, setTopLosers] = useState<Token[]>([]);

  useEffect(() => {
    if (updatedTokens.length > 0) {
      const sortedByChange = [...updatedTokens].sort((a, b) => b.change24h - a.change24h);
      setTopGainers(sortedByChange.slice(0, 10));
      setTopLosers(sortedByChange.slice(-10).reverse());
    }
  }, [updatedTokens]);

  if (isLoading) {
    return (
      <div className="w-full bg-gray-900 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue mx-auto"></div>
          <p className="text-textSecondary mt-4">Loading trackers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gray-900 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <p className="text-red-400">Error loading trackers. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-textPrimary mb-8">Trackers</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Gainers */}
          <div>
            <h2 className="text-xl font-semibold text-textPrimary mb-4 flex items-center">
              <span className="text-green-400 mr-2">📈</span>
              Top Gainers (24h)
            </h2>
            <div className="space-y-3">
              {topGainers.map((token) => (
                <TrackerCard key={token.id} token={token} type="gainer" />
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div>
            <h2 className="text-xl font-semibold text-textPrimary mb-4 flex items-center">
              <span className="text-red-400 mr-2">📉</span>
              Top Losers (24h)
            </h2>
            <div className="space-y-3">
              {topLosers.map((token) => (
                <TrackerCard key={token.id} token={token} type="loser" />
              ))}
            </div>
          </div>
        </div>

        {/* Future Watchlist Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-textPrimary mb-4">Watchlist</h2>
          <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-8 border border-primaryStroke text-center">
            <p className="text-textSecondary">Watchlist feature coming soon...</p>
            <p className="text-sm text-textSecondary mt-2">Add tokens to track price alerts and movements.</p>
          </div>
        </div>
      </div>
    </div>
  );
}