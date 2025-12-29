'use client';

import { useNavigation } from '@/hooks/useNavigation';
import PulseSection from './PulseSection';
import DiscoverSection from './DiscoverSection';

export default function PageContent() {
  const { currentSection } = useNavigation();

  switch (currentSection) {
    case 'pulse':
      return <PulseSection />;
    case 'discover':
      return <DiscoverSection />;
    case 'trackers':
      return (
        <div className="w-full bg-gray-900 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-textPrimary mb-4">Trackers</h1>
            <p className="text-textSecondary">Coming soon... Track your favorite tokens and market trends.</p>
          </div>
        </div>
      );
    default:
      return <PulseSection />;
  }
}
