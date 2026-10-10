import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultData {
  variables: string[];
  counts: Record<string, number>;
  total_shots: number;
}

interface ResultsHistogramProps {
  data: ResultData | null;
}

const ResultsHistogram: React.FC<ResultsHistogramProps> = ({ data }) => {
  if (!data) return null;

  const chartData = Object.entries(data.counts).map(([bitstring, count]) => {
    const percentage = ((count / data.total_shots) * 100).toFixed(1);
    
    // Format label like "P=1, Q=0" or just the bitstring if too many variables
    const label = data.variables.length <= 4 
      ? bitstring.split('').map((bit, i) => `${data.variables[i]}=${bit}`).join(', ')
      : bitstring;

    return {
      name: label,
      rawBits: bitstring,
      count,
      percentage: parseFloat(percentage),
    };
  }).sort((a, b) => b.count - a.count); // Sort by highest probability

  // Calculate threshold for "true" states (heuristic: significantly above uniform distribution)
  const uniformProb = 100 / Math.pow(2, data.variables.length);
  const threshold = uniformProb * 1.2;

  // Colors ensuring high contrast
  const highlightedColor = '#2563eb'; // blue-600
  const normalColor = '#94a3b8'; // slate-400

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" aria-labelledby="results-title">
      <h2 id="results-title" className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Quantum Measurement Results
      </h2>
      
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
            <Tooltip 
              cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
              contentStyle={{ backgroundColor: '#1f2937', color: '#f3f4f6', border: 'none', borderRadius: '0.375rem' }}
              formatter={(value: number) => [`${value}%`, 'Probability']}
            />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.percentage > threshold ? highlightedColor : normalColor} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300">Amplified States (Likely True)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-400 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300">Suppressed States (Likely False)</span>
        </div>
      </div>
    </section>
  );
};

export default ResultsHistogram;
