import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, ShieldCheck, MapPin, Clock, ChevronRight, PenTool } from 'lucide-react';

const Home: React.FC = () => {
  const studioImages = [
    "https://picsum.photos/600/1000?random=10",
    "https://picsum.photos/600/1000?random=11",
    "https://picsum.photos/600/1000?random=12",
    "https://picsum.photos/600/1000?random=13",
    "https://picsum.photos/600/1000?random=14",
    "https://picsum.photos/600/1000?random=15",
  ];

  // Duplicate images to create a seamless loop
  const carouselImages = [...studioImages, ...studioImages];

  const recentWorks = [
    { id: 1, src: "https://picsum.photos/500/500?random=21", category: "Realism", title: "Lion Portrait", artist: "Romark" },
    { id: 2, src: "https://picsum.photos/500/500?random=22", category: "Blackwork", title: "Geometric Sleeve", artist: "Viper" },
    { id: 3, src: "https://picsum.photos/500/500?random=23", category: "Japanese", title: "Dragon Koi", artist: "Kenji" },
    { id: 4, src: "https://picsum.photos/500/500?random=24", category: "Fine Line", title: "Floral Wreath", artist: "Sarah" },
    { id: 5, src: "https://picsum.photos/500/500?random=25", category: "Traditional", title: "Eagle Chest", artist: "Romark" },
    { id: 6, src: "https://picsum.photos/500/500?random=26", category: "Realism", title: "Greek Statue", artist: "Viper" },
    { id: 7, src: "https://picsum.photos/500/500?random=27", category: "Watercolor", title: "Abstract Splash", artist: "Sarah" },
    { id: 8, src: "https://picsum.photos/500/500?random=28", category: "Neo Trad", title: "Wolf Head", artist: "Kenji" },
  ];

  const piercingTypes = [
    { name: 'Earlobe', img: 'https://picsum.photos/300/300?random=101' },
    { name: 'Conch', img: 'https://picsum.photos/300/300?random=102' },
    { name: 'Rook', img: 'https://picsum.photos/300/300?random=103' },
    { name: 'Tragus', img: 'https://picsum.photos/300/300?random=104' },
    { name: 'Flat Tragus', img: 'https://picsum.photos/300/300?random=105' },
    { name: 'Helix', img: 'https://picsum.photos/300/300?random=106' },
    { name: 'Forward Helix', img: 'https://picsum.photos/300/300?random=107' },
    { name: 'Industrial', img: 'https://picsum.photos/300/300?random=108' },
    { name: 'Daith', img: 'https://picsum.photos/300/300?random=109' },
    { name: 'Smiley', img: 'https://picsum.photos/300/300?random=110' },
    { name: 'Tongue', img: 'https://picsum.photos/300/300?random=111' },
    { name: 'Snake Bite', img: 'https://picsum.photos/300/300?random=112' },
    { name: 'Snake Eye', img: 'https://picsum.photos/300/300?random=113' },
    { name: 'Labret', img: 'https://picsum.photos/300/300?random=114' },
    { name: 'Nose', img: 'https://picsum.photos/300/300?random=115' },
    { name: 'Septum', img: 'https://picsum.photos/300/300?random=116' },
    { name: 'Eyebrow', img: 'https://picsum.photos/300/300?random=117' },
    { name: 'Dermal', img: 'https://picsum.photos/300/300?random=118' },
    { name: 'Nipple', img: 'https://picsum.photos/300/300?random=119' },
    { name: 'Christina', img: 'https://picsum.photos/300/300?random=120' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-ink-950 text-white selection:bg-ink-accent selection:text-black">
      
      {/* GLOBAL PARALLAX BACKGROUND - THE "VIBE" */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Texture Layer */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: `url("https://www.transparenttextures.com/patterns/wall-4-light.png")`,
            backgroundRepeat: 'repeat'
          }}
        />
        {/* Smoky Ink Effect Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-soft-light"
          style={{
             backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")', // Abstract fluid/ink
             filter: 'grayscale(100%)'
          }}
        />
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-slow {
          animation: scroll 40s linear infinite;
        }
      `}</style>
      
      {/* Hero Section with Parallax Background */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden z-10">
        {/* Parallax Image Layer */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1598371839696-5c5bb00bdc29?q=80&w=1920&auto=format&fit=crop")', // Dark tattoo artist/glove image
            backgroundAttachment: 'fixed', // Creates the parallax window effect
            backgroundPosition: 'center',
            filter: 'brightness(0.3) contrast(1.1) sepia(0.2)'
          }}
        />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-ink-950/90 via-transparent to-ink-950" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-ink-950 to-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-ink-950 to-transparent z-10"></div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto space-y-6 flex flex-col items-center">
          
          <div className="animate-fade-in space-y-2">
             <span className="block text-ink-accent text-sm md:text-base tracking-[0.3em] uppercase font-bold drop-shadow-md">
               Established in Bermuda
             </span>
             <div className="h-px w-20 bg-ink-accent/50 mx-auto"></div>
          </div>

          <div className="animate-fade-in">
            <div className="w-24 h-24 rounded-full border border-ink-accent/30 flex items-center justify-center bg-ink-950/30 backdrop-blur-sm mx-auto shadow-[0_0_20px_rgba(212,175,55,0.15)] group hover:border-ink-accent/60 transition-colors duration-500">
              <PenTool className="w-12 h-12 text-ink-accent drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
            </div>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-none animate-fade-in-up drop-shadow-2xl">
            Tattoo <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">and Body Piercing</span>
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link 
              to="/book" 
              className="group relative px-10 py-4 bg-white text-ink-950 font-black tracking-widest uppercase text-sm overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-shadow duration-300"
            >
              <span className="relative z-10 flex items-center">
                Book Appointment <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-ink-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </Link>
            
            <Link 
              to="/artists"
              className="group flex items-center text-sm font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors backdrop-blur-sm bg-black/20 px-6 py-4 border border-white/5 hover:border-white/20"
            >
              View Artists <ChevronRight className="ml-1 w-4 h-4 text-ink-accent" />
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500 z-20">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-500 to-transparent"></div>
        </div>
      </div>

      {/* Intro Section - Transparent background to see global texture */}
      <section className="py-24 lg:py-32 relative z-10 bg-ink-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Brand Statement */}
            <div className="lg:col-span-7 space-y-10">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white uppercase leading-none">
                Not Your <span className="text-ink-accent italic">Traditional</span> <br/>
                Tattoo Shop.
              </h2>
              
              <div className="space-y-6 text-lg text-gray-300 font-light leading-relaxed">
                <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-white first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px]">
                  We serve the island with the finest tattoo and piercing artists in the industry. 
                  We pride ourselves on being original on every level — from our custom artwork 
                  to our welcoming atmosphere and professional attitude.
                </p>
                <p>
                  Located in the heart of Hamilton, Inksmith provides innovative modifications 
                  and specialized techniques in a sterile, high-end environment.
                </p>
              </div>

              <div className="pt-4 flex items-start space-x-2 text-sm font-bold tracking-widest text-ink-accent uppercase">
                 <MapPin className="w-4 h-4 mt-1" />
                 <span>39 King St, 2nd Floor, Ratteray Bldg., Hamilton HM 19</span>
              </div>
            </div>

            {/* Right Column: Hours & Info */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-4 bg-ink-accent/5 blur-2xl rounded-full"></div>
              <div className="relative bg-black/40 border border-white/10 p-8 md:p-12 backdrop-blur-md">
                <div className="flex justify-between items-start mb-10">
                  <h3 className="text-2xl font-serif font-bold text-white uppercase">Studio Hours</h3>
                  <Clock className="w-6 h-6 text-ink-accent" />
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <span className="text-gray-400 font-medium">Monday - Saturday</span>
                    <span className="text-xl text-white font-serif">12:00 PM — 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <span className="text-gray-400 font-medium">Sunday</span>
                    <span className="text-xl text-white font-serif">11:00 AM — 7:00 PM</span>
                  </div>
                </div>

                <div className="mt-10">
                  <div className="inline-flex items-center px-4 py-2 bg-ink-accent/10 border border-ink-accent/20 text-ink-accent text-xs font-bold tracking-widest uppercase rounded-full">
                    <span className="w-2 h-2 bg-ink-accent rounded-full mr-2 animate-pulse"></span>
                    Accepting Walk-ins
                  </div>
                  <p className="mt-6 text-sm text-gray-500 italic">
                    *Appointments recommended for custom pieces. Deposits required.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid - Parallax Background #2 */}
      <section className="relative border-y border-white/5 bg-fixed bg-center bg-cover py-12" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80")', backgroundAttachment: 'fixed' }}>
        <div className="absolute inset-0 bg-ink-950/90"></div> {/* Dark overlay */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5 max-w-7xl mx-auto">
          {[
            { 
              icon: Star, 
              title: "World Class Artists", 
              desc: "Award-winning specialists in Realism, Japanese, and Traditional styles." 
            },
            { 
              icon: ShieldCheck, 
              title: "Sterile Environment", 
              desc: "Hospital-grade sterilization protocols and single-use equipment." 
            },
            { 
              icon: Sparkles, 
              title: "Custom Design", 
              desc: "Every piece is unique. Consultation-driven design process." 
            }
          ].map((feature, idx) => (
            <div key={idx} className="p-12 group hover:bg-white/5 transition-colors duration-500">
              <feature.icon className="w-8 h-8 text-gray-500 group-hover:text-ink-accent mb-6 transition-colors duration-300" />
              <h3 className="text-xl font-serif font-bold text-white mb-3 uppercase tracking-wide">
                {feature.title}
              </h3>
              <p className="text-gray-400 font-light leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Studio Showcase - Full Width */}
      <section className="py-32 overflow-hidden bg-ink-950/90 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 flex flex-col md:flex-row items-end justify-between gap-8">
          <div>
            <span className="text-ink-accent font-bold tracking-widest uppercase text-sm mb-2 block">The Space</span>
            <h2 className="text-4xl md:text-6xl font-serif font-black text-white uppercase leading-none">
              Inside The <br/> Studio
            </h2>
          </div>
          <div className="h-px bg-white/10 flex-grow mx-8 hidden md:block"></div>
          <p className="text-gray-400 max-w-sm text-right hidden md:block">
            An inspiring environment designed for creativity, comfort, and cleanliness.
          </p>
        </div>
        
        <div className="w-full">
          <div className="flex w-max animate-scroll-slow hover:[animation-play-state:paused]">
            {carouselImages.map((src, index) => (
              <div 
                key={index} 
                className="w-[300px] md:w-[400px] aspect-[3/4] relative mx-4 overflow-hidden group"
              >
                <img 
                  src={src} 
                  alt="Studio Interior" 
                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 brightness-50 group-hover:brightness-100"
                />
                <div className="absolute inset-0 border border-white/10 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Work Grid */}
      <section className="py-24 bg-ink-950/95 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 uppercase">Tattoo gallery</h2>
            <div className="text-gray-400 font-light text-lg space-y-6 leading-relaxed">
              <p>
                The specifics and details of each of the client's needs are extremely important to us, and the quality of our work and open-minded attitude relies on the personal connection we form with all of our clients. Our artist is ready to turn your vision into a work of art.
              </p>
              <p className="text-ink-accent font-medium tracking-wide">
                Follow us on social media to see more (@inksmithtattoobda)
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-4">
            {recentWorks.map((work) => (
              <div key={work.id} className="aspect-square relative group overflow-hidden bg-ink-950 cursor-pointer">
                <img 
                  src={work.src} 
                  alt={work.title} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                
                {/* Overlay matching Portfolio.tsx style */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-ink-accent text-[10px] md:text-xs font-bold uppercase tracking-widest block mb-1">
                      {work.category}
                    </span>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-1">
                      <h3 className="text-white font-serif font-bold text-sm md:text-lg leading-tight">{work.title}</h3>
                      <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wide">by {work.artist}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link 
              to="/portfolio" 
              className="inline-flex items-center text-sm font-bold tracking-[0.2em] text-white uppercase hover:text-ink-accent transition-colors border-b border-transparent hover:border-ink-accent pb-1"
            >
              View Full Portfolio <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Piercing Section - Redesigned */}
      <section className="py-32 bg-gradient-to-b from-ink-900 to-ink-950 relative z-10 border-t border-white/5 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-ink-accent/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-indigo-900/10 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header & Intro */}
          <div className="flex flex-col lg:flex-row gap-16 items-center mb-20">
             {/* Content */}
             <div className="lg:w-1/2 space-y-8">
                <div className="inline-flex items-center space-x-2 text-ink-accent font-bold tracking-widest uppercase text-sm bg-ink-accent/10 px-4 py-2 rounded-full border border-ink-accent/20">
                  <Sparkles className="w-4 h-4" />
                  <span>Precision Piercing</span>
                </div>
                
                <h2 className="text-5xl md:text-6xl font-serif font-black text-white leading-tight">
                  Adorn <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">Your Body.</span>
                </h2>
                
                <div className="space-y-6 text-lg text-gray-400 font-light leading-relaxed border-l-2 border-ink-accent/30 pl-6">
                  <p>
                    Our piercing studio maintains the highest standards of sterilization and hygiene. 
                    We believe that every modification should be a safe, comfortable, and positive experience.
                  </p>
                  <p>
                    From classic ear curation to complex surface piercings, our specialists utilize 
                    high-quality implant-grade titanium and gold jewelry to ensure perfect healing and lasting beauty.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  {['Implant Grade Jewelry', 'Single-Use Needles', 'Aftercare Support'].map((item) => (
                    <div key={item} className="flex items-center text-sm font-medium text-gray-300">
                      <ShieldCheck className="w-4 h-4 text-ink-accent mr-2" />
                      {item}
                    </div>
                  ))}
                </div>
             </div>

             {/* Featured Image */}
             <div className="lg:w-1/2 relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-ink-accent/20 to-transparent rounded-2xl transform rotate-3 scale-105 opacity-50 group-hover:rotate-2 transition-transform duration-700"></div>
                <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img 
                    src="https://picsum.photos/600/800?random=50" 
                    alt="Professional Piercing" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="text-white text-xl font-serif italic mb-2">"Safety is our signature."</div>
                    <div className="text-ink-accent text-sm font-bold tracking-widest uppercase">Head Piercer</div>
                  </div>
                </div>
             </div>
          </div>
          
          {/* Visual Divider */}
          <div className="flex items-center justify-center space-x-4 mb-16 opacity-50">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-grow"></div>
            <Star className="w-4 h-4 text-ink-accent" />
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-grow"></div>
          </div>

          {/* Piercing Grid */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h3 className="text-3xl font-serif font-bold text-white mb-4">Placement Guide</h3>
              <p className="text-gray-400">Explore our most popular piercing options. Each placement is performed with anatomical precision.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {piercingTypes.map((piercing, idx) => (
                <div key={idx} className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-ink-800 border border-white/5 shadow-lg cursor-default">
                  <img
                    src={piercing.img}
                    alt={piercing.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="w-8 h-0.5 bg-ink-accent mb-3 w-0 group-hover:w-8 transition-all duration-300"></div>
                    <span className="block text-lg font-bold text-white tracking-wide group-hover:text-ink-accent transition-colors">
                      {piercing.name}
                    </span>
                    <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 block mt-1">
                      View Details
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Pre-Footer CTA */}
      <section className="py-24 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-ink-accent/5"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 uppercase">
            Ready to get Inked or Pierced?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             <Link 
              to="/book" 
              className="px-12 py-5 bg-white text-ink-950 font-black tracking-widest uppercase hover:bg-ink-accent hover:text-black transition-colors duration-300 shadow-xl"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;