
import React, { useState, useCallback } from 'react';
import Landing from './components/Landing';
import CropTool from './components/CropTool';
import AnalysisLoading from './components/AnalysisLoading';
import ResultsView from './components/ResultsView';
import Header from './components/Header';
import { AppView, AnalysisResult } from './types';
import { analyzeFashionImage } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzedImage, setAnalyzedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleImageSelect = useCallback((imageData: string) => {
    setSelectedImage(imageData);
    setView('crop');
  }, []);

  const handleStartAnalysis = useCallback(async (croppedImage: string) => {
    setAnalyzedImage(croppedImage);
    setView('analyzing');
    try {
      // Split off base64 prefix if present
      const base64Data = croppedImage.includes(',') ? croppedImage.split(',')[1] : croppedImage;
      const result = await analyzeFashionImage(base64Data);
      setAnalysisResult(result);
      setView('results');
    } catch (error) {
      console.error("Analysis failed:", error);
      setView('landing');
      alert("Something went wrong analyzing the image. Please try again.");
    }
  }, []);

  const handleReset = useCallback(() => {
    setSelectedImage(null);
    setAnalyzedImage(null);
    setAnalysisResult(null);
    setView('landing');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <Header onLogoClick={handleReset} />
      
      <main className="flex-grow pt-20">
        {view === 'landing' && (
          <Landing onImageSelect={handleImageSelect} />
        )}

        {view === 'crop' && selectedImage && (
          <CropTool 
            image={selectedImage} 
            onConfirm={handleStartAnalysis} 
            onCancel={handleReset} 
          />
        )}

        {view === 'analyzing' && (
          <AnalysisLoading />
        )}

        {view === 'results' && analysisResult && analyzedImage && (
          <ResultsView 
            sourceImage={analyzedImage}
            analysis={analysisResult}
            onNewSearch={handleReset}
          />
        )}
      </main>

      <footer className="bg-white border-t border-border-color py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <nav className="flex gap-8">
            <a href="#" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-neutral-dark">About</a>
            <a href="#" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-neutral-dark">Privacy</a>
            <a href="#" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-neutral-dark">Terms</a>
            <a href="#" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-neutral-dark">Help</a>
          </nav>
          <div className="text-[10px] text-gray-300 font-light max-w-md text-center md:text-right">
            OWNING THE LOOK © 2024. Disclosure: We may earn a commission when you buy through our links.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
