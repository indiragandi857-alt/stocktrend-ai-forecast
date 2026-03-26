import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { StockTrend } from '../types';

interface TrendChartProps {
  trends: StockTrend[];
}

const TrendChart: React.FC<TrendChartProps> = ({ trends }) => {
  const data = trends.map(t => ({
    name: t.trendName,
    score: t.popularityScore,
  }));

  return (
    <div className="h-[300px] w-full bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-6">Forecasted Popularity Score</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
          <XAxis type="number" hide domain={[0, 100]} />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={120} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: '#1e293b', opacity: 0.5 }}
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
            itemStyle={{ color: '#818cf8' }}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.score > 85 ? '#6366f1' : '#3b82f6'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;