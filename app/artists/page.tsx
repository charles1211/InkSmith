import React from 'react';
import Link from 'next/link';
import { Artist } from '../../types';
import { Instagram, Calendar, ArrowRight, PenTool } from 'lucide-react';
import { createClient } from '../../lib/supabase/server';

const Artists = async () => {
  const supabase = await createClient();
  const { data } = await supabase.from('artists').select('*').order('created_at', { ascending: true });

  const artists: Artist[] = (data ?? []).map(r => ({
    id: r.id,
    name: r.name,
    specialties: r.specialties ?? [],
    bio: r.bio ?? '',
    imageUrl: r.image_url ?? '',
    instagramHandle: r.instagram_handle ?? '',
    highlights: r.highlights ?? [],
  }));

  return (
    <div className="min-h-screen bg-ink-950 text-white pt-20">
      
      {/* Header Section */}
      <div className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-ink-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-4 border border-white/10 animate-fade-in">
            <PenTool className="w-6 h-6 text-ink-accent" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter text-white mb-6 uppercase">
            Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-accent to-yellow-600">Artists</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-light leading-relaxed">
            Our collective of world-class artists brings your vision to life. 
            Each specializing in unique styles, from hyper-realism to traditional Japanese Irezumi.
          </p>
        </div>
      </div>

      {/* Artists List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {artists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            {/* Decorative ring */}
            <div className="relative mb-10">
              <div className="w-32 h-32 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-ink-accent/20 bg-ink-accent/5 flex items-center justify-center">
                  <PenTool className="w-8 h-8 text-ink-accent/50" />
                </div>
              </div>
              <div className="absolute inset-0 rounded-full bg-ink-accent/5 blur-2xl -z-10" />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-ink-accent mb-4">Coming Soon</p>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-white uppercase tracking-tighter mb-4">
              Artists Unavailable
            </h2>
            <p className="max-w-md text-gray-500 text-base font-light leading-relaxed mb-10">
              Our roster is being curated. Check back soon to meet the talented artists joining InkSmith.
            </p>

            <Link
              href="/book"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-ink-950 font-black tracking-widest hover:bg-ink-accent hover:text-black transition-all duration-300 rounded-sm shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              <Calendar className="w-5 h-5" />
              Book a Consultation
            </Link>
          </div>
        ) : (
        <div className="space-y-32">
        {artists.map((artist, index) => (
          <div 
            key={artist.id} 
            className={`group flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
          >
            
            {/* Image Container */}
            <div className="w-full lg:w-5/12 relative">
              <div className="aspect-[3/4] overflow-hidden rounded-sm relative shadow-2xl shadow-black/50 border border-white/5">
                <div className="absolute inset-0 bg-ink-950/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img 
                  src={artist.imageUrl} 
                  alt={artist.name} 
                  className="w-full h-full object-cover transition-all duration-1000 transform group-hover:scale-105"
                />
              </div>
              
              {/* Decorative elements behind image */}
              <div className={`absolute -bottom-4 -right-4 w-full h-full border border-ink-accent/20 rounded-sm -z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2 ${index % 2 === 1 ? 'left-4 right-auto' : ''}`}></div>
            </div>

            {/* Content Container */}
            <div className="w-full lg:w-7/12 space-y-8">
              
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-4xl md:text-6xl font-black font-sans uppercase tracking-tighter text-white leading-none mb-4">
                      {artist.name}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {artist.specialties.map(style => (
                        <span key={style} className="px-3 py-1 text-xs font-bold tracking-widest uppercase border border-white/10 bg-white/5 text-ink-accent rounded-sm">
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a 
                    href={`https://instagram.com/${artist.instagramHandle.replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-end group/link shrink-0"
                  >
                    <span className="text-xs text-gray-500 uppercase tracking-widest mb-1 group-hover/link:text-ink-accent transition-colors">Follow on IG</span>
                    <div className="flex items-center text-white font-bold text-lg group-hover/link:text-ink-accent transition-colors">
                      {artist.instagramHandle} <Instagram className="ml-2 w-5 h-5" />
                    </div>
                  </a>
                </div>

                <div className="text-gray-300 text-lg font-light leading-relaxed">
                   {artist.highlights ? (
                    <div className="bg-ink-900/30 p-6 rounded-lg border border-white/5">
                      <ul className="space-y-4">
                        {artist.highlights.map((point, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-ink-accent mr-3 text-xl leading-none mt-1.5">•</span>
                            <span className="text-base md:text-lg">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="opacity-80">{artist.bio}</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <Link 
                  href={`/book?artistId=${artist.id}`}
                  className="inline-flex items-center justify-between px-8 py-4 bg-white text-ink-950 font-black tracking-widest hover:bg-ink-accent hover:text-black transition-all duration-300 rounded-sm group/btn shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  <span className="flex items-center mr-8">
                    <Calendar className="mr-3 w-5 h-5" />
                    BOOK {artist.name.split(' ')[0]}
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          </div>
        ))}
        </div>
        )}
      </div>

    </div>
  );
};

export default Artists;