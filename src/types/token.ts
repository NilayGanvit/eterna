export interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  category: 'new-pairs' | 'final-stretch' | 'migrated';
  logo?: string;
  pair?: string; // for trading pairs
}