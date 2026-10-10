import { ResultData } from '../types';
import ResultsHistogram from './ResultsHistogram';
import AssignmentTable from './AssignmentTable';
import MetricsHighlights from './MetricsHighlights';

interface ResultsDashboardProps {
  data: ResultData | null;
  isLoading: boolean;
  error: string | null;
}

const ResultsDashboard = ({ data, isLoading, error }: ResultsDashboardProps) => {
  if (isLoading && !data && !error) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 animate-pulse">
        <p>Initializing quantum circuit and applying Grover's algorithm...</p>
      </div>
    );
  }

  if (error) {
    return null; // Handled in App.tsx
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Ready to compute</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Enter a boolean expression above to generate the quantum probability distribution.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Results Dashboard</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Evaluated in {data.execution_time_ms}ms
        </span>
      </div>
      
      <MetricsHighlights data={data} />
      
      <div className="grid grid-cols-1 gap-8">
        <ResultsHistogram data={data} />
        <AssignmentTable data={data} />
      </div>
    </div>
  );
};

export default ResultsDashboard;
