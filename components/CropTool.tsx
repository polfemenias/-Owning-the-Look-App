
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CropToolProps {
  image: string;
  onConfirm: (croppedImage: string) => void;
  onCancel: () => void;
}

interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const CropTool: React.FC<CropToolProps> = ({ image, onConfirm, onCancel }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Crop stored as percentages (0-100)
  const [crop, setCrop] = useState<CropRect>({ x: 25, y: 25, width: 50, height: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [initialCrop, setInitialCrop] = useState<CropRect>(crop);

  const handleMouseDown = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    setStartPos({ x: e.clientX, y: e.clientY });
    setInitialCrop({ ...crop });
    if (type === 'move') {
      setIsDragging(true);
    } else {
      setActiveHandle(type);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !activeHandle) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - startPos.x) / rect.width) * 100;
    const deltaY = ((e.clientY - startPos.y) / rect.height) * 100;

    setCrop(prev => {
      let next = { ...prev };
      const minSize = 5; // minimum 5% size

      if (isDragging) {
        next.x = Math.max(0, Math.min(100 - prev.width, initialCrop.x + deltaX));
        next.y = Math.max(0, Math.min(100 - prev.height, initialCrop.y + deltaY));
      } else if (activeHandle) {
        // Top edge or corners
        if (activeHandle.includes('t')) {
          const newY = Math.max(0, Math.min(initialCrop.y + initialCrop.height - minSize, initialCrop.y + deltaY));
          next.height = initialCrop.height + (initialCrop.y - newY);
          next.y = newY;
        }
        // Bottom edge or corners
        if (activeHandle.includes('b')) {
          next.height = Math.max(minSize, Math.min(100 - initialCrop.y, initialCrop.height + deltaY));
        }
        // Left edge or corners
        if (activeHandle.includes('l')) {
          const newX = Math.max(0, Math.min(initialCrop.x + initialCrop.width - minSize, initialCrop.x + deltaX));
          next.width = initialCrop.width + (initialCrop.x - newX);
          next.x = newX;
        }
        // Right edge or corners
        if (activeHandle.includes('r')) {
          next.width = Math.max(minSize, Math.min(100 - initialCrop.x, initialCrop.width + deltaX));
        }
      }
      return next;
    });
  }, [isDragging, activeHandle, startPos, initialCrop]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setActiveHandle(null);
  }, []);

  useEffect(() => {
    if (isDragging || activeHandle) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, activeHandle, handleMouseMove, handleMouseUp]);

  const handleConfirm = () => {
    if (!imgRef.current) return;
    
    const canvas = document.createElement('canvas');
    const imageElement = imgRef.current;
    
    const sx = (crop.x / 100) * imageElement.naturalWidth;
    const sy = (crop.y / 100) * imageElement.naturalHeight;
    const sw = (crop.width / 100) * imageElement.naturalWidth;
    const sh = (crop.height / 100) * imageElement.naturalHeight;
    
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(imageElement, sx, sy, sw, sh, 0, 0, sw, sh);
      onConfirm(canvas.toDataURL('image/jpeg', 0.95));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1a1a1a] p-6 animate-fadeIn">
      <div className="w-full max-w-5xl flex flex-col items-center">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">Focus your search</h2>
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent/80 font-bold">Precision Selection Tool</p>
        </div>

        <div 
          className="relative inline-block rounded-lg overflow-hidden shadow-2xl bg-neutral-900 cursor-crosshair group select-none" 
          ref={containerRef}
          onMouseDown={(e) => {
             // Start a new crop if clicking outside current box? 
             // For now, let's stick to moving existing box.
          }}
        >
          <img 
            ref={imgRef}
            src={image} 
            alt="To crop" 
            className="max-h-[60vh] block object-contain pointer-events-none"
            onDragStart={(e) => e.preventDefault()}
          />
          
          {/* Backdrop dimming layer using clip-path to show the clear area */}
          <div 
            className="absolute inset-0 pointer-events-none bg-black/60 transition-opacity duration-300"
            style={{ 
              clipPath: `polygon(
                0% 0%, 0% 100%, ${crop.x}% 100%, 
                ${crop.x}% ${crop.y}%, 
                ${crop.x + crop.width}% ${crop.y}%, 
                ${crop.x + crop.width}% ${crop.y + crop.height}%, 
                ${crop.x}% ${crop.y + crop.height}%, 
                ${crop.x}% 100%, 100% 100%, 100% 0%
              )` 
            }}
          ></div>

          {/* Draggable/Resizable Bounding Box */}
          <div 
            className="absolute border border-white/80 shadow-elegant cursor-move group-active:border-white"
            style={{
              top: `${crop.y}%`,
              left: `${crop.x}%`,
              width: `${crop.width}%`,
              height: `${crop.height}%`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
          >
            {/* Corner Handles (Vertices) - Prominent white circles as in screenshot */}
            <div 
              className="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full border border-neutral-400 shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-10" 
              onMouseDown={(e) => handleMouseDown(e, 'tl')}
            ></div>
            <div 
              className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full border border-neutral-400 shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-10" 
              onMouseDown={(e) => handleMouseDown(e, 'tr')}
            ></div>
            <div 
              className="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full border border-neutral-400 shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-10" 
              onMouseDown={(e) => handleMouseDown(e, 'bl')}
            ></div>
            <div 
              className="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full border border-neutral-400 shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-10" 
              onMouseDown={(e) => handleMouseDown(e, 'br')}
            ></div>

            {/* Side Handles for better control */}
            <div className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-white/30" onMouseDown={(e) => handleMouseDown(e, 't')}></div>
            <div className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-white/30" onMouseDown={(e) => handleMouseDown(e, 'b')}></div>
            <div className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-white/30" onMouseDown={(e) => handleMouseDown(e, 'l')}></div>
            <div className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-white/30" onMouseDown={(e) => handleMouseDown(e, 'r')}></div>
            
            {/* Inner Grid (Visual guide) */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20 pointer-events-none">
              <div className="border-r border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-b border-white"></div>
              <div className="border-r border-white"></div>
              <div className="border-r border-white"></div>
              <div></div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-12 flex items-center justify-center p-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-hero">
          <button 
            onClick={onCancel}
            className="px-8 py-4 text-[10px] uppercase tracking-widest text-white/70 hover:text-white transition-colors font-bold rounded-full"
          >
            Refine Selection
          </button>
          
          <button 
            onClick={handleConfirm}
            className="px-12 py-4 bg-white text-primary text-[11px] uppercase tracking-[0.25em] font-black rounded-full shadow-lg active:scale-95 hover:shadow-white/20 transition-all mx-2"
          >
            Use Selection
          </button>
          
          <button 
            onClick={() => onConfirm(image)}
            className="px-8 py-4 text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors font-bold rounded-full"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropTool;
