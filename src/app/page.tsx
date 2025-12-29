import { Header } from '@/components/Header';
import PulseSection from '@/components/PulseSection';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background dark:bg-gray-900">
      <Header />
      <main className="flex-1 overflow-auto">
        <PulseSection />
      </main>
    </div>
  );
}
