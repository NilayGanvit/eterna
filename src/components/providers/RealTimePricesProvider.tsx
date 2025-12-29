'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useWebSocketPrices } from '@/hooks/useWebSocketPrices';

interface RealTimePricesContextType {
  prices: Record<string, number>;
}

const RealTimePricesContext = createContext<RealTimePricesContextType | undefined>(undefined);

const TOKEN_IDS = [
  'bitcoin',
  'ethereum',
  'solana',
  'cardano',
  'polkadot',
  'ripple',
  'dogecoin',
  'shiba-inu',
  'uniswap',
  'aave',
  'chainlink',
  'litecoin',
  'polygon',
  'avalanche-2',
  'cosmos',
  'near',
  'filecoin',
  'the-graph',
  'optimism',
  'arbitrum',
  'fantom',
  'aptos',
  'sui',
  'stacks',
  'maker',
];

export function RealTimePricesProvider({ children }: { children: ReactNode }) {
  const prices = useWebSocketPrices(TOKEN_IDS);

  return (
    <RealTimePricesContext.Provider value={{ prices }}>
      {children}
    </RealTimePricesContext.Provider>
  );
}

export function useRealTimePrices() {
  const context = useContext(RealTimePricesContext);
  if (context === undefined) {
    throw new Error('useRealTimePrices must be used within a RealTimePricesProvider');
  }
  return context;
}