import { Header } from '@/components/Header';
import PulseSection from '@/components/PulseSection';
import BottomBar from '@/components/BottomBar';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background dark:bg-gray-900">
      <Header />
      <main className="flex-1 overflow-auto pb-16">
        <PulseSection />
      </main>
      <BottomBar />
    </div>
  );
}
