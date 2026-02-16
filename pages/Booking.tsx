import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookingFormData } from '../types';
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
  ScrollText
} from 'lucide-react';

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<BookingFormData>({
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
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [showReadBefore, setShowReadBefore] = useState(false);

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
      return { ...prev, services };
    });
  };

  const setAgeVerification = (value: 'yes' | 'guardian') => {
    setFormData(prev => ({ ...prev, ageVerification: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, referenceFile: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API submission
    setTimeout(() => {
      console.log('Form Submitted:', formData);
      setLoading(false);
      setSubmitted(true);
      window.scrollTo(0, 0);
    }, 1500);
  };

  const showStyle = formData.services.includes('Tattoo');
  const showArtist = formData.services.some(s => ['Tattoo', 'Piercing', 'Consultation'].includes(s));

  if (submitted) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 pt-20">
        <div className="bg-ink-900/50 border border-ink-accent/20 p-12 rounded-2xl max-w-lg w-full text-center animate-fade-in shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-ink-accent/5 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-green-900/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h2 className="text-4xl font-serif font-bold text-white mb-4">Request Received</h2>
            <div className="h-1 w-20 bg-ink-accent mx-auto mb-6 rounded-full" />

            <p className="text-gray-300 mb-8 leading-relaxed text-lg font-light">
              Thank you, <span className="text-white font-semibold">{formData.firstName}</span>.
              <br />We have received your booking details.
            </p>

            <div className="bg-black/30 rounded-lg p-6 mb-8 text-sm text-gray-400 border border-white/5">
              <p>Our team will review your concept and schedule availability. Expect a confirmation email at <span className="text-ink-accent">{formData.email}</span> within 24-48 hours.</p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full py-4 bg-white text-ink-950 font-bold tracking-[0.2em] hover:bg-ink-accent hover:text-black transition-all duration-300 rounded-sm uppercase text-xs"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up delay-200">

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
                    className={`relative p-4 rounded-lg border-2 text-left transition-all duration-300 flex items-center group ${formData.ageVerification === 'yes'
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
                    className={`relative p-4 rounded-lg border-2 text-left transition-all duration-300 flex items-center group ${formData.ageVerification === 'guardian'
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
                      className={`px-6 py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 border ${formData.services.includes(service)
                          ? 'bg-ink-accent text-ink-950 border-ink-accent shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                          : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                        }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
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
                  className={`group relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${formData.referenceFile
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
                {loading ? (
                  <span className="flex items-center">PROCESSING <span className="animate-pulse ml-1">...</span></span>
                ) : (
                  <>
                    SUBMIT REQUEST <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <p className="text-center text-gray-500 text-xs mt-6">
              By submitting this form, you agree to our policies regarding deposits and cancellations.
            </p>
          </div>

        </form>
      </div>

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