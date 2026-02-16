'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { generateTattooConcepts } from '../../services/geminiService';
import { GeminiIdeaResponse } from '../../types';
import { Sparkles, Loader2, Lightbulb, Clock, MapPin, AlertCircle } from 'lucide-react';

const AIConsultation: React.FC = () => {
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('Realism');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeminiIdeaResponse | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const data = await generateTattooConcepts(description, style);
      if (data) {
        setResults(data);
      } else {
        setError('Could not generate ideas. Please try again or check your API configuration.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-ink-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-ink-800 to-black border border-white/10 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-ink-accent" />
          </div>
          <h1 className="text-4xl font-serif font-bold">AI TATTOO CONSULTANT</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Not sure what to get? Describe your story, memory, or idea, and our AI will generate professional concepts for you.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-ink-900/50 p-8 rounded-xl border border-white/10 backdrop-blur-sm mb-12">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Describe your idea
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., A wolf howling at the moon representing strength and solitude, incorporating geometric shapes..."
                className="w-full h-32 bg-ink-950 border border-white/10 rounded-lg p-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-ink-accent focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preferred Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-ink-950 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-ink-accent outline-none"
              >
                <option value="Realism">Realism</option>
                <option value="Traditional">Traditional / Old School</option>
                <option value="Neo Traditional">Neo Traditional</option>
                <option value="Watercolor">Watercolor</option>
                <option value="Blackwork">Blackwork / Dotwork</option>
                <option value="Japanese">Japanese (Irezumi)</option>
                <option value="Minimalist">Minimalist / Fine Line</option>
                <option value="Trash Polka">Trash Polka</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-ink-accent hover:bg-[#B08D33] text-black font-bold rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  DREAMING UP CONCEPTS...
                </>
              ) : (
                'GENERATE CONCEPTS'
              )}
            </button>
          </form>
          
          {typeof process !== 'undefined' && !process.env.API_KEY && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded flex items-center text-red-200 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                Note: Gemini API Key is missing in environment variables.
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-8 bg-red-900/20 border border-red-500/20 text-red-200 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-serif font-bold text-center text-white">GENERATED CONCEPTS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.concepts.map((concept, index) => (
                <div key={index} className="bg-ink-800/50 border border-white/5 rounded-xl p-6 hover:bg-ink-800 hover:border-ink-accent/50 transition-all duration-300 flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-4 text-ink-accent">
                    <Lightbulb className="w-5 h-5" />
                    <h3 className="font-bold text-lg text-white">{concept.title}</h3>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow">
                    {concept.description}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <div className="flex items-start text-xs text-gray-400">
                      <MapPin className="w-4 h-4 mr-2 text-ink-accent flex-shrink-0" />
                      <span>Placement: {concept.placementSuggestion}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-4 h-4 mr-2 text-ink-accent flex-shrink-0" />
                      <span>Est. Time: {concept.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center pt-8">
               <p className="text-gray-400 mb-4">Like one of these ideas?</p>
               <Link href="/book" className="inline-block px-8 py-3 border border-white text-white hover:bg-white hover:text-ink-950 font-bold transition-colors rounded-sm">
                 BOOK AN ARTIST TO REFINE IT
               </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AIConsultation;