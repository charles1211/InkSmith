'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookingFormData } from '../../types';
import { 
  Upload, 
  CheckCircle, 
  Info, 
  User, 
  Mail, 
  Smartphone, 
  Calendar, 
  FileText, 
  Palette, 
  MapPin, 
  ChevronDown,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Clock,
  PenTool,
  AlertCircle,
  ArrowRight,
  X,
  ScrollText,
  Check
} from 'lucide-react';

const Booking: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const initialFormData: BookingFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ageVerification: '',
    services: [],
    tattooStyle: '',
    tattooStyleOther: '',
    piercingPlacement: '',
    piercingPlacementOther: '',
    artistId: '',
    description: '',
    preferredDate: '',
    referenceFile: null
  };

  const [formData, setFormData] = useState<BookingFormData>(initialFormData);

  const [showReview, setShowReview] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [showReadBefore, setShowReadBefore] = useState(false);
  const [errors, setErrors] = useState<{age?: string; services?: string}>({});

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tattooStyleOptions = [
    "Black/Grey", "Colored", "UV Tattoo", "Others"
  ];

  const piercingPlacementOptions = [
    "Ear (Earlobe)",
    "Ear (Flat)",
    "Ear (Helix)",
    "Ear (Tragus)",
    "Ear (Industrial)",
    "Eyebrow",
    "Lips (Labret)",
    "Nose (Nostril)",
    "Nose (Septum)",
    "Tongue",
    "Belly",
    "Piercing Change/Removal",
    "Nipple",
    "Dermal",
    "Smiley",
    "Snakebite",
    "Christina",
    "Clit",
    "Others"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleService = (service: string) => {
    setFormData(prev => {
      const services = prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service];
      
      // Clear error if selection is made
      if (services.length > 0) {
         setErrors(curr => ({ ...curr, services: undefined }));
      }
      return { ...prev, services };
    });
  };

  const setAgeVerification = (value: 'yes' | 'guardian') => {
    setFormData(prev => ({ ...prev, ageVerification: value }));
    setErrors(curr => ({ ...curr, age: undefined }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, referenceFile: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom Validation for non-native inputs
    const newErrors: {age?: string; services?: string} = {};
    let isValid = true;

    if (!formData.ageVerification) {
      newErrors.age = "Please verify your age requirement.";
      isValid = false;
    }

    if (formData.services.length === 0) {
      newErrors.services = "Please select at least one service.";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      const formElement = document.getElementById('booking-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
         window.scrollTo(0, 0);
      }
      return;
    }

    setShowReview(true);
  };

  const handleFinalSubmit = () => {
    setLoading(true);
    // Simulate API submission
    setTimeout(() => {
      console.log('Form Submitted:', formData);
      setLoading(false);
      setShowReview(false);
      setShowConfirmation(true);
    }, 1500);
  };

  const handleBookAnother = () => {
    setFormData(initialFormData);
    setShowConfirmation(false);
    window.scrollTo(0, 0);
  };

  const getArtistName = (id: string) => {
    const artists: Record<string, string> = {
      'romark': 'ROMARK',
      'viper': 'ELENA "VIPER" ROSSI',
      'kenji': 'KENJI SATO',
      'sarah': 'SARAH JENKINS'
    };
    return artists[id] || 'Any Available Artist';
  };

  const showStyle = formData.services.includes('Tattoo');
  const showArtist = formData.services.some(s => ['Tattoo', 'Piercing', 'Consultation'].includes(s));

  return (
    <div ref={topRef} className="min-h-screen bg-ink-950 text-white pt-24 pb-32 relative selection:bg-ink-accent selection:text-black">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ink-accent/5 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[120px] opacity-50" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="mb-16 text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-full animate-fade-in backdrop-blur-sm">
            <Calendar className="w-6 h-6 text-ink-accent" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-white tracking-tight uppercase animate-fade-in-up">
            Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-accent to-yellow-600">Session</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg font-light animate-fade-in delay-100">
            Begin your journey. Tell us your vision, and we'll match you with the perfect artist to bring it to life.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
          <button 
            type="button"
            onClick={() => setShowPolicies(true)}
            className="group flex items-center justify-between px-6 py-4 bg-ink-900/50 border border-white/10 hover:border-ink-accent/50 rounded-lg transition-all duration-300 hover:bg-ink-900 hover:shadow-lg hover:shadow-ink-accent/10 cursor-pointer text-left"
          >
            <div className="flex items-center space-x-3">
              <ScrollText className="w-5 h-5 text-gray-400 group-hover:text-ink-accent transition-colors" />
              <span className="text-sm font-bold tracking-widest uppercase text-gray-300 group-hover:text-white">View Policies</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-ink-accent group-hover:translate-x-1 transition-all" />
          </button>
           <button 
            type="button"
            onClick={() => setShowReadBefore(true)}
            className="group flex items-center justify-between px-6 py-4 bg-ink-900/50 border border-white/10 hover:border-ink-accent/50 rounded-lg transition-all duration-300 hover:bg-ink-900 hover:shadow-lg hover:shadow-ink-accent/10 cursor-pointer text-left"
          >
            <div className="flex items-center space-x-3">
              <ShieldAlert className="w-5 h-5 text-gray-400 group-hover:text-ink-accent transition-colors" />
              <span className="text-sm font-bold tracking-widest uppercase text-gray-300 group-hover:text-white">Read Before Booking</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-ink-accent group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        <form id="booking-form" onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up delay-200">
          
          {/* Section 1: Personal Details */}
          <div className="bg-ink-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="bg-white/5 px-8 py-6 border-b border-white/5 flex items-center">
              <User className="w-5 h-5 text-ink-accent mr-3" />
              <h3 className="text-lg font-bold text-white uppercase tracking-widest">Client Details</h3>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* First Name */}
                <div className="relative group">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block group-focus-within:text-ink-accent transition-colors">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-ink-950/50 border-b-2 border-white/10 py-3 px-4 text-white focus:border-ink-accent focus:bg-ink-950/80 outline-none transition-all placeholder-gray-700 rounded-t-lg"
                    placeholder="Enter your first name"
                  />
                </div>
                 {/* Last Name */}
                 <div className="relative group">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block group-focus-within:text-ink-accent transition-colors">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-ink-950/50 border-b-2 border-white/10 py-3 px-4 text-white focus:border-ink-accent focus:bg-ink-950/80 outline-none transition-all placeholder-gray-700 rounded-t-lg"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email */}
                <div className="relative group">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block group-focus-within:text-ink-accent transition-colors">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-3 w-5 h-5 text-gray-600 group-focus-within:text-ink-accent transition-colors" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-ink-950/50 border-b-2 border-white/10 py-3 px-4 pr-12 text-white focus:border-ink-accent focus:bg-ink-950/80 outline-none transition-all placeholder-gray-700 rounded-t-lg"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
                 {/* Phone */}
                 <div className="relative group">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block group-focus-within:text-ink-accent transition-colors">Phone Number</label>
                   <div className="relative">
                    <Smartphone className="absolute right-4 top-3 w-5 h-5 text-gray-600 group-focus-within:text-ink-accent transition-colors" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-ink-950/50 border-b-2 border-white/10 py-3 px-4 pr-12 text-white focus:border-ink-accent focus:bg-ink-950/80 outline-none transition-all placeholder-gray-700 rounded-t-lg"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Age Verification */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">Age Verification</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAgeVerification('yes')}
                    className={`relative p-4 rounded-lg border-2 text-left transition-all duration-300 flex items-center group ${
                      formData.ageVerification === 'yes'
                        ? 'bg-ink-accent/10 border-ink-accent shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                        : 'bg-ink-950/30 border-white/5 hover:border-white/20 hover:bg-ink-950/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${formData.ageVerification === 'yes' ? 'border-ink-accent' : 'border-gray-500 group-hover:border-gray-400'}`}>
                      {formData.ageVerification === 'yes' && <div className="w-2.5 h-2.5 rounded-full bg-ink-accent" />}
                    </div>
                    <span className={`font-medium ${formData.ageVerification === 'yes' ? 'text-white' : 'text-gray-400'}`}>I am 18 or older</span>
                  </button>

                   <button
                    type="button"
                    onClick={() => setAgeVerification('guardian')}
                    className={`relative p-4 rounded-lg border-2 text-left transition-all duration-300 flex items-center group ${
                      formData.ageVerification === 'guardian'
                        ? 'bg-ink-accent/10 border-ink-accent shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                        : 'bg-ink-950/30 border-white/5 hover:border-white/20 hover:bg-ink-950/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${formData.ageVerification === 'guardian' ? 'border-ink-accent' : 'border-gray-500 group-hover:border-gray-400'}`}>
                      {formData.ageVerification === 'guardian' && <div className="w-2.5 h-2.5 rounded-full bg-ink-accent" />}
                    </div>
                    <span className={`font-medium ${formData.ageVerification === 'guardian' ? 'text-white' : 'text-gray-400'}`}>Under 18 (with Guardian)</span>
                  </button>
                </div>
                {errors.age && (
                  <p className="text-red-500 text-xs font-bold mt-2 flex items-center animate-fade-in">
                    <AlertCircle className="w-3 h-3 mr-1"/> {errors.age}
                  </p>
                )}
                 {formData.ageVerification === 'guardian' && (
                  <div className="mt-4 flex items-start gap-3 text-sm text-yellow-500 bg-yellow-500/5 p-4 rounded-lg border border-yellow-500/20">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>Parent/Guardian must be present with valid ID for both parties. No exceptions.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Project Info */}
          <div className="bg-ink-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="bg-white/5 px-8 py-6 border-b border-white/5 flex items-center">
              <Sparkles className="w-5 h-5 text-ink-accent mr-3" />
              <h3 className="text-lg font-bold text-white uppercase tracking-widest">Project Vision</h3>
            </div>
            
            <div className="p-8 space-y-10">
              
              {/* Service Type */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">Service Type (Select all that apply)</label>
                <div className="flex flex-wrap gap-3">
                  {['Tattoo', 'Piercing', 'Consultation'].map((service) => (
                    <button
                      type="button"
                      key={service}
                      onClick={() => toggleService(service)}
                      className={`px-6 py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 border ${
                        formData.services.includes(service)
                          ? 'bg-ink-accent text-ink-950 border-ink-accent shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                          : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
                {errors.services && (
                  <p className="text-red-500 text-xs font-bold mt-2 flex items-center animate-fade-in">
                    <AlertCircle className="w-3 h-3 mr-1"/> {errors.services}
                  </p>
                )}
              </div>

              <div className="h-px bg-white/5 w-full"></div>

              {/* Style and Artist Selection */}
              {(showStyle || showArtist) && (
                 <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                     {/* Style: Only show for Tattoo */}
                     {showStyle && (
                       <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">Preferred Style</label>
                          <div className="relative">
                            <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" />
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
                            <select
                              name="tattooStyle"
                              value={formData.tattooStyle}
                              onChange={handleInputChange}
                              required
                              className="w-full bg-ink-950 border border-white/10 rounded-lg py-4 pl-12 pr-10 text-white focus:border-ink-accent outline-none appearance-none cursor-pointer hover:border-white/30 transition-all"
                            >
                              <option value="">Select a style...</option>
                              {tattooStyleOptions.map(style => (
                                <option key={style} value={style}>{style}</option>
                              ))}
                            </select>
                          </div>
                           {formData.tattooStyle === 'Others' && (
                              <input
                                type="text"
                                name="tattooStyleOther"
                                value={formData.tattooStyleOther}
                                onChange={handleInputChange}
                                placeholder="Describe style..."
                                className="mt-3 w-full bg-ink-950/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-ink-accent outline-none animate-fade-in text-sm"
                              />
                          )}
                       </div>
                     )}

                     {/* Artist: Show for Tattoo, Piercing, Consultation */}
                     {showArtist && (
                       <div className={!showStyle ? "md:col-span-2" : ""}>
                          <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">Preferred Artist</label>
                          <div className="relative">
                             <PenTool className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" />
                             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
                             <select
                              name="artistId"
                              value={formData.artistId}
                              onChange={handleInputChange}
                              className="w-full bg-ink-950 border border-white/10 rounded-lg py-4 pl-12 pr-10 text-white focus:border-ink-accent outline-none appearance-none cursor-pointer hover:border-white/30 transition-all"
                            >
                              <option value="">Any Available Artist</option>
                              <option value="romark">ROMARK</option>
                              <option value="viper">ELENA "VIPER" ROSSI</option>
                              <option value="kenji">KENJI SATO</option>
                              <option value="sarah">SARAH JENKINS</option>
                            </select>
                          </div>
                       </div>
                     )}
                  </div>
              )}

              {/* Conditional: Piercing Placement */}
              {formData.services.includes('Piercing') && (
                <div className="animate-fade-in">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">Piercing Placement</label>
                   <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" />
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
                      <select
                        name="piercingPlacement"
                        value={formData.piercingPlacement}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-ink-950 border border-white/10 rounded-lg py-4 pl-12 pr-10 text-white focus:border-ink-accent outline-none appearance-none cursor-pointer hover:border-white/30 transition-all"
                      >
                        <option value="">Select Placement...</option>
                        {piercingPlacementOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                     {formData.piercingPlacement === 'Others' && (
                        <input
                          type="text"
                          name="piercingPlacementOther"
                          value={formData.piercingPlacementOther}
                          onChange={handleInputChange}
                          placeholder="Describe placement..."
                          className="mt-3 w-full bg-ink-950/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-ink-accent outline-none animate-fade-in text-sm"
                        />
                    )}
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">Concept Details</label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-500 group-focus-within:text-ink-accent transition-colors" />
                  <textarea
                    name="description"
                    rows={5}
                    required
                    placeholder="Describe your idea in detail. Include size estimates (inches/cm), placement on body, color vs black & grey, and any specific elements you want included..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-ink-950/50 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white focus:border-ink-accent outline-none transition-all resize-none placeholder-gray-600 leading-relaxed"
                  />
                </div>
              </div>

              {/* File Upload */}
              <div>
                 <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">Reference Images</label>
                 <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${
                    formData.referenceFile 
                      ? 'border-ink-accent bg-ink-accent/5' 
                      : 'border-white/10 hover:border-ink-accent/50 bg-ink-950/30 hover:bg-ink-950/50'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                  />
                  <div className="flex flex-col items-center justify-center space-y-4">
                     <div className={`p-4 rounded-full transition-colors ${formData.referenceFile ? 'bg-ink-accent text-black' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                        <Upload className="w-8 h-8" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-white mb-1">
                          {formData.referenceFile ? formData.referenceFile.name : "Click to Upload Reference"}
                        </p>
                        {!formData.referenceFile && (
                          <p className="text-xs text-gray-500 group-hover:text-gray-400">JPG, PNG, PDF (Max 15MB)</p>
                        )}
                     </div>
                  </div>
                </div>
              </div>

               {/* Date & Time */}
               <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">Preferred Availability</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-ink-accent transition-colors z-10 pointer-events-none" />
                    <input
                      type="datetime-local"
                      name="preferredDate"
                      required
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      className="w-full bg-ink-950/50 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white focus:border-ink-accent outline-none transition-all [color-scheme:dark] placeholder-gray-600 cursor-pointer hover:border-white/30"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">* This is a preference only. Final time will be confirmed by the artist.</p>
                </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-[#D4AF37] to-[#F2D06B] hover:from-[#C5A028] hover:to-[#E1BF5B] text-black font-black tracking-[0.2em] text-lg rounded-sm transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center">
                SUBMIT REQUEST <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <p className="text-center text-gray-500 text-xs mt-6">
              By submitting this form, you agree to our policies regarding deposits and cancellations.
            </p>
          </div>

        </form>
      </div>

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-ink-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-white/5 bg-ink-950/50 flex justify-between items-center">
                  <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider">Review Request</h3>
                  <button onClick={() => setShowReview(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6"/></button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar">
                  <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Client Details</p>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                            <p className="text-white font-bold">{formData.firstName} {formData.lastName}</p>
                            <p className="text-gray-400 text-sm">{formData.email}</p>
                            <p className="text-gray-400 text-sm">{formData.phone}</p>
                            <p className="text-gray-400 text-xs mt-2 flex items-center">
                              {formData.ageVerification === 'yes' ? <CheckCircle className="w-3 h-3 text-green-500 mr-2"/> : <AlertCircle className="w-3 h-3 text-yellow-500 mr-2"/>}
                              {formData.ageVerification === 'yes' ? '18+ Verified' : 'Guardian Required'}
                            </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Project Details</p>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/5 space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400 text-sm">Service</span>
                              <span className="text-white text-sm font-medium text-right">{formData.services.join(', ') || '-'}</span>
                            </div>
                            {(formData.services.includes('Tattoo') && formData.tattooStyle) && (
                              <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Style</span>
                                <span className="text-white text-sm font-medium text-right">{formData.tattooStyle === 'Others' ? formData.tattooStyleOther : formData.tattooStyle}</span>
                              </div>
                            )}
                            {(formData.services.includes('Piercing') && formData.piercingPlacement) && (
                              <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Placement</span>
                                <span className="text-white text-sm font-medium text-right">{formData.piercingPlacement === 'Others' ? formData.piercingPlacementOther : formData.piercingPlacement}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-400 text-sm">Artist Preference</span>
                              <span className="text-white text-sm font-medium text-right">{getArtistName(formData.artistId)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400 text-sm">Requested Date</span>
                              <span className="text-white text-sm font-medium text-right">{formData.preferredDate ? new Date(formData.preferredDate).toLocaleString() : 'Flexible'}</span>
                            </div>
                        </div>
                      </div>

                      {formData.description && (
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Concept</p>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                                <p className="text-gray-300 text-sm italic">"{formData.description}"</p>
                            </div>
                          </div>
                      )}
                  </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-ink-950/50 flex gap-3">
                  <button 
                      onClick={() => setShowReview(false)}
                      disabled={loading}
                      className="flex-1 py-3 px-4 border border-white/10 hover:bg-white/5 text-gray-300 font-bold uppercase tracking-widest text-xs rounded-lg transition-colors"
                  >
                      Edit Details
                  </button>
                  <button 
                      onClick={handleFinalSubmit}
                      disabled={loading}
                      className="flex-1 py-3 px-4 bg-ink-accent hover:bg-white text-ink-950 font-bold uppercase tracking-widest text-xs rounded-lg shadow-lg hover:shadow-ink-accent/20 transition-all flex items-center justify-center"
                  >
                      {loading ? <span className="animate-pulse">Processing...</span> : <span>Confirm Booking</span>}
                  </button>
              </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-ink-900 border border-ink-accent/20 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col">
             
             {/* Modal Decoration */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ink-accent to-transparent"></div>
             
             {/* Modal Header */}
             <div className="p-8 pb-0 text-center relative z-10">
               <div className="w-20 h-20 bg-gradient-to-br from-ink-accent/20 to-ink-950 border border-ink-accent/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                 <CheckCircle className="w-10 h-10 text-ink-accent" />
               </div>
               <h2 className="text-3xl font-serif font-bold text-white mb-2">Request Received</h2>
               <p className="text-gray-400 text-sm">Your booking request has been submitted successfully.</p>
             </div>

             {/* Booking Summary Card */}
             <div className="p-6 md:p-8">
               <div className="bg-ink-950/50 border border-white/5 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-start border-b border-white/5 pb-4">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Client</p>
                      <p className="text-white font-serif text-lg">{formData.firstName} {formData.lastName}</p>
                      <p className="text-gray-400 text-sm">{formData.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Service</p>
                       <div className="flex flex-wrap gap-1">
                          {formData.services.length > 0 ? (
                            formData.services.map(s => (
                              <span key={s} className="text-white text-sm bg-white/5 px-2 py-0.5 rounded">{s}</span>
                            ))
                          ) : (
                            <span className="text-white text-sm">-</span>
                          )}
                       </div>
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Artist</p>
                        <p className="text-white text-sm">{getArtistName(formData.artistId)}</p>
                     </div>
                  </div>

                  <div className="pt-2">
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Availability</p>
                     <p className="text-white text-sm">
                       {formData.preferredDate ? new Date(formData.preferredDate).toLocaleString() : 'Not specified'}
                     </p>
                  </div>
               </div>

               <div className="mt-4 flex items-start gap-3 p-3 bg-ink-accent/5 rounded-lg border border-ink-accent/10">
                 <Info className="w-5 h-5 text-ink-accent shrink-0 mt-0.5" />
                 <p className="text-xs text-gray-400">
                   Our team will review your request and contact you at <span className="text-white font-bold">{formData.email}</span> within 24-48 hours to confirm availability and deposit details.
                 </p>
               </div>
             </div>

             {/* Modal Actions */}
             <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
               <button 
                 onClick={() => router.push('/')}
                 className="flex-1 py-3 px-4 border border-white/10 hover:border-white/30 rounded-lg text-sm font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 transition-all"
               >
                 Return Home
               </button>
               <button 
                 onClick={handleBookAnother}
                 className="flex-1 py-3 px-4 bg-ink-accent hover:bg-white text-ink-950 font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg hover:shadow-ink-accent/20"
               >
                 Book Another
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Policies Modal */}
      {showPolicies && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-ink-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-ink-950/50">
               <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider flex items-center">
                 <Info className="w-5 h-5 mr-3 text-ink-accent" /> Studio Policies
               </h3>
               <button 
                onClick={() => setShowPolicies(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto space-y-6 text-sm text-gray-300 leading-relaxed custom-scrollbar">
              <ul className="list-disc pl-5 space-y-4">
                <li>
                  All clients must read and sign our 'Client Information and Consent Form' and other necessary documents needed before each session and shall present a <strong className="text-white">VALID ID</strong> with Date of Birth.
                </li>
                <li>
                  All clients <strong className="text-white">UNDER 18 YEARS OLD</strong> must be accompanied by a parent/legal guardian during the appointment. Both shall present a valid ID.
                </li>
                <li>
                  The studio reserves the right to <strong className="text-white">REFUSE</strong> clients that are: under the influence of alcohol and/or drugs, have complex health conditions, and such conditions that shows unfit to undergo a session.
                </li>
                <li>
                  The studio offers <strong className="text-white">FREE CONSULTATION</strong> to clients. And if the client decides to request a custom design and/or secure a slot, a <strong className="text-white">DEPOSIT</strong> must be paid. If a quoted price is given by the artist, the client shall understand that it is just an estimate and is still subject to change at the end of the session.
                </li>
                <li>
                  The studio will <strong className="text-white">NOT</strong> send electronic copies to preview the custom design, thus, must only be viewed in the studio. Necessary revisions that stay within the idea discussed during the consultation can be made on the day of your appointment.
                </li>
                <li>
                  For <strong className="text-white">COVER-UP</strong> projects, the client may submit a design but shall understand that it may require certain tweaks/suggestions from the artist to properly cover-up the tattoo.
                </li>
                <li>
                  For <strong className="text-white">valid reasons and situations</strong>, the client may request a <strong className="text-white">TOUCH-UP</strong> if the artist sees the need to do so and if it's still within <strong className="text-white">2 weeks</strong> after the session. Outside this period, the client shall be charged based on a regular tattoo pricing. Touch-ups can only be done if the tattoo is fully healed.
                </li>
                <li>
                  We accept special appointments on schedules beyond our studio hours but will require a deposit to secure the slot.
                </li>
                <li>
                  The deposit shall be deducted on your final receipt unless forfeited. Deposit is <strong className="text-white">NON-REFUNDABLE</strong> and <strong className="text-white">NON-TRANSFERRABLE</strong>. Deposits shall be <strong className="text-white">forfeited</strong> in any of the following reasons: major change/s to the design discussed, no-show on the booked appointment, fail to cancel/rebook the appointment 48 hours prior, reschedule more than twice and still fail to show up on time of the appointment, fail to book/rebook within within ninety (90) days).
                </li>
                <li>
                  If the client is at least 15 minutes late from the appointment, the studio holds the right to accept other clients.
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-ink-950/50 flex justify-end">
              <button 
                onClick={() => setShowPolicies(false)}
                className="px-6 py-3 bg-white text-ink-950 font-bold uppercase text-xs tracking-widest hover:bg-ink-accent transition-colors rounded-sm"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Read Before Modal */}
      {showReadBefore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-ink-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-ink-950/50">
               <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider flex items-center">
                 <ShieldAlert className="w-5 h-5 mr-3 text-ink-accent" /> Read Before You Get Inked
               </h3>
               <button 
                onClick={() => setShowReadBefore(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto space-y-8 text-sm text-gray-300 leading-relaxed custom-scrollbar">
              
              {/* Do's */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-ink-accent uppercase tracking-widest border-b border-white/10 pb-2">Preparation Checklist</h4>
                <ol className="list-decimal pl-5 space-y-4 marker:text-ink-accent marker:font-bold">
                  <li>
                    <strong className="text-white block mb-1">Get enough sleep.</strong>
                    The last thing you want is to come in and be completely exhausted for your tattoo session. It is important to be well-rested so that you can be alert and in-tune with your body.
                  </li>
                  <li>
                    <strong className="text-white block mb-1">Stay hydrated.</strong>
                    Hydrated skin takes ink a lot better which will make the entire process a lot smoother for your artist. If you didn't have a chance to drink a good amount of water before your appointment, we recommend keeping a water bottle with you during your session.
                  </li>
                  <li>
                    <strong className="text-white block mb-1">What to wear?</strong>
                    You want to be as comfortable as possible during your tattoo so we recommend choosing a loose outfit. Tight clothes, especially near the area you want to place the tattoo, may affect the blood flow.
                  </li>
                  <li>
                    <strong className="text-white block mb-1">Be punctual.</strong>
                    The studio holds the right to take other clients if you are at least 15 minutes late from your appointment.
                  </li>
                </ol>
              </div>

              {/* Don'ts */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-red-500 uppercase tracking-widest border-b border-red-500/20 pb-2 flex items-center">
                  <span className="mr-2">DON'TS</span>
                </h4>
                <ol className="list-decimal pl-5 space-y-4 marker:text-red-500 marker:font-bold">
                  <li>
                    <strong className="text-white block mb-1">Alcohol and drugs.</strong>
                    We will not allow if you show up under the influence of alcohol or drugs. It thins your blood and puts you in danger for various complications. You should also avoid aspirin as it may also result to the same harm.
                  </li>
                  <li>
                    <strong className="text-white block mb-1">Intensive exercise.</strong>
                    Avoid activities that drain your muscles and make you super sore. Anything that strains your muscles will make your tattoo process a lot more painful as your muscles will already be aching.
                  </li>
                  <li>
                    <strong className="text-white block mb-1">Damaged skin.</strong>
                    It is important that the skin area will be clean and safe to undergo a tattoo session. If you have any skin conditions like eczema, keloids, rash and the like, we recommend consulting your doctor before the session.
                  </li>
                  <li>
                    <strong className="text-white block mb-1">Shave.</strong>
                    Do not shave the skin area on your own. The artist will do the shaving at the start of the session as there is a right way of doing it without damaging the skin.
                  </li>
                </ol>
              </div>

              {/* Footer Note */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-ink-accent mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-400 italic">
                  Client under 18 years old should be accompanied by a parent/legal guardian during the session. Valid ID with date of birth should be presented.
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-ink-950/50 flex justify-end">
              <button 
                onClick={() => setShowReadBefore(false)}
                className="px-6 py-3 bg-white text-ink-950 font-bold uppercase text-xs tracking-widest hover:bg-ink-accent transition-colors rounded-sm"
              >
                I'm Ready
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;