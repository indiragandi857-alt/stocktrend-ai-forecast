import React, { useState } from 'react';
import Layout from './components/Layout';
import SearchForm from './components/SearchForm';
import TrendChart from './components/TrendChart';
import TrendCard from './components/TrendCard';
import { analyzeStockTrends } from './services/geminiService';
import { TrendSearchParams, TrendResponse, Region } from './types';
import { ExternalLink, Info } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrendResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchMeta, setSearchMeta] = useState<TrendSearchParams | null>(null);

  const handleSearch = async (params: TrendSearchParams) => {
    setLoading(true);
    setError(null);
    setSearchMeta(params);
    setData(null);

    try {
      const result = await analyzeStockTrends(params);
      setData(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while analyzing trends.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Discover the Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Stock Bestseller</span>
          </h1>
          <p className="text-lg text-slate-400">
            Use AI and Real-time Search Data to predict visual trends in your region and generate high-converting prompts for stock photography and video.
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-4xl mx-auto">
          <SearchForm isLoading={loading} onSearch={handleSearch} />
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-4xl mx-auto bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg flex items-center gap-3">
            <Info className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {data && searchMeta && (
          <div className="space-y-8 animate-fade-in">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Market Analysis: {searchMeta.category}</h2>
                <p className="text-slate-400">Region: {searchMeta.region} • Format: {searchMeta.mediaType}</p>
              </div>
              <div className="text-right hidden sm:block">
                 <span className="text-xs text-slate-500 uppercase tracking-widest">Confidence</span>
                 <div className="font-mono text-indigo-400">AI-DRIVEN</div>
              </div>
            </div>

            {/* Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-3">
                 <TrendChart trends={data.trends} />
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.trends.map((trend) => (
                <TrendCard 
                  key={trend.id} 
                  trend={trend} 
                  region={searchMeta.region}
                />
              ))}
            </div>

            {/* Sources / Grounding */}
            {data.sources.length > 0 && (
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800 mt-8">
                <h4 className="text-sm font-semibold text-slate-400 uppercase mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Data Sources & Signals
                </h4>
                <div className="flex flex-wrap gap-3">
                  {data.sources.map((source, idx) => (
                    <a 
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 px-3 py-1.5 rounded-full transition-colors border border-slate-700 hover:border-indigo-500/50"
                    >
                      {source.title} <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;