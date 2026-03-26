import React, { useState } from 'react';
import { StockTrend, GeneratedPrompt, StockAssetType, Region } from '../types';
import { Copy, Check, Aperture, Palette, Sparkles, PlusCircle, Image, Box, PenTool, Layout as LayoutIcon, Type } from 'lucide-react';
import { generateTailoredPrompts } from '../services/geminiService';

interface TrendCardProps {
  trend: StockTrend;
  region?: string; // Optional prop to pass down region for context
}

const TrendCard: React.FC<TrendCardProps> = ({ trend, region = "Global" }) => {
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>(trend.prompts);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState<StockAssetType>(StockAssetType.People);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGenerateMore = async () => {
    setIsGenerating(true);
    try {
      const newPrompts = await generateTailoredPrompts(
        trend.trendName,
        trend.reasoning,
        selectedAssetType,
        region
      );
      // Append new prompts to the top
      setPrompts(prev => [...newPrompts, ...prev]);
    } catch (error) {
      console.error("Failed to generate more prompts", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getIconForType = (type: StockAssetType) => {
    switch(type) {
      case StockAssetType.Object: return <Box className="w-4 h-4" />;
      case StockAssetType.Icon: return <PenTool className="w-4 h-4" />;
      case StockAssetType.Background: return <LayoutIcon className="w-4 h-4" />;
      case StockAssetType.CopySpace: return <Type className="w-4 h-4" />;
      default: return <Image className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white pr-2">{trend.trendName}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
            trend.popularityScore > 80 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
          }`}>
            {trend.popularityScore}% Score
          </span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          {trend.reasoning}
        </p>
        <div className="flex items-start gap-2 text-xs text-indigo-300 bg-indigo-950/30 p-3 rounded-lg border border-indigo-900/50">
          <Palette className="w-4 h-4 mt-0.5 shrink-0" />
          <span><span className="font-semibold">Visual Style:</span> {trend.visualStyle}</span>
        </div>
      </div>

      {/* Action Bar for New Prompts */}
      <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative w-full">
           <select 
             className="w-full bg-slate-800 text-slate-200 text-xs rounded-lg border border-slate-700 px-3 py-2 appearance-none focus:ring-1 focus:ring-indigo-500 outline-none"
             value={selectedAssetType}
             onChange={(e) => setSelectedAssetType(e.target.value as StockAssetType)}
             disabled={isGenerating}
           >
             {Object.values(StockAssetType).map((type) => (
               <option key={type} value={type}>{type}</option>
             ))}
           </select>
           <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <Sparkles className="w-3 h-3" />
           </div>
        </div>
        
        <button
          onClick={handleGenerateMore}
          disabled={isGenerating}
          className="w-full sm:w-auto whitespace-nowrap flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <PlusCircle className="w-3 h-3" />
          )}
          Generate Variations
        </button>
      </div>

      {/* Prompts Section */}
      <div className="p-6 flex-grow flex flex-col gap-4 bg-slate-950/30 max-h-[500px] overflow-y-auto custom-scrollbar">
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 sticky top-0 bg-slate-950/90 backdrop-blur-sm py-2 z-10 flex justify-between items-center">
          <span>Prompt Library</span>
          <span className="text-xs text-slate-600 bg-slate-900 px-2 py-0.5 rounded-full">{prompts.length}</span>
        </h4>
        
        {prompts.map((prompt, idx) => (
          <div key={idx} className="group relative bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800 transition-colors animate-fade-in">
             <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-200 flex items-center gap-2">
                   {/* Attempt to guess icon based on title or just show generic */}
                   <span className="text-indigo-400 opacity-70">
                     <Sparkles className="w-3 h-3" />
                   </span>
                   {prompt.title}
                </span>
                <button
                  onClick={() => handleCopy(prompt.description, idx)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-all"
                  title="Copy Prompt"
                >
                  {copiedIndex === idx ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
             </div>
             <p className="text-sm text-slate-400 mb-3 line-clamp-3 group-hover:line-clamp-none transition-all">
               "{prompt.description}"
             </p>
             <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-700/50 pt-2 mt-2">
               <Aperture className="w-3 h-3" />
               <span className="italic">{prompt.technicalSettings}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendCard;