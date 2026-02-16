import React from 'react';
import { HelpCircle, DollarSign, Calendar, AlertTriangle } from 'lucide-react';

const FAQ: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-ink-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">FREQUENTLY ASKED QUESTIONS</h1>
          <p className="text-gray-400 text-lg">Everything you need to know before getting inked.</p>
        </div>

        <div className="space-y-6">
          
          <div className="bg-ink-900 border border-white/5 rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start">
                <Calendar className="w-6 h-6 text-ink-accent mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold font-serif mb-2 text-white">Do you accept walk-ins?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    We primarily work by appointment to ensure each piece gets the attention it deserves. 
                    However, we occasionally have time for walk-ins on weekends. Check our Instagram stories for daily availability updates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-ink-900 border border-white/5 rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start">
                <DollarSign className="w-6 h-6 text-ink-accent mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold font-serif mb-2 text-white">How much does a tattoo cost?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Our shop minimum is <strong>$150</strong>. Hourly rates vary by artist, typically ranging from <strong>$150 to $250 per hour</strong>. 
                    For large custom pieces, we can provide a flat day rate estimate during your consultation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-ink-900 border border-white/5 rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-ink-accent mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold font-serif mb-2 text-white">Is a deposit required?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Yes. A <strong>non-refundable deposit</strong> (usually $100-$200 depending on the project size) is required to secure your appointment. 
                    This deposit goes toward the final cost of your tattoo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-ink-900 border border-white/5 rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start">
                <HelpCircle className="w-6 h-6 text-ink-accent mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold font-serif mb-2 text-white">How old do I have to be?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    You must be at least <strong>18 years old</strong> with a valid government-issued photo ID. 
                    We do not tattoo minors, even with parental consent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-ink-900 border border-white/5 rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start">
                <HelpCircle className="w-6 h-6 text-ink-accent mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold font-serif mb-2 text-white">How should I prepare for my appointment?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Get a good night's sleep.</li>
                      <li>Eat a substantial meal before coming in.</li>
                      <li>Stay hydrated.</li>
                      <li>Avoid alcohol and blood-thinning medications for 24 hours prior.</li>
                      <li>Wear comfortable clothing that allows easy access to the area being tattooed.</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FAQ;