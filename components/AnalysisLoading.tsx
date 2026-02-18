
import React from 'react';

const AnalysisLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-24">
      <div className="relative mb-12">
        <div className="w-32 h-32 border-2 border-border-color rounded-full animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-neutral-dark animate-spin">sync</span>
        </div>
      </div>
      
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-serif text-neutral-dark">Analyzing Silhouettes</h2>
        <div className="flex flex-col items-center gap-2">
          <div className="w-48 h-1 bg-neutral-light rounded-full overflow-hidden">
            <div className="h-full bg-neutral-dark w-1/3 animate-[shimmer_2s_infinite]"></div>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Extracting Fabric Textures...</p>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg w-full px-6">
        <div className="h-40 bg-neutral-light skeleton-shimmer rounded-lg"></div>
        <div className="h-40 bg-neutral-light skeleton-shimmer rounded-lg"></div>
        <div className="h-40 bg-neutral-light skeleton-shimmer rounded-lg"></div>
      </div>
    </div>
  );
};

export default AnalysisLoading;
