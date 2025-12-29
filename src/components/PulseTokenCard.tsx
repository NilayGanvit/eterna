'use client';

import { Token } from '@/types/token';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PulseTokenCardProps {
  token: Token;
}

export default function PulseTokenCard({ token }: PulseTokenCardProps) {
  const [priceChange, setPriceChange] = useState(token.change24h);
  const [displayPrice, setDisplayPrice] = useState(token.price);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random price fluctuation
      const change = (Math.random() - 0.5) * 0.5;
      setPriceChange(prev => {
        const newVal = prev + change;
        return Math.max(-100, Math.min(100, newVal));
      });
      
      setDisplayPrice(prev => {
        const newVal = prev * (1 + change / 100);
        return Math.max(0, newVal);
      });
    }, 2000 + Math.random() * 1000);

    return () => clearInterval(interval);
  }, []);

  const isPositive = priceChange >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const changeSymbol = isPositive ? '▲' : '▼';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-primaryStroke rounded-lg p-3 bg-gray-900 dark:bg-gray-900 hover:bg-gray-800 transition-colors group"
    >
      {/* Token Header */}
      <div className="flex items-start gap-2 mb-2.5">
        {/* Logo and Info */}
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {/* Avatar */}
          <div className="flex-shrink-0 w-10 h-10">
            {token.logo ? (
              <img 
                src={token.logo} 
                alt={token.name}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/40?text=${token.symbol.charAt(0)}`;
                }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {token.symbol.charAt(0)}
              </div>
            )}
          </div>

          {/* Name and Symbol */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h3 className="text-xs font-bold text-textPrimary truncate">
                {token.name}
              </h3>
              {token.verified && (
                <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor" className="text-primaryBlue flex-shrink-0">
                  <path d="M7 0L9 5H14L10 8L12 13L7 10L2 13L4 8L0 5H5L7 0Z" />
                </svg>
              )}
            </div>
            <p className="text-xs text-textSecondary font-medium">
              {token.symbol}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <p className="text-xs font-bold text-textPrimary">
            ${displayPrice.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Change Badge */}
      <div className="flex items-center gap-1.5 mb-2">
        <motion.span
          key={priceChange}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className={`text-xs font-bold ${changeColor}`}
        >
          {changeSymbol} {Math.abs(priceChange).toFixed(2)}%
        </motion.span>
        <span className="text-xs text-textSecondary">
          F {(token.change1h || 0).toFixed(2)}%
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-1.5 mb-3 text-xs">
        <div className="space-y-0.5">
          <p className="text-textSecondary">MC</p>
          <p className="text-textPrimary font-semibold">
            ${token.marketCap ? (token.marketCap / 1e6).toFixed(1) : '0'}M
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-textSecondary">V</p>
          <p className="text-textPrimary font-semibold">
            ${token.volume24h ? (token.volume24h / 1e6).toFixed(1) : '0'}M
          </p>
        </div>
      </div>

      {/* Time-based Changes */}
      <div className="flex items-center gap-1 text-xs text-textSecondary mb-3 flex-wrap">
        <span>1h {(token.change1h || 0).toFixed(2)}%</span>
        <span>•</span>
        <span>24h {token.change24h.toFixed(2)}%</span>
        <span>•</span>
        <span>7d {(token.change7d || 0).toFixed(2)}%</span>
      </div>

      {/* Action Button */}
      <button className="w-full bg-primaryBlue hover:bg-blue-600 text-white rounded-md px-2 py-2 text-xs font-bold transition-colors active:scale-95">
        ◇ 0 SOL
      </button>
    </motion.div>
  );
}
