import { useQuery } from '@tanstack/react-query';
import { Token } from '@/types/token';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  atl: number;
  atl_change_percentage: number;
  ath_change_percentage: number;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
}

export async function fetchTokenPrices(tokenIds: string[]): Promise<Token[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${tokenIds.join(
        ','
      )}&order=market_cap_desc&per_page=250&sparkline=false&locale=en`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) throw new Error('Failed to fetch from CoinGecko');

    const data: CoinGeckoMarket[] = await response.json();

    return data.map((coin, index): Token => {
      const categoryIndex = index % 3;
      const category = categoryIndex === 0 ? 'new' : categoryIndex === 1 ? 'final' : 'migrated';

      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price || 0,
        change1h: 0, // CoinGecko doesn't provide hourly data in free tier
        change24h: coin.price_change_percentage_24h || 0,
        change7d: 0, // Would need premium API
        volume24h: coin.total_volume || 0,
        marketCap: coin.market_cap || 0,
        category: category,
        logo: coin.image,
        verified: (coin.market_cap_rank || 0) <= 100,
      };
    });
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return [];
  }
}

export function usePulseTokens() {
  return useQuery({
    queryKey: ['pulseTokens'],
    queryFn: async () => {
      const tokenIds = [
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

      return fetchTokenPrices(tokenIds);
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3,
  });
}
