
import React from 'react';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/20 bg-white/5 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <button 
            onClick={onLogoClick}
            className="text-xl md:text-2xl font-sans tracking-[0.2em] uppercase text-neutral-dark font-bold hover:opacity-80 transition-opacity"
            style={{ letterSpacing: '0.15em' }}
          >
            OWNING THE LOOK
          </button>
        </div>
        
        <nav className="hidden md:flex items-center gap-10">
          <a href="#" className="text-xs uppercase tracking-widest font-medium text-neutral-dark/80 hover:text-neutral-dark transition-colors">Curations</a>
          <a href="#" className="text-xs uppercase tracking-widest font-medium text-neutral-dark/80 hover:text-neutral-dark transition-colors">Features</a>
          <a href="#" className="text-xs uppercase tracking-widest font-medium text-neutral-dark/80 hover:text-neutral-dark transition-colors">Journal</a>
        </nav>

        <div className="flex items-center gap-6">
          <button className="hidden sm:block text-xs uppercase tracking-widest font-medium text-neutral-dark/80 hover:text-neutral-dark">Log In</button>
          <button className="bg-neutral-dark px-6 py-2.5 text-xs uppercase tracking-widest text-white transition-all hover:bg-neutral-800">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
