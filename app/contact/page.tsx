'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ExternalLink, Clock, Instagram, Facebook } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => setSubmitted(true), 1000);
  };

  return (
    <div className="min-h-screen bg-ink-950 text-white pt-20 pb-20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-ink-accent/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20 space-y-6">
           <div className="inline-flex items-center justify-center p-2 px-4 bg-white/5 border border-white/10 rounded-full mb-4 backdrop-blur-sm animate-fade-in">
             <span className="text-xs font-bold tracking-[0.2em] text-ink-accent uppercase">We'd love to hear from you</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-serif font-black text-white uppercase tracking-tight animate-fade-in-up">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-accent to-yellow-600">Touch</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed animate-fade-in delay-100">
            Whether you have a concept in mind, questions about our process, or just want to say hello.
            Our team is ready to help you start your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Contact Info & Map (Span 5) */}
          <div className="lg:col-span-5 space-y-8 animate-fade-in-left">
            
            {/* Contact Cards */}
            <div className="grid gap-4">
              {/* Address */}
              <div className="group p-6 bg-ink-900/40 border border-white/5 hover:border-ink-accent/30 rounded-xl transition-all duration-300 hover:bg-ink-900/60 flex items-start space-x-5">
                <div className="p-3 bg-ink-950 border border-white/10 rounded-lg text-ink-accent group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Visit Studio</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    39 King St, 2nd Floor<br/>
                    Ratteray Bldg., Hamilton, Bermuda HM 19
                  </p>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="group p-6 bg-ink-900/40 border border-white/5 hover:border-ink-accent/30 rounded-xl transition-all duration-300 hover:bg-ink-900/60 flex items-start space-x-5">
                <div className="p-3 bg-ink-950 border border-white/10 rounded-lg text-ink-accent group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Contact</h3>
                  <p className="text-gray-400 text-sm mb-1 hover:text-white transition-colors">
                    <a href="tel:+14412618532">+1 (441) 261-8532</a>
                  </p>
                  <p className="text-gray-400 text-sm hover:text-white transition-colors">
                    <a href="mailto:inksmithbda@gmail.com">inksmithbda@gmail.com</a>
                  </p>
                </div>
              </div>

               {/* Hours */}
               <div className="group p-6 bg-ink-900/40 border border-white/5 hover:border-ink-accent/30 rounded-xl transition-all duration-300 hover:bg-ink-900/60 flex items-start space-x-5">
                <div className="p-3 bg-ink-950 border border-white/10 rounded-lg text-ink-accent group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Opening Hours</h3>
                  <p className="text-gray-400 text-sm flex justify-between w-48">
                    <span>Mon - Sat:</span> <span>12pm - 8pm</span>
                  </p>
                   <p className="text-gray-400 text-sm flex justify-between w-48">
                    <span>Sunday:</span> <span>11am - 7pm</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
             <div className="flex space-x-6 pt-4 px-2">
                <a href="https://instagram.com/inksmithtattoobda" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-xs font-bold tracking-widest text-gray-400 hover:text-ink-accent transition-colors group">
                  <div className="p-2 border border-white/10 rounded-full group-hover:border-ink-accent transition-colors">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <span>INSTAGRAM</span>
                </a>
                 <a href="#" className="flex items-center space-x-2 text-xs font-bold tracking-widest text-gray-400 hover:text-ink-accent transition-colors group">
                  <div className="p-2 border border-white/10 rounded-full group-hover:border-ink-accent transition-colors">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <span>FACEBOOK</span>
                </a>
             </div>

            {/* Map Container */}
            <div className="w-full h-64 rounded-xl border border-white/10 relative overflow-hidden group shadow-2xl">
               <iframe 
                 src="https://maps.google.com/maps?q=39%20King%20St%2C%20Hamilton%20HM%2019%2C%20Bermuda&t=&z=17&ie=UTF8&iwloc=&output=embed"
                 width="100%" 
                 height="100%" 
                 style={{ border: 0, filter: 'grayscale(100%) invert(10%) contrast(83%)' }} 
                 allowFullScreen 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
                 title="Studio Location"
                 className="opacity-70 group-hover:opacity-100 transition-opacity duration-500"
               />
               <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink-950/50 to-transparent"></div>
               
               <a 
                 href="https://www.google.com/maps/dir/?api=1&destination=39+King+St,+Hamilton+HM+19,+Bermuda"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-transform transform hover:-translate-y-1 hover:shadow-lg flex items-center space-x-2 z-10"
               >
                 <span>Get Directions</span>
                 <ExternalLink className="w-3 h-3" />
               </a>
            </div>

          </div>

          {/* Right Column: Form (Span 7) */}
          <div className="lg:col-span-7 animate-fade-in-right">
            <div className="bg-ink-900/30 p-8 md:p-12 rounded-2xl border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
             {/* Decorative Corner */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-ink-accent/5 to-transparent rounded-bl-[100px] pointer-events-none"></div>

             <div className="mb-10 relative z-10">
               <h2 className="text-3xl font-serif font-bold text-white mb-2">Send a Message</h2>
               <p className="text-gray-400">Fill out the form below and we will get back to you shortly.</p>
             </div>
             
             {submitted ? (
               <div className="h-[400px] flex flex-col items-center justify-center text-center animate-fade-in">
                 <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                   <Send className="w-10 h-10" />
                 </div>
                 <h3 className="text-3xl font-serif font-bold text-white mb-3">Message Sent</h3>
                 <p className="text-gray-400 mb-8 max-w-sm">Thank you for reaching out. We've received your message and will respond within 24 hours.</p>
                 <button 
                   onClick={() => setSubmitted(false)} 
                   className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-lg text-sm uppercase tracking-widest transition-all"
                 >
                   Send another message
                 </button>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name Field */}
                    <div className="relative">
                      <label 
                        className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                          focusedField === 'name' || formData.name ? '-top-6 text-xs text-ink-accent font-bold tracking-widest' : 'top-2 text-gray-500'
                        }`}
                      >
                        NAME
                      </label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-ink-accent outline-none transition-colors placeholder-transparent"
                        placeholder="Name"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="relative">
                       <label 
                        className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                          focusedField === 'email' || formData.email ? '-top-6 text-xs text-ink-accent font-bold tracking-widest' : 'top-2 text-gray-500'
                        }`}
                      >
                        EMAIL
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-ink-accent outline-none transition-colors placeholder-transparent"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  
                  {/* Subject Field */}
                  <div className="relative">
                    <label 
                      className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                        focusedField === 'subject' || formData.subject ? '-top-6 text-xs text-ink-accent font-bold tracking-widest' : 'top-2 text-gray-500'
                      }`}
                    >
                      SUBJECT
                    </label>
                     <input 
                        type="text" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('subject')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-ink-accent outline-none transition-colors placeholder-transparent"
                        placeholder="Subject"
                      />
                  </div>

                  {/* Message Field */}
                  <div className="relative">
                    <label 
                      className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                        focusedField === 'message' || formData.message ? '-top-6 text-xs text-ink-accent font-bold tracking-widest' : 'top-2 text-gray-500'
                      }`}
                    >
                      MESSAGE
                    </label>
                    <textarea 
                       name="message"
                       value={formData.message}
                       onChange={handleChange}
                       onFocus={() => setFocusedField('message')}
                       onBlur={() => setFocusedField(null)}
                       required
                       rows={4}
                       className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-ink-accent outline-none transition-colors resize-none placeholder-transparent"
                       placeholder="Message"
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#F2D06B] hover:from-[#C5A028] hover:to-[#E1BF5B] text-black font-black tracking-widest uppercase rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2 group"
                    >
                      <span>Send Message</span>
                      <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
               </form>
             )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;