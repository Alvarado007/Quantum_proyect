import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ResultData } from '../types';

interface ResultsHistogramProps {
  data: ResultData;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900 text-white p-3 rounded-md shadow-lg border border-gray-700 text-sm" role="tooltip">
        <p className="font-semibold">State: {data.rawBits}</p>
        <p className="text-gray-300">{(data.percentage).toFixed(1)}% Probability</p>
      </div>
    );
  }
  return null;
};

const ResultsHistogram = ({ data }: ResultsHistogramProps) => {
  const chartData = data.results.map((result) => {
    const percentage = result.probability * 100;
    
    // Format label like "P=1, Q=0" or just the bitstring if too many variables
    const label = data.variables.length <= 4 
      ? result.state.split('').map((bit, i) => `${data.variables[i]}=${bit}`).join(', ')
      : result.state;

    return {
      name: label,
      rawBits: result.state,
      percentage: percentage,
      isProbable: result.is_probable_solution
    };
  });

  // Colors ensuring high contrast
  const highlightedColor = '#10b981'; // emerald-500
  const normalColor = '#94a3b8'; // slate-400

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" aria-labelledby="histogram-title">
      <h3 id="histogram-title" className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Probability Distribution
      </h3>
      
      <div className="h-80 w-full" role="img" aria-label="Histogram of quantum measurement probabilities">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isProbable ? highlightedColor : normalColor} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300">Amplified States (Likely True)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-400 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300">Noise / Suppressed States</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsHistogram;
