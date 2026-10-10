import { useState } from 'react';
import InfoPanel from './components/InfoPanel';
import ExpressionInput from './components/ExpressionInput';
import ResultsHistogram from './components/ResultsHistogram';
import { Layers } from 'lucide-react';

function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSolve = async (expression: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expression, shots: 1024 }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to solve expression');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg shadow-lg">
              <Layers className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Q-SAT Solver
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Quantum Boolean Satisfiability Evaluator
          </p>
        </header>

        <main>
          <InfoPanel />
          
          <ExpressionInput onSubmit={handleSolve} isLoading={isLoading} />
          
          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 flex items-start" role="alert">
              <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {isLoading && !results && !error && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 animate-pulse">
              <p>Initializing quantum circuit and applying Grover's algorithm...</p>
            </div>
          )}

          {results && !isLoading && (
            <ResultsHistogram data={results} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
