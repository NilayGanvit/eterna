import NavigationHeader from '@/components/NavigationHeader';
import PulseSection from '@/components/PulseSection';
import DiscoverSection from '@/components/DiscoverSection';
import BottomBar from '@/components/BottomBar';
import PageContent from '@/components/PageContent';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background dark:bg-gray-900">
      <NavigationHeader />
      <main className="flex-1 overflow-auto pb-16">
        <PageContent />
      </main>
      <BottomBar />
    </div>
  );
}
