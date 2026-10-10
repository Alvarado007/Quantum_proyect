import { useState } from 'react';
import { Play } from 'lucide-react';

interface ExpressionInputProps {
  onSubmit: (expression: string) => void;
  isLoading: boolean;
}

const ExpressionInput: React.FC<ExpressionInputProps> = ({ onSubmit, isLoading }) => {
  const [expression, setExpression] = useState('(P | Q) >> R');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expression.trim()) {
      onSubmit(expression);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col space-y-2">
        <label htmlFor="expression-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Boolean Logic Expression
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="expression-input"
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 outline-none transition-shadow"
            aria-label="Enter Boolean Logic Expression"
            aria-describedby="expression-hint"
            placeholder="e.g. (A & B) | C"
          />
          <button
            type="submit"
            disabled={isLoading || !expression.trim()}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Evaluating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Play className="w-5 h-5" aria-hidden="true" />
                Run Circuit
              </span>
            )}
          </button>
        </div>
        <p id="expression-hint" className="text-sm text-gray-500 dark:text-gray-400">
          Supported operators: <code>&</code> (AND), <code>|</code> (OR), <code>~</code> (NOT), <code>&gt;&gt;</code> (IMPLIES)
        </p>
      </div>
    </form>
  );
};

export default ExpressionInput;
