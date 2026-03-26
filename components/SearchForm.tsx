import React from 'react';
import { TrendSearchParams, Region, Category } from '../types';
import { Search, Globe, Layers, Film, Image as ImageIcon } from 'lucide-react';

interface SearchFormProps {
  isLoading: boolean;
  onSearch: (params: TrendSearchParams) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ isLoading, onSearch }) => {
  const [region, setRegion] = React.useState<string>(Region.Global);
  const [category, setCategory] = React.useState<string>(Category.Lifestyle);
  const [mediaType, setMediaType] = React.useState<'image' | 'video'>('image');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ region, category, mediaType });
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Region Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Target Region
            </label>
            <div className="relative">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg pl-4 pr-10 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none outline-none transition-all"
                disabled={isLoading}
              >
                {Object.values(Region).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg pl-4 pr-10 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none outline-none transition-all"
                disabled={isLoading}
              >
                {Object.values(Category).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Media Type Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              {mediaType === 'image' ? <ImageIcon className="w-4 h-4" /> : <Film className="w-4 h-4" />}
              Format
            </label>
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setMediaType('image')}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                  mediaType === 'image' 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> Image
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                  mediaType === 'video' 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Film className="w-4 h-4" /> Video
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white shadow-lg shadow-indigo-500/20
              ${isLoading 
                ? 'bg-slate-700 cursor-not-allowed opacity-70' 
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 transform hover:scale-[1.02] transition-all'
              }
            `}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing Market...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Find Trends
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;