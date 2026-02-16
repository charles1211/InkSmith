import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Search, User, Tag, RotateCcw, ChevronDown } from 'lucide-react';

// Mock data configuration
const categories = ['Realism', 'Traditional', 'Japanese', 'Blackwork', 'Fine Line', 'Color', 'Watercolor'];
const artistsList = ['Romark', 'Viper', 'Kenji', 'Sarah'];
const adjectives = ['Eternal', 'Dark', 'Crimson', 'Silent', 'Golden', 'Fierce', 'Gentle', 'Wild', 'Mystic', 'Broken'];
const nouns = ['Dragon', 'Rose', 'Skull', 'Warrior', 'Tiger', 'Lotus', 'Serpent', 'Dagger', 'Phoenix', 'Wolf'];

// Generate deterministic mock data with searchable titles
const portfolioItems = Array.from({ length: 32 }).map((_, i) => ({
  id: i,
  src: `https://picsum.photos/800/${i % 3 === 0 ? 1000 : i % 2 === 0 ? 800 : 600}?random=${i + 200}`,
  category: categories[i % categories.length],
  title: `${adjectives[i % adjectives.length]} ${nouns[(i + 2) % nouns.length]}`,
  artist: artistsList[i % artistsList.length]
}));

const Portfolio: React.FC = () => {
  // Filter States
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedArtist, setSelectedArtist] = useState('All');
  
  // UI States
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);
  }, []);

  // Filter Logic
  const filteredItems = useMemo(() => {
    return portfolioItems.filter(item => {
      const matchesTitle = item.title.toLowerCase().includes(searchTitle.toLowerCase());
      const matchesType = selectedType === 'All' || item.category === selectedType;
      const matchesArtist = selectedArtist === 'All' || item.artist === selectedArtist;
      
      return matchesTitle && matchesType && matchesArtist;
    });
  }, [searchTitle, selectedType, selectedArtist]);

  const clearFilters = () => {
    setSearchTitle('');
    setSelectedType('All');
    setSelectedArtist('All');
  };

  // Lightbox Handlers
  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'unset';
  }, []);

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! + 1) % filteredItems.length);
    }
  }, [selectedImageIndex, filteredItems.length]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
    }
  }, [selectedImageIndex, filteredItems.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, closeLightbox, nextImage, prevImage]);

  return (
    <div className="min-h-screen bg-ink-950 text-white pt-24 pb-20 selection:bg-ink-accent selection:text-black">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tighter">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-accent to-yellow-600">Masterpieces</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto font-light">
            Browse our extensive collection of custom tattoo work. Use the filters below to find exactly what you're looking for.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-ink-900/40 backdrop-blur-md border border-white/10 rounded-xl p-6 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            {/* Title Search */}
            <div className="md:col-span-4 space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Title</label>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-ink-accent transition-colors" />
                <input 
                  type="text" 
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="e.g. Dragon, Rose..." 
                  className="w-full bg-ink-950 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:border-ink-accent outline-none transition-all placeholder-gray-600"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="md:col-span-3 space-y-2">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Type</label>
               <div className="relative group">
                 <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-ink-accent transition-colors pointer-events-none z-10" />
                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
                 <select 
                   value={selectedType}
                   onChange={(e) => setSelectedType(e.target.value)}
                   className="w-full bg-ink-950 border border-white/10 rounded-lg py-3 pl-10 pr-10 text-sm text-white focus:border-ink-accent outline-none appearance-none cursor-pointer transition-all"
                 >
                   <option value="All">All Types</option>
                   {categories.map(cat => (
                     <option key={cat} value={cat}>{cat}</option>
                   ))}
                 </select>
               </div>
            </div>

            {/* Artist Filter */}
            <div className="md:col-span-3 space-y-2">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Artist</label>
               <div className="relative group">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-ink-accent transition-colors pointer-events-none z-10" />
                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
                 <select 
                   value={selectedArtist}
                   onChange={(e) => setSelectedArtist(e.target.value)}
                   className="w-full bg-ink-950 border border-white/10 rounded-lg py-3 pl-10 pr-10 text-sm text-white focus:border-ink-accent outline-none appearance-none cursor-pointer transition-all"
                 >
                   <option value="All">All Artists</option>
                   {artistsList.map(artist => (
                     <option key={artist} value={artist}>{artist}</option>
                   ))}
                 </select>
               </div>
            </div>

            {/* Reset Button */}
            <div className="md:col-span-2">
               <button 
                onClick={clearFilters}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
               >
                 <RotateCcw className="w-4 h-4" /> Reset
               </button>
            </div>

          </div>
        </div>

        {/* Gallery Grid - Masonry Layout simulated with Columns */}
        <div className={`columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 transition-opacity duration-500 min-h-[50vh] ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {filteredItems.map((item, index) => (
            <div 
              key={item.id}
              onClick={() => openLightbox(index)}
              className="break-inside-avoid relative group cursor-zoom-in rounded-lg overflow-hidden bg-ink-900 border border-white/5 hover:border-ink-accent/50 transition-all duration-300 shadow-lg"
            >
              <img 
                src={item.src} 
                alt={item.title}
                loading="lazy"
                className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-1 bg-ink-accent/20 border border-ink-accent/30 rounded text-ink-accent text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-t border-white/10 pt-2">
                    <h3 className="text-white font-serif font-bold text-lg">{item.title}</h3>
                    <div className="text-right">
                       <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Artist</span>
                       <span className="text-gray-300 text-xs font-bold uppercase tracking-wide">{item.artist}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-32 border border-dashed border-white/10 rounded-xl bg-ink-900/20">
            <div className="inline-flex p-4 rounded-full bg-ink-900 border border-white/5 mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white mb-2">No masterpieces found</h3>
            <p className="text-gray-500 text-sm mb-6">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={clearFilters}
              className="px-6 py-2 bg-ink-accent text-ink-950 font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-white transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && filteredItems[selectedImageIndex] && (
        <div className="fixed inset-0 z-[100] bg-ink-950/95 backdrop-blur-xl flex items-center justify-center animate-fade-in">
          
          {/* Controls */}
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors z-50 group"
          >
            <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <button 
            onClick={prevImage}
            className="absolute left-4 md:left-8 p-3 bg-black/50 hover:bg-ink-accent text-white hover:text-black rounded-full transition-all z-50 backdrop-blur-md group"
          >
            <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={nextImage}
            className="absolute right-4 md:right-8 p-3 bg-black/50 hover:bg-ink-accent text-white hover:text-black rounded-full transition-all z-50 backdrop-blur-md group"
          >
            <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Main Image Container */}
          <div className="w-full h-full p-4 md:p-12 flex flex-col items-center justify-center" onClick={closeLightbox}>
            <div 
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} 
            >
               <img 
                 src={filteredItems[selectedImageIndex].src} 
                 alt={filteredItems[selectedImageIndex].title}
                 className="max-w-full max-h-full object-contain rounded-md shadow-2xl shadow-black"
               />
               
               {/* Image Info in Lightbox */}
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center space-x-4 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300 delay-1000 md:opacity-100 md:delay-0">
                 <span className="text-ink-accent font-bold uppercase tracking-widest text-xs">
                   {filteredItems[selectedImageIndex].category}
                 </span>
                 <span className="w-px h-3 bg-white/20"></span>
                 <span className="text-white font-serif font-bold">
                   {filteredItems[selectedImageIndex].title}
                 </span>
                 <span className="w-px h-3 bg-white/20"></span>
                 <span className="text-gray-400 text-xs uppercase tracking-wide">
                   Artist: {filteredItems[selectedImageIndex].artist}
                 </span>
               </div>
            </div>
            
            <div className="mt-4 text-gray-500 text-xs uppercase tracking-widest">
              {selectedImageIndex + 1} / {filteredItems.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;