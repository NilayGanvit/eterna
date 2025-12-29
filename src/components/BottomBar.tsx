'use client';

import { useEffect, useState } from 'react';

export default function BottomBar() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-primaryStroke bg-gray-900 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-3 text-xs text-textSecondary flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>● Connection stable</span>
        </div>
        <span>•</span>
        <span>Updated: {time || '00:00:00'}</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:block">GLOBAL</span>
        <span>|</span>
        <span>Docs</span>
      </div>
    </div>
  );
}
