'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Droplet, 
  Sun, 
  Clock, 
  Sparkles, 
  XCircle, 
  AlertTriangle, 
  Info,
  CheckCircle2,
  Calendar,
  Flame,
  Ban
} from 'lucide-react';

type AftercareType = 'tattoo' | 'piercing';

const AftercareContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AftercareType>('tattoo');

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'piercing') {
      setActiveTab('piercing');
    } else {
      setActiveTab('tattoo');
    }
  }, [searchParams]);

  const handleTabChange = (tab: AftercareType) => {
    setActiveTab(tab);
    router.replace(`/aftercare?type=${tab}`);
  };

  return (
    <div className="pt-20 min-h-screen bg-ink-950 text-white selection:bg-ink-accent selection:text-black">
      {/* Background Texture similar to Home */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-5">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-ink-accent/5 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-serif font-black mb-6 text-white uppercase tracking-tight">
            Aftercare <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-accent to-yellow-600">Guide</span>
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            {activeTab === 'tattoo' 
              ? "Your new tattoo is a collaborative effort. We did our part, now it's up to you to ensure it heals perfectly."
              : "A piercing is a commitment. Proper hygiene and patience are the keys to a healthy, beautiful modification."}
          </p>
        </div>

        {/* Premium Tab Switcher */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/5 p-1.5 rounded-full border border-white/10 inline-flex relative backdrop-blur-md">
            <button
              onClick={() => handleTabChange('tattoo')}
              className={`relative z-10 px-10 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                activeTab === 'tattoo' 
                  ? 'text-ink-950 bg-ink-accent shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Tattoo
            </button>
            <button
              onClick={() => handleTabChange('piercing')}
              className={`relative z-10 px-10 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                activeTab === 'piercing' 
                  ? 'text-ink-950 bg-ink-accent shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Piercing
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="animate-fade-in transition-all duration-500">
          {activeTab === 'tattoo' ? (
            <div className="space-y-12">
              
              {/* Timeline Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Phase 1: Immediate */}
                <div className="group relative bg-gradient-to-b from-ink-900 to-ink-950 p-8 rounded-2xl border border-white/10 hover:border-ink-accent/30 transition-all duration-300 shadow-2xl">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Droplet className="w-24 h-24" />
                  </div>
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 rounded-full bg-ink-accent text-ink-950 flex items-center justify-center font-bold text-xl mr-4 shadow-lg shadow-ink-accent/20">1</div>
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-wide">Immediate Care</h3>
                      <span className="text-ink-accent text-xs font-bold tracking-widest uppercase">First 24 Hours</span>
                    </div>
                  </div>
                  <ol className="space-y-6 relative border-l border-white/10 ml-6 pl-8">
                    <li className="relative">
                      <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full border-2 border-ink-900 bg-gray-600"></span>
                      <p className="text-gray-300 leading-relaxed">
                        <strong className="text-white block mb-1">Remove & Rinse</strong>
                        Remove the wrap once home. Rinse with <span className="text-ink-accent">WARM</span> water and mild antibacterial soap. Rinse with <span className="text-ink-accent">COLD</span> water to close pores.
                      </p>
                    </li>
                    <li className="relative">
                      <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full border-2 border-ink-900 bg-gray-600"></span>
                      <p className="text-gray-300 leading-relaxed">
                         <strong className="text-white block mb-1">Repeat 3 Times</strong>
                         Ensure all plasma and ink residue is washed away.
                      </p>
                    </li>
                    <li className="relative">
                      <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full border-2 border-ink-900 bg-gray-600"></span>
                      <p className="text-gray-300 leading-relaxed">
                        <strong className="text-white block mb-1">Dry & Ointment</strong>
                        Air dry or pat with paper towel. Apply a <span className="italic text-white">very thin</span> layer of Vitamin A&D ointment. The wound needs to breathe.
                      </p>
                    </li>
                  </ol>
                </div>

                {/* Phase 2: Maintenance */}
                <div className="group relative bg-gradient-to-b from-ink-900 to-ink-950 p-8 rounded-2xl border border-white/10 hover:border-ink-accent/30 transition-all duration-300 shadow-2xl">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Calendar className="w-24 h-24" />
                  </div>
                   <div className="flex items-center mb-8">
                    <div className="w-12 h-12 rounded-full bg-ink-900 border border-ink-accent text-ink-accent flex items-center justify-center font-bold text-xl mr-4">2</div>
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-wide">The Healing Phase</h3>
                      <span className="text-ink-accent text-xs font-bold tracking-widest uppercase">Days 2 - 14+</span>
                    </div>
                  </div>
                  <ol className="space-y-6 relative border-l border-white/10 ml-6 pl-8">
                    <li className="relative">
                      <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full border-2 border-ink-900 bg-gray-600"></span>
                      <p className="text-gray-300 leading-relaxed">
                        <strong className="text-white block mb-1">Consistency is Key</strong>
                        Repeat the wash/ointment process <span className="text-white">2x daily</span> (morning & night) for 3 days.
                      </p>
                    </li>
                    <li className="relative">
                      <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full border-2 border-ink-900 bg-gray-600"></span>
                      <p className="text-gray-300 leading-relaxed">
                        <strong className="text-white block mb-1">Switch to Lotion</strong>
                        On the 4th day, stop using ointment. Switch to <span className="text-white">unscented moisturizing lotion</span>.
                      </p>
                    </li>
                     <li className="relative">
                      <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full border-2 border-ink-900 bg-gray-600"></span>
                      <p className="text-gray-300 leading-relaxed">
                        <strong className="text-white block mb-1">Patience</strong>
                        Healing takes 1-2 weeks or longer. Peeling and itching are normal.
                      </p>
                    </li>
                  </ol>
                </div>
              </div>

              {/* The "No-Go" Zone */}
              <div className="relative rounded-2xl overflow-hidden border border-red-500/20 bg-red-950/10">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
                <div className="p-8 md:p-10">
                  <div className="flex items-center mb-8">
                    <Ban className="w-8 h-8 text-red-500 mr-4" />
                    <h3 className="text-2xl font-serif font-bold text-white uppercase">Strictly Prohibited</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { title: "No Petroleum", desc: "Vaseline, Vicks, Oils, or heavy creams suffocate the skin." },
                      { title: "No Soaking", desc: "No pools, oceans, jacuzzis, or baths. Showers only." },
                      { title: "No Sun", desc: "Direct sunlight destroys fresh ink. Keep it covered." },
                      { title: "No Picking", desc: "Scabs protect the ink. Picking pulls color out and causes scarring." },
                      { title: "No Touching", desc: "Dirty hands and pets are the #1 cause of infection." },
                      { title: "Dietary", desc: "Avoid inflammatory foods (seafood, nuts) for faster healing." },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start space-x-3 p-4 rounded-lg bg-red-900/5 hover:bg-red-900/10 transition-colors">
                        <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="font-bold text-red-200 text-sm uppercase mb-1">{item.title}</h4>
                          <p className="text-xs text-red-100/60 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Notices */}
              <div className="flex flex-col md:flex-row gap-6">
                 <div className="flex-1 p-6 bg-ink-900/30 border border-white/5 rounded-xl flex items-start gap-4">
                    <Info className="w-6 h-6 text-gray-500 shrink-0" />
                    <p className="text-sm text-gray-400 italic">Redness and/or peeling of the skin is normal during the healing process. Do not panic if it looks 'ugly' for a few days.</p>
                 </div>
                 <div className="flex-1 p-6 bg-ink-900/30 border border-white/5 rounded-xl flex items-start gap-4">
                    <Sun className="w-6 h-6 text-ink-accent shrink-0" />
                    <p className="text-sm text-gray-400 italic">Long-term care: Extreme sun exposure fades tattoos over years. Always use SPF 25+ on healed tattoos.</p>
                 </div>
              </div>

            </div>
          ) : (
            <div className="space-y-12">
              
              {/* Critical Warnings - High Visibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative overflow-hidden bg-gradient-to-br from-red-900/40 to-ink-950 border border-red-500/30 p-8 rounded-2xl group hover:border-red-500/50 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                      <Ban className="w-24 h-24 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white uppercase mb-2 relative z-10 flex items-center">
                       Do Not Touch <XCircle className="ml-3 w-6 h-6 text-red-500" />
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed relative z-10 max-w-xs">
                      The only time you will touch your piercing is when you are cleaning it. <strong>Always wash your hands first.</strong>
                    </p>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-red-900/40 to-ink-950 border border-red-500/30 p-8 rounded-2xl group hover:border-red-500/50 transition-all">
                     <div className="absolute top-0 right-0 p-4 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                      <AlertTriangle className="w-24 h-24 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white uppercase mb-2 relative z-10 flex items-center">
                       Keep Jewelry In <AlertTriangle className="ml-3 w-6 h-6 text-red-500" />
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed relative z-10 max-w-xs">
                      New piercings can shrink immediately. Do not remove or change jewelry until fully healed.
                    </p>
                </div>
              </div>

              {/* Cleaning Protocol */}
              <div className="bg-ink-900/40 border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ink-accent via-white to-ink-accent opacity-50"></div>
                
                <div className="flex items-center mb-10">
                    <div className="p-3 bg-ink-accent/10 rounded-lg mr-4 border border-ink-accent/20">
                      <Sparkles className="w-8 h-8 text-ink-accent" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-serif font-bold text-white uppercase">The Cleaning Ritual</h3>
                      <p className="text-ink-accent text-sm font-bold tracking-widest uppercase">Twice Daily • Morning & Night</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                   {[
                     { step: "1", title: "Wash Hands", desc: "Thoroughly with antibacterial soap before touching anything." },
                     { step: "2", title: "Cleanse", desc: "Gently clean with water. Dry with disposable paper products (gauze/tissue). No cloth towels." },
                     { step: "3", title: "Treat", desc: "Apply a small amount of Betadine (Povidone-iodine). Consult pharmacist if unavailable." },
                     { step: "4", title: "Repeat", desc: "Continue until healed. Titanium: ~2 months. Stainless: ~6 months." }
                   ].map((item, idx) => (
                     <div key={idx} className="relative">
                        <div className="text-6xl font-black text-white/5 absolute -top-4 -left-2 z-0 select-none">{item.step}</div>
                        <div className="relative z-10">
                          <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                          <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                        </div>
                        {idx < 3 && <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-white/10"></div>}
                     </div>
                   ))}
                </div>
              </div>

              {/* What is Normal vs Warning */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Normal */}
                <div className="bg-ink-900/20 border border-blue-500/20 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <Info className="w-6 h-6 text-blue-400 mr-3" />
                    <h3 className="text-xl font-bold text-white uppercase tracking-wide">Expectations</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Bleeding, bruising, and swelling initially.",
                      "Tenderness, redness, or itching for several days.",
                      "Secretion of whitish-yellow fluid (not pus) that dries into crust.",
                      "Healing is non-linear; it may seem healed then regress.",
                      "Unpleasant smell if not cleaned daily (doesn't always mean infection)."
                    ].map((text, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-400">
                        <CheckCircle2 className="w-4 h-4 text-blue-500/50 mr-3 mt-0.5 shrink-0" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Avoid */}
                <div className="bg-ink-900/20 border border-ink-accent/20 rounded-2xl p-8">
                   <div className="flex items-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-ink-accent mr-3" />
                    <h3 className="text-xl font-bold text-white uppercase tracking-wide">Avoid for Fast Healing</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                       "Lotions, perfume, hair dye, cosmetics near piercing.",
                       "Alcohol-based mouthwash (for oral piercings).",
                       "Over-cleaning (causes irritation).",
                       "Anti-inflammatory foods (nuts, avocado, seafood).",
                       "Submerging in water (pools, baths). Showers are fine.",
                       "Twisting, turning, or picking at crusties."
                    ].map((text, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-400">
                        <XCircle className="w-4 h-4 text-ink-accent/50 mr-3 mt-0.5 shrink-0" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="mt-20 text-center">
          <div className="inline-block p-1 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 rounded-xl">
            <div className="bg-ink-950 rounded-lg px-8 py-6 border border-white/5">
              <h4 className="text-white font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                 <Flame className="w-4 h-4 text-red-500" /> Medical Warning
              </h4>
              <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                If you notice extreme redness, spreading streaks, excessive swelling, or green/pus discharge after the first few days, 
                please contact us or a physician immediately. These may be signs of infection.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default function Aftercare() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink-950 flex items-center justify-center"><div className="w-8 h-8 border-2 border-ink-accent border-t-transparent rounded-full animate-spin" /></div>}>
      <AftercareContent />
    </Suspense>
  );
}