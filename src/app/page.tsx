import { TokenTable } from '@/components/TokenTable';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Token Discovery</h1>
          <ThemeToggle />
        </div>
        <div className="space-y-8">
          <TokenTable category="new-pairs" />
          <TokenTable category="final-stretch" />
          <TokenTable category="migrated" />
        </div>
      </div>
    </div>
  );
}
