import { TokenTable } from '@/components/TokenTable';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Header } from '@/components/Header';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="space-y-8">
            <TokenTable category="new-pairs" />
            <TokenTable category="final-stretch" />
            <TokenTable category="migrated" />
          </div>
        </div>
      </main>
    </div>
  );
}
