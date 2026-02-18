
import React, { useRef } from 'react';

interface LandingProps {
  onImageSelect: (data: string) => void;
}

const Landing: React.FC<LandingProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageSelect(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            alt="High key street style bright fashion shot" 
            className="h-full w-full object-cover object-top" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYpZLDGTDfMjyYXGeYlnlXV3P8xI48odUnD5GmT1NlK6RB2FoWcUrgiCybWM3uvO9ZJe8GIarbGNz1jxOL3YNMNNS14mEKpiH1krn6RK2bOMmBkJQDvRv7b3Z0a8AgsJdVj4pK_n1MfcnmxnEX1yS2HPHdrAyWc3GjIR-MwbAdksUNCwtApSlMyN9J4jSAZR1kHmgmGiOEX3Jqhf7I8BSUKBMciQ3BNqkSIQ-XzxxY3nJb4SrNgJdjGUIqPeKDBNHAy9dCYpwbvsw" 
          />
          <div className="absolute inset-0 hero-overlay-light" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)' }}></div>
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center mt-20">
          <h1 className="mb-6 text-5xl font-medium leading-tight text-white sm:text-7xl md:text-8xl lg:text-[6rem] drop-shadow-md">
            See it. <br/><span className="italic font-light">Want it. Own it.</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg font-light leading-relaxed text-white sm:text-xl drop-shadow-md">
            Drag an image or paste a link to unlock the pieces you love.
          </p>
          <div className="mx-auto max-w-3xl glass-panel p-8 rounded-2xl">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-grow">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-500">
                  <span className="material-symbols-outlined font-light">link</span>
                </div>
                <input 
                  className="block w-full border-0 bg-white/60 backdrop-blur-sm py-4 pl-12 pr-4 text-neutral-900 ring-1 ring-inset ring-white/50 placeholder:text-neutral-600 focus:ring-2 focus:ring-inset focus:ring-neutral-dark sm:text-sm font-light rounded-lg transition-all" 
                  placeholder="Paste image URL (Instagram, Pinterest...)" 
                  type="text" 
                />
              </div>
              <button className="inline-flex items-center justify-center gap-2 bg-neutral-dark px-8 py-4 text-xs uppercase tracking-widest text-white transition-all hover:bg-neutral-800 sm:w-auto shadow-inner-glow rounded-lg hover:shadow-lg">
                <span className="material-symbols-outlined text-[18px]">search</span>
                Find It
              </button>
            </div>
            <div className="relative mt-8 flex w-full items-center justify-center mb-4">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-400/30"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/40 px-4 text-xs uppercase tracking-widest text-neutral-600 backdrop-blur-md rounded-full py-1 border border-white/20">or upload directly</span>
              </div>
            </div>
            <div 
              onClick={triggerUpload}
              className="mt-4 flex w-full justify-center border border-dashed border-neutral-400/50 bg-white/30 backdrop-blur-sm px-6 py-10 hover:border-neutral-dark hover:bg-white/50 transition-all cursor-pointer group rounded-xl"
            >
              <div className="text-center">
                <span className="material-symbols-outlined mx-auto text-3xl text-neutral-600 group-hover:text-neutral-dark transition-colors font-light">upload_file</span>
                <div className="mt-2 text-sm text-neutral-700 font-light">
                  <span className="font-medium text-neutral-dark underline decoration-1 underline-offset-4">Click to upload</span> or drag and drop
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="border-y border-border-color bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/3 text-center lg:text-left">
              <h3 className="text-2xl font-serif italic text-neutral-900">Trusted by the style conscious.</h3>
              <p className="mt-2 text-sm text-gray-500 font-light uppercase tracking-wide">Searching across 200+ global boutiques.</p>
            </div>
            <div className="lg:w-2/3 flex flex-wrap justify-center lg:justify-end items-center gap-10 lg:gap-16 opacity-60 grayscale">
              <span className="text-xl font-bold tracking-tighter font-sans">NORDSTROM</span>
              <span className="text-xl font-serif italic">REVOLVE</span>
              <span className="text-xl font-bold tracking-[0.2em] font-sans">ASOS</span>
              <span className="text-xl font-black font-sans">FARFETCH</span>
              <span className="text-xl font-serif">SSENSE</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-28 bg-[#fffefe]" id="how-it-works">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-24">
            <h2 className="text-4xl font-serif text-neutral-dark sm:text-5xl mb-4">How It Works</h2>
            <p className="text-gray-500 font-light text-lg">From inspiration to ownership in three simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-4 mb-6 border-b border-neutral-100 pb-4">
                <span className="text-5xl font-serif text-neutral-200">01</span>
                <h3 className="text-2xl font-serif text-neutral-dark">Focus</h3>
              </div>
              <div className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden shadow-sm mb-6 group">
                <img alt="Model wearing black leather jacket and tan wide leg trousers" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVp34uEJ2aUcgfhZfrS3JGlJY9exPKoc6UDRbCX49z8mi7dqDeUVORsIydusQ8kEB-M6ayOT9dk5G4xKS7e-MR5RAllqhK5zg4GwzsTRlC84gT41wq3agtP8CPYf0GBz4gWcdwUV--aMGPv6xaAkXU-0aqST7Zqq6DHohzjELwB1oVdb4KxKY5_-pBnUx2USWbqj2nFG3i6WGtmeT-yUo4ysu6fQLfkqIw-Z7LAphjZYOpSHH3iiXW9vQHcWByRZ74OXIEzLcjyr0" />
                <div className="absolute inset-4 border border-white/80 pointer-events-none">
                  <div className="absolute top-0 left-0 -mt-1.5 -ml-1.5 w-3 h-3 bg-white rounded-full shadow-md"></div>
                  <div className="absolute bottom-0 left-0 -mb-1.5 -ml-1.5 w-3 h-3 bg-white/50 rounded-full"></div>
                  <div className="absolute top-0 right-0 -mt-1.5 -mr-1.5 w-3 h-3 bg-white/50 rounded-full"></div>
                  <div className="absolute bottom-0 right-0 -mb-1.5 -mr-1.5 w-3 h-3 bg-white/50 rounded-full"></div>
                  <div className="absolute top-6 left-6 bg-black/90 text-white text-[10px] tracking-widest px-3 py-1 uppercase font-bold">Full Look Analysis</div>
                </div>
              </div>
              <div className="pr-4">
                <p className="text-sm text-gray-500 font-light leading-relaxed">Capture the entire silhouette. Our tool identifies every key piece from jacket to shoes in a single scan.</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-4 mb-6 border-b border-neutral-100 pb-4">
                <span className="text-5xl font-serif text-neutral-200">02</span>
                <h3 className="text-2xl font-serif text-neutral-dark">Analyze</h3>
              </div>
              <div className="relative w-full aspect-[4/5] bg-neutral-50 border border-neutral-100 overflow-hidden shadow-sm mb-6 p-8 flex flex-col justify-center items-center">
                <div className="w-full h-48 bg-white shadow-sm mb-6 relative overflow-hidden flex items-center justify-center">
                  <div className="text-neutral-200">
                    <span className="material-symbols-outlined text-6xl">grid_4x4</span>
                  </div>
                </div>
                <div className="bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-3 w-fit mb-8 z-10 border border-neutral-100">
                  <span className="animate-spin h-4 w-4 border-2 border-neutral-800 border-t-transparent rounded-full block"></span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-800">Finding Textures...</span>
                </div>
                <div className="w-full space-y-3">
                  <div className="h-2 w-3/4 skeleton-block rounded-full"></div>
                  <div className="h-2 w-1/2 skeleton-block rounded-full"></div>
                  <div className="h-2 w-full skeleton-block rounded-full mt-4"></div>
                </div>
              </div>
              <div className="pr-4">
                <p className="text-sm text-gray-500 font-light leading-relaxed">Our AI breaks down the visual DNA of your selection to find the closest matches across the web.</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-4 mb-6 border-b border-neutral-100 pb-4">
                <span className="text-5xl font-serif text-neutral-200">03</span>
                <h3 className="text-2xl font-serif text-neutral-dark">Shop</h3>
              </div>
              <div className="relative w-full aspect-[4/5] bg-white border border-neutral-100 overflow-hidden shadow-sm mb-6 flex flex-col">
                <div className="divide-y divide-neutral-100 h-full flex flex-col justify-center">
                  <div className="p-5 flex gap-4 items-center group cursor-pointer hover:bg-neutral-50 transition-colors">
                    <div className="w-14 h-16 bg-neutral-100 shrink-0">
                      <img alt="Biker Jacket" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDldKjeePwhJ5K0fp0L4rAmzuAu9U08tmg78pFwYM5OLJwL_nIwz14sGq_P2iS-BoHZAOy1rsf393XfGGBk_Ck7_YK1uzDLYsqcBJUss-ueOvZ9aGJpw9DxHUPbi6SrhUsyQF-9CMn_q1EXSbSO9BT5nNbb2Qgu09ESHB3GZRjejVZakFE1KUShyZpYs2ErQuoiDsd692tXpeDFjIygrLwZKqcDVN4MAt8nUbzX4dJ0MZNBmTcREG4Ix5b-CD7Ru2bIszWYgd7NF5s" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-serif text-neutral-dark truncate text-lg">Biker Jacket</h4>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">AllSaints</p>
                      <span className="text-xs font-bold block">$299</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold border-b border-neutral-900 pb-px opacity-0 group-hover:opacity-100 transition-opacity">Shop</span>
                  </div>
                  <div className="p-5 flex gap-4 items-center group cursor-pointer hover:bg-neutral-50 transition-colors">
                    <div className="w-14 h-16 bg-neutral-100 shrink-0">
                      <img alt="Wide-leg Trousers" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtMyud-B7Z84ODwokuGNC_dl4avR6ia7zoCPWB_lBIPp1VGCJQv1_S5bZr4e9JRNt1fp-kZ5gBdLZkUwQ8By_m_4lVMhePGZqTcCeu9IM6VVetS2lkTUXZ2ydz-JwUEa2uJaR4IzgCC6h6GbEM7wfXWoDmpSXjG_5x966jrCx3X9NBdIu-JdH1UvjbzemgTUI9E6wcG2o-tboa-5vlQkWtWk0gtI8IwMfgihdVQUb4HM0iq3-K9MwiVdYP1Ko8y2fSCqFF_Mlso34" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-serif text-neutral-dark truncate text-lg">Wide-leg Trousers</h4>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">COS</p>
                      <span className="text-xs font-bold block">$120</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold border-b border-neutral-900 pb-px opacity-0 group-hover:opacity-100 transition-opacity">Shop</span>
                  </div>
                  <div className="p-5 flex gap-4 items-center group cursor-pointer hover:bg-neutral-50 transition-colors">
                    <div className="w-14 h-16 bg-neutral-100 shrink-0">
                      <img alt="Pointed Loafers" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZqM9Cs8_-aEnG2B96sDBn0hOPhjOL5vpEkxWNSnazf6pCyohXqgh-VBcHQPicgiYj6lnN4DnRnoTW4UmXDZxa1qYEDkVOBp_dyK-W5YCsdmy3yEgp7q4PwHagahKrqmHpmGveh81fyhGG-J7nRtXcTDEf7tAzKm2aNnPT3tjSIHdLVJMTYRDeCEUDUWnHtVyFSP-jESmf5ovJXWdfIINcpCE942eTd-PgBluqYk7fZN0EqhCUlc161WMHOZJfeZaadkDCySpuOdk" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-serif text-neutral-dark truncate text-lg">Pointed Loafers</h4>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Reformation</p>
                      <span className="text-xs font-bold block">$180</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold border-b border-neutral-900 pb-px opacity-0 group-hover:opacity-100 transition-opacity">Shop</span>
                  </div>
                </div>
              </div>
              <div className="pr-4">
                <p className="text-sm text-gray-500 font-light leading-relaxed">Discover a curated list of shoppable products. We found the jacket, trousers, and shoes from your look.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detected Pieces Section */}
      <section className="py-24 bg-white border-t border-border-color" id="results">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden bg-neutral-100 shadow-elegant">
                  <img alt="Fashion model wearing a yellow sweater, blue jeans and a hat" className="h-full w-full object-cover grayscale-[20%]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1TZy4lpG1T7kKiHHczYC_yD-bDO-_-w9zpepMKab4855R1ThQ232DrAtFt8E1_Ad22_Jpc1s7zVImsieFkEbZXpnhQQnQ-1O4w-l34QBTc_dPHvwyJxILgIdhV9QbWHjtfH1VXPUJ4qGbXzFPbmQnp3VKoL4BFJhwBKaAIkNjroLd3BBTF2bfoGVkoO7yqKiulU6K8fawaes7uwm6SfDYKK-cegMr1-e63Yebrv1WVLrqQ8nLZaIiAeKwo1p8tBjOYQjE7D9xPAg" />
                </div>
                <div className="mt-4 flex items-center justify-between border-b border-black pb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-dark">Source</span>
                  <span className="text-xs font-serif italic text-neutral-500">Uploaded 2m ago</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-12">
              <div className="border-b border-border-color pb-6">
                <h2 className="text-4xl font-serif text-neutral-dark">Detected Pieces</h2>
                <p className="mt-3 text-lg font-light text-gray-600">4 items curated from this look.</p>
              </div>
              
              <div className="group flex flex-col sm:flex-row gap-8 items-start">
                <div className="aspect-[3/4] w-full sm:w-48 shrink-0 overflow-hidden bg-neutral-100 shadow-sm">
                  <img alt="Mustard yellow knitted sweater folded" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyqFCCSUV58RsfsiWZNzGEn8qWGkjJsFK29WSukg4XejpBgQGIs9_bXWdhYJlfjTJlZXULUZ1eOALGqEDucLJF5nYTiopyOBRwzHMqEUaruz1xb6_8bXWxBzY6-d8wUK0AbmKSJTofRX4I1jZR8jnvRIypiB57gqFyja7ZfEzupE7MjAvc-AYdY-ezJgfZIXTywVRWoQiUaU5OKr7mlpCEGo-uG2Bk8aVW2Odeawf7FP8AIj6hugN6Qf9GMpBLIYHP2gLZEsDpcNg" />
                </div>
                <div className="flex flex-1 flex-col justify-between h-full py-2">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Tops</p>
                      <span className="bg-neutral-100 px-2 py-1 text-[10px] uppercase tracking-widest text-neutral-600">Exact Match</span>
                    </div>
                    <h3 className="text-2xl font-serif text-neutral-dark group-hover:text-neutral-600 transition-colors">Chunky Knit Mustard Sweater</h3>
                    <p className="mt-3 text-sm font-light text-gray-600 leading-relaxed">Premium wool blend oversized sweater in mustard yellow. Perfect for autumn layering with a sophisticated drape.</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <p className="text-lg font-serif italic text-neutral-dark">$89.00</p>
                    <button className="text-xs font-bold uppercase tracking-widest text-neutral-dark border-b border-neutral-dark hover:border-gray-400 hover:text-gray-600 transition-all pb-1">View Product</button>
                  </div>
                </div>
              </div>

              <div className="group flex flex-col sm:flex-row gap-8 items-start">
                <div className="aspect-[3/4] w-full sm:w-48 shrink-0 overflow-hidden bg-neutral-100 shadow-sm">
                  <img alt="Blue denim jeans texture" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrUaK5SN0Oyf0H-PjCEIAROuOXqrJUO4n90wnGr802XdrsvB4GVOPpjw7l8yfJvbiaLOeN-EiOfL1ZJpHVSelbpwTMNAUp746gIq5e08xF-4eqDstZnCwsJNgk3GzmaVYhLGx6cv1s6q3mlwvTC5iSa7iS5vr5QKjZWBP07C07F881FdjPYpa8-DZVGX9PegiSRygcsDu7drllCUA7k77Aw0ZC43uqlhighDanCmgjvNWuf1qbdycoOKdI-xPPVrfQJvh9c62Yn2k" />
                </div>
                <div className="flex flex-1 flex-col justify-between h-full py-2">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Bottoms</p>
                      <span className="bg-neutral-100 px-2 py-1 text-[10px] uppercase tracking-widest text-neutral-600">Similar Style</span>
                    </div>
                    <h3 className="text-2xl font-serif text-neutral-dark group-hover:text-neutral-600 transition-colors">High-Rise Straight Leg Jeans</h3>
                    <p className="mt-3 text-sm font-light text-gray-600 leading-relaxed">Vintage wash denim with straight leg cut. 100% organic cotton tailored for a modern silhouette.</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <p className="text-lg font-serif italic text-neutral-dark">$120.00</p>
                    <button className="text-xs font-bold uppercase tracking-widest text-neutral-dark border-b border-neutral-dark hover:border-gray-400 hover:text-gray-600 transition-all pb-1">View Product</button>
                  </div>
                </div>
              </div>

              <div className="group flex flex-col sm:flex-row gap-8 items-start">
                <div className="aspect-[3/4] w-full sm:w-48 shrink-0 overflow-hidden bg-neutral-100 shadow-sm">
                  <img alt="Brown fedora hat on wooden table" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtLAqxR98EqPPVi4mT66M7rubSqK_lRmNFA9vIiELFcvNnl2NYrS910xlvBLS7tlx0Q4Rm-5fHRtJkvCRDyNPSOWMOnFzHXcNaHfoFoIj-T0v8eu7-W-6Yu2X4_zeTWUaPXIkez2JWYX4BBF0W7TMH-hdOJOyLs7VxRpJ_pRG6T9_ikni95vqLr-kHp6OZyM4hk8jQ8Qx5gbbgdm8OpRNQCQMaI21TCjXO7mK9LBxrhtR9hkEpYssa7dkufZTwMlxcbnhVijilmBc" />
                </div>
                <div className="flex flex-1 flex-col justify-between h-full py-2">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Accessories</p>
                      <span className="bg-neutral-100 px-2 py-1 text-[10px] uppercase tracking-widest text-neutral-600">Exact Match</span>
                    </div>
                    <h3 className="text-2xl font-serif text-neutral-dark group-hover:text-neutral-600 transition-colors">Wool Fedora Hat</h3>
                    <p className="mt-3 text-sm font-light text-gray-600 leading-relaxed">Classic wide brim fedora in camel brown. Features a grosgrain ribbon band for a timeless finish.</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <p className="text-lg font-serif italic text-neutral-dark">$45.00</p>
                    <button className="text-xs font-bold uppercase tracking-widest text-neutral-dark border-b border-neutral-dark hover:border-gray-400 hover:text-gray-600 transition-all pb-1">View Product</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#f0ede6]" id="features">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-8 border border-neutral-200 bg-[#fdfbf7] hover:bg-white transition-colors duration-300">
              <div className="mb-6 text-neutral-dark">
                <span className="material-symbols-outlined text-3xl font-light">bolt</span>
              </div>
              <h3 className="text-lg font-serif text-neutral-dark">Lightning Speed</h3>
              <p className="mt-3 text-sm font-light text-gray-600 leading-relaxed">Get results in under 2 seconds. Our engine is optimized for instant discovery.</p>
            </div>
            <div className="p-8 border border-neutral-200 bg-[#fdfbf7] hover:bg-white transition-colors duration-300">
              <div className="mb-6 text-neutral-dark">
                <span className="material-symbols-outlined text-3xl font-light">center_focus_strong</span>
              </div>
              <h3 className="text-lg font-serif text-neutral-dark">Visual Precision</h3>
              <p className="mt-3 text-sm font-light text-gray-600 leading-relaxed">Understanding texture, fabric weight, and drape, not just color and shape.</p>
            </div>
            <div className="p-8 border border-neutral-200 bg-[#fdfbf7] hover:bg-white transition-colors duration-300">
              <div className="mb-6 text-neutral-dark">
                <span className="material-symbols-outlined text-3xl font-light">storefront</span>
              </div>
              <h3 className="text-lg font-serif text-neutral-dark">Global Catalog</h3>
              <p className="mt-3 text-sm font-light text-gray-600 leading-relaxed">Access inventory from over 200+ global retailers, from luxury to high street.</p>
            </div>
            <div className="p-8 border border-neutral-200 bg-[#fdfbf7] hover:bg-white transition-colors duration-300">
              <div className="mb-6 text-neutral-dark">
                <span className="material-symbols-outlined text-3xl font-light">sync</span>
              </div>
              <h3 className="text-lg font-serif text-neutral-dark">Cross-Platform</h3>
              <p className="mt-3 text-sm font-light text-gray-600 leading-relaxed">Save items to your wishlist on desktop and find them ready on your mobile app.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-28 bg-white" id="faq">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h2 className="mb-16 text-center text-4xl font-serif text-neutral-dark">Journal & Inquiries</h2>
          <div className="divide-y divide-gray-100 border-y border-gray-100">
            {[
              { q: "Is Fashion AI complimentary?", a: "Yes, basic curation is complimentary for up to 10 searches per day. For unlimited access and advanced wardrobe tracking, we offer a Premium membership." },
              { q: "How precise is the curation?", a: "Our engine currently boasts a 98% match accuracy for identifying correct categories and styles. We prioritize displaying 'Exact Matches' first, followed by 'Visually Similar' alternatives." },
              { q: "Which boutiques are supported?", a: "We index products from over 200 major retailers including Nordstrom, Revolve, ASOS, Zara, H&M, Farfetch, SSENSE, and many independent ateliers." },
              { q: "Is mobile access available?", a: "Absolutely. Our platform is fully responsive, and we have dedicated iOS and Android applications for on-the-go inspiration." }
            ].map((faq, idx) => (
              <details key={idx} className="group py-8">
                <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-serif text-neutral-dark focus:outline-none">
                  <span>{faq.q}</span>
                  <span className="transition group-open:rotate-180 text-gray-400">
                    <span className="material-symbols-outlined font-light">expand_more</span>
                  </span>
                </summary>
                <p className="mt-4 text-gray-500 font-light leading-relaxed pl-4 border-l border-neutral-200">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-neutral-dark py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif text-white sm:text-5xl italic">Upgrade your style.</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-gray-300">
            Stop searching for hours. Start curating in seconds. Join the new era of visual shopping today.
          </p>
          <div className="mt-12 flex items-center justify-center gap-x-8">
            <a className="bg-white px-10 py-4 text-xs font-bold uppercase tracking-widest text-neutral-dark shadow-sm hover:bg-gray-100 transition-colors" href="#">
              Start Shopping
            </a>
            <a className="text-xs font-bold uppercase tracking-widest text-white hover:text-gray-300 transition-colors" href="#">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Landing;
