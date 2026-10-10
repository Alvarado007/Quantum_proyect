import { ResultData } from '../types';

interface AssignmentTableProps {
  data: ResultData;
}

const AssignmentTable = ({ data }: AssignmentTableProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden" aria-labelledby="table-title">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 id="table-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Truth Assignment Data
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold text-center w-16">
                Rank
              </th>
              {data.variables.map((v, i) => (
                <th key={i} scope="col" className="px-6 py-4 font-semibold">
                  {v}
                </th>
              ))}
              <th scope="col" className="px-6 py-4 font-semibold text-right">
                Probability
              </th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((result, index) => {
              const isProbable = result.is_probable_solution;
              return (
                <tr 
                  key={index} 
                  className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${isProbable ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : 'bg-white dark:bg-gray-800'}`}
                >
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isProbable ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                      {index + 1}
                    </span>
                  </td>
                  
                  {result.state.split('').map((bit, bitIndex) => (
                    <td key={bitIndex} className="px-6 py-4">
                      {bit === '1' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                          True
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 border border-red-200 dark:border-red-800">
                          False
                        </span>
                      )}
                    </td>
                  ))}
                  
                  <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                    {(result.probability * 100).toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentTable;
