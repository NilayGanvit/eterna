'use client';

import { useNavigation } from '@/hooks/useNavigation';
import PulseSection from './PulseSection';
import DiscoverSection from './DiscoverSection';
import TrackersSection from './TrackersSection';

export default function PageContent() {
  const { currentSection } = useNavigation();

  switch (currentSection) {
    case 'pulse':
      return <PulseSection />;
    case 'discover':
      return <DiscoverSection />;
    case 'trackers':
      return <TrackersSection />;
    default:
      return <PulseSection />;
  }
}
