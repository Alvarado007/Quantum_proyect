import { Info } from 'lucide-react';

const InfoPanel: React.FC = () => {
  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8" aria-labelledby="info-title">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        <h2 id="info-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">About Q-SAT Solver</h2>
      </div>
      
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">What it does</h3>
          <p>
            This application evaluates boolean logic expressions using Quantum Computing. Enter an expression like <code>(P | Q) &gt;&gt; R</code>, and the quantum backend will use Grover's Algorithm to find the variable assignments that make the expression True.
          </p>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">The Problem</h3>
          <p>
            Classical computers must evaluate truth tables for all <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">2^N</span> combinations, which becomes intractable for many variables. Quantum computers can search this space in <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">O(√2^N)</span> time using quantum parallelism and amplitude amplification, providing a quadratic speedup.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InfoPanel;
