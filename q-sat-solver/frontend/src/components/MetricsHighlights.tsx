import { ResultData } from '../types';

interface MetricsHighlightsProps {
  data: ResultData;
}

const MetricsHighlights = ({ data }: MetricsHighlightsProps) => {
  const probableSolutions = data.results.filter(r => r.is_probable_solution);
  const topSolutions = probableSolutions.slice(0, 3);

  if (topSolutions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-center">
        <p className="text-gray-700 dark:text-gray-300">
          No clear solutions found. The expression might be a contradiction or require more iterations.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Top Quantum Solutions">
      {topSolutions.map((solution, index) => {
        // Map binary state to True/False for each variable
        const assignments = solution.state.split('').map((bit, i) => {
          return `${data.variables[i]}=${bit === '1' ? 'True' : 'False'}`;
        }).join(', ');

        return (
          <div 
            key={index} 
            className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm flex flex-col"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                {index + 1}
              </span>
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                Solution Found
              </h3>
            </div>
            
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-2 flex-grow">
              {assignments}
            </p>
            
            <div className="mt-4 pt-3 border-t border-emerald-200/50 dark:border-emerald-800/50">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                {(solution.probability * 100).toFixed(1)}% certainty
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsHighlights;
