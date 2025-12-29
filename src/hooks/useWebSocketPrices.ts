import { useEffect, useRef, useState } from 'react';

interface PriceUpdate {
  [key: string]: string; // coinId: price
}

export function useWebSocketPrices(tokenIds: string[]) {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (tokenIds.length === 0) return;

    const connect = () => {
      const ws = new WebSocket(`wss://ws.coincap.io/prices?assets=${tokenIds.join(',')}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected for real-time prices');
      };

      ws.onmessage = (event) => {
        try {
          const data: PriceUpdate = JSON.parse(event.data);
          const updatedPrices: Record<string, number> = {};

          Object.entries(data).forEach(([coinId, priceStr]) => {
            updatedPrices[coinId] = parseFloat(priceStr);
          });

          setPrices(prev => ({ ...prev, ...updatedPrices }));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket closed, attempting to reconnect...');
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [tokenIds]);

  return prices;
}