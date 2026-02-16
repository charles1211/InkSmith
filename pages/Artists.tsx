import React from 'react';
import { Link } from 'react-router-dom';
import { Artist, TattooStyle } from '../types';
import { Instagram, Calendar, ArrowRight, PenTool } from 'lucide-react';

const mockArtists: Artist[] = [
  {
    id: 'romark',
    name: 'ROMARK',
    specialties: [TattooStyle.REALISM, TattooStyle.MINIMALIST, TattooStyle.BLACKWORK],
    bio: '',
    imageUrl: 'https://picsum.photos/600/800?random=99',
    instagramHandle: '@romark.inksmithbda',
    highlights: [
      'Certified tattoo artist and body piercer',
      'Recognized for professional works and creativity with almost a decade of experience in the field',
      'Renowned artist experienced in fine lines while offering versatility with other tattoo styles and techniques',
      'Trained and certified with proper and safe tattooing and piercing techniques'
    ]
  },
  {
    id: '1',
    name: 'ELENA "VIPER" ROSSI',
    specialties: [TattooStyle.REALISM, TattooStyle.BLACKWORK],
    bio: 'Specializing in hyper-realistic portraits and dark surrealism. Elena brings 12 years of experience from Milan.',
    imageUrl: 'https://picsum.photos/600/800?random=10',
    instagramHandle: '@viper_ink',
    highlights: [
      'Specializes in hyper-realistic portraits and dark surrealism',
      'Brings over 12 years of professional tattooing experience from Milan',
      'Focuses on high-contrast black and grey realism techniques',
      'Renowned for exploring macabre and ethereal themes in custom compositions'
    ]
  },
  {
    id: '2',
    name: 'KENJI SATO',
    specialties: [TattooStyle.JAPANESE, TattooStyle.TRADITIONAL],
    bio: 'Master of large-scale Irezumi bodysuits and traditional Japanese motifs. Honoring ancient techniques with modern safety standards.',
    imageUrl: 'https://picsum.photos/600/800?random=11',
    instagramHandle: '@kenji_sato_art',
    highlights: [
      'Master artist of large-scale Irezumi bodysuits and Japanese motifs',
      'Honors ancient traditional techniques while adhering to modern safety standards',
      'Dedicates extensive time to consulting for storytelling and meaning',
      'Creates designs that flow seamlessly with the body\'s natural musculature'
    ]
  },
  {
    id: '3',
    name: 'SARAH JENKINS',
    specialties: [TattooStyle.WATERCOLOR, TattooStyle.MINIMALIST],
    bio: 'Fine lines, floral arrangements, and delicate watercolor splashes. Perfect for first-timers and detailed collectors looking for something softer.',
    imageUrl: 'https://picsum.photos/600/800?random=12',
    instagramHandle: '@sarahj_tats',
    highlights: [
      'Expert in fine lines, floral arrangements, and watercolor splashes',
      'Ideal for first-timers and collectors seeking softer, delicate aesthetics',
      'Background in professional botanical illustration enhances her linework',
      'Known for precise, ethereal, and custom-designed concepts'
    ]
  }
];

const Artists: React.FC = () => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-32">
        {mockArtists.map((artist, index) => (
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
                  to={`/book?artistId=${artist.id}`}
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
      
    </div>
  );
};

export default Artists;