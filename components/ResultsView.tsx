
import React, { useState, useEffect } from 'react';
import { AnalysisResult, ProductMatch, FashionItem } from '../types';
import { searchAwinProducts } from '../services/awinService';
import { searchRakutenProducts } from '../services/rakutenService';
import { searchSkimlinksProducts } from '../services/skimlinksService';

interface ResultsViewProps {
  sourceImage: string;
  analysis: AnalysisResult;
  onNewSearch: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ sourceImage, analysis, onNewSearch }) => {
  const [activeItem, setActiveItem] = useState<FashionItem>(analysis.mainItem);
  const [matches, setMatches] = useState<ProductMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      
      try {
        // Ejecutamos todas las búsquedas en paralelo para máxima eficiencia
        const [awinResults, rakutenResults, skimResults] = await Promise.all([
          searchAwinProducts(activeItem),
          searchRakutenProducts(activeItem),
          searchSkimlinksProducts(activeItem)
        ]);
        
        // Combinamos resultados eliminando duplicados si fuera necesario
        const combined = [...rakutenResults, ...awinResults, ...skimResults];
        
        // Ordenar: primero los que tengan imagen, luego por precio
        const sorted = combined.sort((a, b) => (a.imageUrl ? -1 : 1));
        
        setMatches(sorted);
      } catch (err) {
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [activeItem]);

  const handleShopNow = (match: ProductMatch) => {
    if (match.affiliateUrl) {
      window.open(match.affiliateUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12 py-12 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Panel Izquierdo: Resumen del Look */}
        <div className="lg:col-span-4 space-y-10">
          <div className="sticky top-28">
            <div className="group relative rounded-2xl overflow-hidden shadow-elegant bg-neutral-900 mb-8 border border-border-color">
              <img src={sourceImage} alt="Look" className="w-full h-auto" />
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-serif italic text-neutral-dark border-b border-border-color pb-4">Detected Items</h3>
              <div className="grid grid-cols-1 gap-3">
                {[analysis.mainItem, ...analysis.detectedItems].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    className={`flex flex-col p-4 border transition-all rounded-xl text-left ${
                      activeItem.id === item.id 
                        ? 'bg-white border-neutral-dark shadow-md' 
                        : 'opacity-60 hover:opacity-100 hover:bg-white/40'
                    }`}
                  >
                    <p className="text-[9px] uppercase tracking-widest text-accent font-bold">{item.category}</p>
                    <p className="text-xs font-bold text-neutral-dark truncate">{item.title}</p>
                  </button>
                ))}
              </div>

              <button onClick={onNewSearch} className="w-full py-4 mt-6 bg-neutral-dark text-white text-[10px] uppercase tracking-[0.3em] font-bold rounded-full">
                + New Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Resultados de Compra Reales */}
        <div className="lg:col-span-8">
          <div className="mb-12">
             <div className="flex items-center gap-2 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Live Affiliate Network Inventory</span>
             </div>
            <h1 className="text-4xl font-serif text-neutral-dark leading-tight">
              Shop the <span className="italic">{activeItem.title}</span>
            </h1>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="aspect-[3/4] bg-neutral-100 rounded-2xl"></div>
                  <div className="h-4 bg-neutral-100 w-2/3 rounded"></div>
                </div>
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed border-border-color rounded-3xl">
              <p className="text-gray-400 font-serif italic text-lg">No products found for this specific item yet.</p>
              <p className="text-[10px] uppercase tracking-widest mt-4 text-accent font-bold">Try selecting a different piece or updating your API credentials</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-16">
              {matches.map((match) => (
                <div key={match.id} className="group flex flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 mb-6 rounded-2xl shadow-soft group-hover:shadow-elegant transition-all">
                    <img 
                      alt={match.title} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      src={match.imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400&h=550"} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400&h=550";
                      }}
                    />
                    {match.isOnSale && (
                      <span className="absolute top-4 right-4 bg-red-600 text-white text-[9px] font-bold px-2 py-1 uppercase tracking-widest rounded-full">Sale</span>
                    )}
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow pr-4">
                      <p className="text-[9px] text-accent uppercase tracking-widest font-bold mb-1">{match.store}</p>
                      <h3 className="text-sm font-bold text-neutral-dark leading-tight group-hover:text-accent transition-colors truncate">{match.title}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-serif italic text-neutral-dark">${match.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleShopNow(match)}
                    className="w-full py-4 border border-neutral-dark text-[10px] uppercase tracking-widest font-bold hover:bg-neutral-dark hover:text-white transition-all rounded-full"
                  >
                    View at {match.store}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
