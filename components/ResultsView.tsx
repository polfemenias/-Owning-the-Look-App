
import React, { useState, useEffect } from 'react';
import { AnalysisResult, ProductMatch, FashionItem } from '../types';
import { generateMockMatches } from '../utils/mockData';
import { searchSkimlinksProducts } from '../services/skimlinksService';
import { searchAwinProducts } from '../services/awinService';

interface ResultsViewProps {
  sourceImage: string;
  analysis: AnalysisResult;
  onNewSearch: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ sourceImage, analysis, onNewSearch }) => {
  const [activeItem, setActiveItem] = useState<FashionItem>(analysis.mainItem);
  const [matches, setMatches] = useState<ProductMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'Awin' | 'Skimlinks' | 'Mixed' | 'Demo'>('Demo');

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      
      // Intentamos obtener productos de ambas APIs en paralelo
      const [awinResults, skimlinksResults] = await Promise.all([
        searchAwinProducts(activeItem),
        searchSkimlinksProducts(activeItem)
      ]);
      
      const allRealMatches = [...awinResults, ...skimlinksResults];
      
      if (allRealMatches.length > 0) {
        // Ordenar por relevancia (aquí simple: los de Awin primero si existen)
        setMatches(allRealMatches);
        if (awinResults.length > 0 && skimlinksResults.length > 0) setDataSource('Mixed');
        else if (awinResults.length > 0) setDataSource('Awin');
        else setDataSource('Skimlinks');
      } else {
        console.log("No real results found, providing AI-curated references.");
        setMatches(generateMockMatches(activeItem));
        setDataSource('Demo');
      }
      
      setIsLoading(false);
    };

    fetchMatches();
  }, [activeItem]);

  const handleShopNow = (match: ProductMatch) => {
    if (match.affiliateUrl) {
      window.open(match.affiliateUrl, '_blank');
    } else {
      alert(`Visual discovery mode: Redirecting to ${match.store} similar styles...`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12 py-12 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-28">
            <div className="group relative rounded-lg overflow-hidden shadow-elegant bg-neutral-900 mb-8 border border-border-color">
              <img src={sourceImage} alt="Source" className="w-full h-auto grayscale-[15%] group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute top-4 left-4 bg-black/90 text-white text-[9px] uppercase tracking-[0.3em] px-3 py-1.5 font-bold backdrop-blur-sm">Source Selection</div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border-color pb-4">
                <h3 className="text-sm font-serif italic text-neutral-dark">Look Decomposition</h3>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{analysis.detectedItems.length + 1} Elements</span>
              </div>
              
              <div className="space-y-3">
                {[analysis.mainItem, ...analysis.detectedItems].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    className={`w-full flex items-center gap-5 p-4 border transition-all duration-300 text-left rounded-xl ${
                      activeItem.id === item.id 
                        ? 'bg-white border-neutral-dark shadow-elegant scale-[1.02]' 
                        : 'border-transparent hover:bg-white/50 hover:border-neutral-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="h-16 w-16 bg-neutral-light overflow-hidden shrink-0 rounded-lg">
                      <img 
                        src={item.image || `https://picsum.photos/seed/${item.id}/200/200`} 
                        alt={item.title} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-accent font-black mb-1">{item.category}</p>
                      <p className="text-xs font-bold uppercase tracking-tight text-neutral-dark leading-tight">{item.title}</p>
                      <p className="text-[10px] text-gray-400 mt-1 font-light italic">{item.material} in {item.color}</p>
                    </div>
                  </button>
                ))}
              </div>

              <button 
                onClick={onNewSearch}
                className="w-full py-4 bg-neutral-dark text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-neutral-800 transition-all mt-10 rounded-full shadow-lg"
              >
                + New Visual Scan
              </button>
            </div>
          </div>
        </div>

        {/* Main Matches Grid */}
        <div className="lg:col-span-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border-color pb-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dataSource === 'Demo' ? 'bg-orange-400' : 'bg-green-500'} animate-pulse`}></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark">
                    {dataSource === 'Demo' ? 'AI Curated Matches' : `${dataSource} Verified Store`}
                  </span>
                </div>
                <div className="h-4 w-px bg-border-color"></div>
                <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">{matches.length} curated options</span>
              </div>
              <h1 className="text-5xl font-serif text-neutral-dark leading-tight">
                Refined <span className="italic">{activeItem.title}</span>
              </h1>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16">
              {[1, 2, 4, 5].map(i => (
                <div key={i} className="flex flex-col gap-5">
                  <div className="aspect-[3/4] bg-neutral-light skeleton-shimmer rounded-2xl"></div>
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 bg-neutral-light skeleton-shimmer rounded-full"></div>
                    <div className="h-3 w-1/2 bg-neutral-light skeleton-shimmer rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16">
              {matches.map((match) => (
                <div key={match.id} className="group flex flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-6 rounded-2xl shadow-elegant">
                    {match.isBestMatch && (
                      <div className="absolute top-5 left-5 z-10">
                        <span className="bg-white/95 backdrop-blur px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] font-black border border-white shadow-sm rounded-full">Top Pick</span>
                      </div>
                    )}
                    <img 
                      alt={match.title} 
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      src={match.imageUrl} 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
                  </div>
                  
                  <div className="flex justify-between items-start px-2">
                    <div className="flex-grow pr-4">
                      <p className="text-[9px] text-accent uppercase tracking-[0.2em] font-black mb-1">{match.store}</p>
                      <h3 className="text-base font-bold text-neutral-dark uppercase tracking-tight leading-tight group-hover:text-accent transition-colors">{match.title}</h3>
                    </div>
                    <div className="text-right">
                      {match.oldPrice && (
                        <p className="text-[10px] text-gray-400 line-through mb-1">${match.oldPrice.toFixed(2)}</p>
                      )}
                      <p className={`text-xl font-serif italic ${match.isOnSale ? 'text-red-600' : 'text-neutral-dark'}`}>
                        ${match.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleShopNow(match)}
                    className="mt-6 w-full py-4 border-2 border-neutral-dark text-[11px] uppercase tracking-[0.3em] font-black hover:bg-neutral-dark hover:text-white transition-all duration-300 rounded-full group-hover:shadow-lg active:scale-95"
                  >
                    View Product
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-24 flex flex-col items-center gap-6 border-t border-border-color pt-16">
            <p className="text-[11px] uppercase tracking-[0.4em] text-gray-400 font-light italic">More inspirations below</p>
            <button className="h-12 w-12 flex items-center justify-center rounded-full border border-neutral-dark hover:bg-neutral-dark hover:text-white transition-all duration-500">
              <span className="material-symbols-outlined animate-bounce">expand_more</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
