'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookingFormData } from '../../types';
import { createClient } from '../../lib/supabase/client';
import {
  Upload,
  CheckCircle,
  Info,
  User,
  Mail,
  Smartphone,
  FileText,
  Palette,
  MapPin,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  Clock,
  PenTool,
  AlertCircle,
  ArrowRight,
  X,
  ScrollText,
  Check,
  ChevronLeft,
  MessageSquare,
  Zap,
  ImageIcon,
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Personal', icon: User },
  { id: 2, label: 'Service', icon: Sparkles },
  { id: 3, label: 'Details', icon: FileText },
];

const SERVICE_OPTIONS = [
  { id: 'Tattoo', label: 'Tattoo', icon: PenTool, desc: 'Custom ink by our artists' },
  { id: 'Piercing', label: 'Piercing', icon: Zap, desc: 'Professional body piercing' },
  { id: 'Consultation', label: 'Consultation', icon: MessageSquare, desc: 'Free design consultation' },
];

const tattooStyleOptions = ['Black/Grey', 'Colored', 'UV Tattoo', 'Others'];

const piercingPlacementOptions = [
  'Ear (Earlobe)', 'Ear (Flat)', 'Ear (Helix)', 'Ear (Tragus)', 'Ear (Industrial)',
  'Eyebrow', 'Lips (Labret)', 'Nose (Nostril)', 'Nose (Septum)', 'Tongue',
  'Belly', 'Piercing Change/Removal', 'Nipple', 'Dermal', 'Smiley',
  'Snakebite', 'Christina', 'Clit', 'Others',
];

const inputBase =
  'w-full bg-ink-950/60 border border-white/10 rounded-xl py-3.5 px-4 text-white text-sm focus:border-ink-accent focus:bg-ink-950/90 outline-none transition-all duration-200 placeholder-gray-600';
const inputWithIcon = `${inputBase} pl-11`;

const Field = ({ label, optional, error, children }: { label: string; optional?: boolean; error?: string; children: React.ReactNode }) => (
  <div className="group">
    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-ink-accent transition-colors duration-200">
      {label}
      {optional && <span className="text-gray-600 font-normal normal-case tracking-normal ml-1">(optional)</span>}
    </label>
    {children}
    {error && (
      <p className="text-red-400 text-[11px] font-bold mt-1.5 flex items-center gap-1">
        <AlertCircle className="w-3 h-3 shrink-0" /> {error}
      </p>
    )}
  </div>
);

const Booking: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [artists, setArtists] = useState<{ id: string; name: string }[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [showReadBefore, setShowReadBefore] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string; lastName?: string; email?: string; phone?: string;
    age?: string; services?: string; tattooStyle?: string; piercingPlacement?: string;
    description?: string; referenceFile?: string; preferredDate?: string;
  }>({});

  const initialFormData: BookingFormData = {
    firstName: '', lastName: '', email: '', phone: '',
    ageVerification: '', services: [], tattooStyle: '',
    tattooStyleOther: '', piercingPlacement: '', piercingPlacementOther: '',
    artistId: '', description: '', preferredDate: '', referenceFile: null,
  };
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('artists').select('id, name').order('name').then(({ data }) => {
      if (data) setArtists(data);
    });
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(curr => ({ ...curr, [name]: undefined }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: digits ? `+63${digits}` : '' }));
    setErrors(curr => ({ ...curr, phone: undefined }));
  };

  const toggleService = (service: string) => {
    setFormData(prev => {
      const services = prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service];
      if (services.length > 0) setErrors(curr => ({ ...curr, services: undefined }));
      return { ...prev, services };
    });
  };

  const setAgeVerification = (value: 'yes' | 'guardian') => {
    setFormData(prev => ({ ...prev, ageVerification: value }));
    setErrors(curr => ({ ...curr, age: undefined }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({ ...prev, referenceFile: e.target.files![0] }));
      setErrors(curr => ({ ...curr, referenceFile: undefined }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: typeof errors = {};
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
      if (!formData.email.trim()) newErrors.email = 'Email address is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address.';
      const phoneDigits = formData.phone.replace('+63', '');
      if (!phoneDigits) newErrors.phone = 'Phone number is required.';
      else if (phoneDigits.length < 10) newErrors.phone = 'Phone number must be 10 digits.';
      if (!formData.ageVerification) newErrors.age = 'Please verify your age requirement.';
    }
    if (step === 2) {
      if (formData.services.length === 0) newErrors.services = 'Please select at least one service.';
      if (formData.services.includes('Tattoo') && !formData.tattooStyle) newErrors.tattooStyle = 'Please select a tattoo style.';
      if (formData.services.includes('Piercing') && !formData.piercingPlacement) newErrors.piercingPlacement = 'Please select a piercing placement.';
    }
    if (step === 3) {
      if (!formData.description.trim()) newErrors.description = 'Please describe your concept.';
      if (!formData.referenceFile) newErrors.referenceFile = 'Please upload a reference image.';
      if (!formData.preferredDate) newErrors.preferredDate = 'Please select a preferred date and time.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setCurrentStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    setShowReview(true);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      let referenceUrl: string | null = null;
      if (formData.referenceFile) {
        const supabase = createClient();
        const ext = formData.referenceFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('booking-references')
          .upload(fileName, formData.referenceFile, { upsert: true });
        if (!uploadError) {
          const { data } = supabase.storage.from('booking-references').getPublicUrl(fileName);
          referenceUrl = data.publicUrl;
        }
      }

      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName, lastName: formData.lastName,
          email: formData.email, phone: formData.phone,
          ageVerification: formData.ageVerification, services: formData.services,
          tattooStyle: formData.tattooStyle, tattooStyleOther: formData.tattooStyleOther,
          piercingPlacement: formData.piercingPlacement, piercingPlacementOther: formData.piercingPlacementOther,
          artistId: formData.artistId, artistName: getArtistName(formData.artistId),
          description: formData.description, preferredDate: formData.preferredDate, referenceUrl,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Booking submission failed');
      }

      setShowReview(false);
      setShowConfirmation(true);
    } catch (err) {
      console.error('Booking error:', err);
      alert('Something went wrong submitting your booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAnother = () => {
    setFormData(initialFormData);
    setShowConfirmation(false);
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };

  const getArtistName = (id: string) => artists.find(a => a.id === id)?.name || 'Any Available Artist';

  const showStyle = formData.services.includes('Tattoo');
  const showArtist = formData.services.some(s => ['Tattoo', 'Piercing', 'Consultation'].includes(s));

  // Progress bar width
  const progressPct = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-ink-950 text-white pt-20 pb-24 relative selection:bg-ink-accent selection:text-black">

      {/* Background glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-8%] right-[-4%] w-[600px] h-[600px] bg-ink-accent/4 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-8%] left-[-4%] w-[500px] h-[500px] bg-blue-950/20 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '36px 36px' }}
        />
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ink-accent/10 border border-ink-accent/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-accent animate-pulse" />
            <span className="text-ink-accent text-[10px] font-black uppercase tracking-[0.25em]">Book a Session</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-white tracking-tight uppercase leading-none mb-3">
            Begin Your<br /><span className="text-ink-accent">Journey</span>
          </h1>
          <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
            Tell us your vision and we&apos;ll match you with the perfect artist.
          </p>
        </div>

        {/* ── Info Buttons ──────────────────────────────────────── */}
        <div className="flex gap-3 mb-8">
          {[
            { label: 'Studio Policies', icon: ScrollText, onClick: () => setShowPolicies(true) },
            { label: 'Read Before Booking', icon: ShieldAlert, onClick: () => setShowReadBefore(true) },
          ].map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/3 border border-white/8 hover:border-ink-accent/30 hover:bg-white/6 rounded-xl transition-all duration-200 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-white group"
            >
              <Icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-ink-accent transition-colors" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Step Indicator ────────────────────────────────────── */}
        <div className="mb-8">
          <div className="relative flex items-start justify-between">
            {/* Track */}
            <div className="absolute left-4 right-4 top-4 h-px bg-white/[0.07]" />
            {/* Fill */}
            <div
              className="absolute top-4 left-4 h-px bg-ink-accent transition-all duration-500 ease-out"
              style={{ width: `calc(${progressPct}% - 0px)` }}
            />
            {STEPS.map(step => {
              const done = currentStep > step.id;
              const active = currentStep === step.id;
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    done
                      ? 'bg-ink-accent border-ink-accent'
                      : active
                        ? 'bg-ink-950 border-ink-accent shadow-[0_0_16px_rgba(212,175,55,0.35)]'
                        : 'bg-ink-950 border-white/10'
                  }`}>
                    {done
                      ? <Check className="w-3.5 h-3.5 text-black" />
                      : <Icon className={`w-3.5 h-3.5 ${active ? 'text-ink-accent' : 'text-gray-600'}`} />
                    }
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${active || done ? 'text-white' : 'text-gray-600'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Form ──────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit}>

          {/* Step 1 — Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-ink-900/50 border border-white/6 rounded-2xl overflow-hidden">
                <SectionHeader icon={User} title="Personal Details" sub="How should we identify you?" />
                <div className="p-6 space-y-5">

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="First Name" error={errors.firstName}>
                      <input
                        type="text" name="firstName" value={formData.firstName}
                        onChange={handleInputChange} className={`${inputBase} ${errors.firstName ? 'border-red-500/50' : ''}`}
                        placeholder="First name"
                      />
                    </Field>
                    <Field label="Last Name" error={errors.lastName}>
                      <input
                        type="text" name="lastName" value={formData.lastName}
                        onChange={handleInputChange} className={`${inputBase} ${errors.lastName ? 'border-red-500/50' : ''}`}
                        placeholder="Last name"
                      />
                    </Field>
                  </div>

                  <Field label="Email Address" error={errors.email}>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      <input
                        type="email" name="email" value={formData.email}
                        onChange={handleInputChange} className={`${inputWithIcon} ${errors.email ? 'border-red-500/50' : ''}`}
                        placeholder="name@example.com"
                      />
                    </div>
                  </Field>

                  <Field label="Phone Number" error={errors.phone}>
                    <div className="flex">
                      <span className="inline-flex items-center gap-1.5 px-3.5 bg-ink-900/80 border border-r-0 border-white/10 rounded-l-xl text-sm text-gray-300 font-bold whitespace-nowrap select-none">
                        🇵🇭 +63
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={formData.phone.startsWith('+63') ? formData.phone.slice(3) : formData.phone}
                        onChange={handlePhoneChange}
                        maxLength={10}
                        className={`${inputBase} rounded-l-none border-l-0 flex-1 ${errors.phone ? 'border-red-500/50' : ''}`}
                        placeholder="9XX XXX XXXX"
                      />
                    </div>
                  </Field>

                  {/* Age Verification */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                      Age Verification <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { value: 'yes', label: 'I am 18 or older', sub: 'Full access to all services' },
                        { value: 'guardian', label: 'Under 18', sub: 'Guardian must be present' },
                      ] as const).map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setAgeVerification(opt.value)}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                            formData.ageVerification === opt.value
                              ? 'bg-ink-accent/8 border-ink-accent'
                              : 'bg-ink-950/50 border-white/8 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              formData.ageVerification === opt.value ? 'border-ink-accent' : 'border-gray-600'
                            }`}>
                              {formData.ageVerification === opt.value && <div className="w-2 h-2 rounded-full bg-ink-accent" />}
                            </div>
                            <span className={`text-xs font-bold ${formData.ageVerification === opt.value ? 'text-white' : 'text-gray-400'}`}>{opt.label}</span>
                          </div>
                          <p className="text-[10px] text-gray-500 pl-6">{opt.sub}</p>
                        </button>
                      ))}
                    </div>
                    {errors.age && (
                      <p className="text-red-500 text-xs font-bold mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.age}
                      </p>
                    )}
                    {formData.ageVerification === 'guardian' && (
                      <div className="mt-3 flex items-start gap-2.5 p-3.5 bg-yellow-500/5 border border-yellow-500/15 rounded-xl">
                        <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-400/90">Parent/Guardian must be present with valid ID for both parties. No exceptions.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <PrimaryBtn onClick={handleNextStep} label="Continue to Service" />
            </div>
          )}

          {/* Step 2 — Service Selection */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-ink-900/50 border border-white/6 rounded-2xl overflow-hidden">
                <SectionHeader icon={Sparkles} title="Select Service" sub="Choose all that apply" />
                <div className="p-6 space-y-6">

                  {/* Service cards */}
                  <div>
                    <div className="grid grid-cols-3 gap-3">
                      {SERVICE_OPTIONS.map(({ id, label, icon: Icon, desc }) => {
                        const selected = formData.services.includes(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => toggleService(id)}
                            className={`relative p-4 rounded-xl border-2 text-center flex flex-col items-center gap-2 transition-all duration-200 ${
                              selected
                                ? 'bg-ink-accent/10 border-ink-accent shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                                : 'bg-ink-950/50 border-white/8 hover:border-white/20 hover:bg-ink-950/80'
                            }`}
                          >
                            {selected && (
                              <div className="absolute top-2 right-2 w-4 h-4 bg-ink-accent rounded-full flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-black" />
                              </div>
                            )}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selected ? 'bg-ink-accent/20' : 'bg-white/5'}`}>
                              <Icon className={`w-5 h-5 ${selected ? 'text-ink-accent' : 'text-gray-500'}`} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-wider ${selected ? 'text-white' : 'text-gray-400'}`}>{label}</span>
                            <span className="text-[9px] text-gray-500 leading-tight">{desc}</span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.services && (
                      <p className="text-red-500 text-xs font-bold mt-3 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.services}
                      </p>
                    )}
                  </div>

                  {/* Tattoo style */}
                  {showStyle && (
                    <div className="animate-fade-in space-y-4">
                      <Divider />
                      <Field label="Tattoo Style" error={errors.tattooStyle}>
                        <div className="relative">
                          <Palette className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
                          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
                          <select name="tattooStyle" value={formData.tattooStyle} onChange={handleInputChange} className={`${inputWithIcon} appearance-none pr-10 cursor-pointer ${errors.tattooStyle ? 'border-red-500/50' : ''}`}>
                            <option value="">Select a style...</option>
                            {tattooStyleOptions.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        {formData.tattooStyle === 'Others' && (
                          <input type="text" name="tattooStyleOther" value={formData.tattooStyleOther} onChange={handleInputChange} placeholder="Describe style..." className={`${inputBase} mt-3`} />
                        )}
                      </Field>
                    </div>
                  )}

                  {/* Piercing placement */}
                  {formData.services.includes('Piercing') && (
                    <div className="animate-fade-in space-y-4">
                      {!showStyle && <Divider />}
                      <Field label="Piercing Placement" error={errors.piercingPlacement}>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
                          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
                          <select name="piercingPlacement" value={formData.piercingPlacement} onChange={handleInputChange} className={`${inputWithIcon} appearance-none pr-10 cursor-pointer ${errors.piercingPlacement ? 'border-red-500/50' : ''}`}>
                            <option value="">Select placement...</option>
                            {piercingPlacementOptions.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {formData.piercingPlacement === 'Others' && (
                          <input type="text" name="piercingPlacementOther" value={formData.piercingPlacementOther} onChange={handleInputChange} placeholder="Describe placement..." className={`${inputBase} mt-3`} />
                        )}
                      </Field>
                    </div>
                  )}

                  {/* Preferred artist */}
                  {showArtist && (
                    <div className="animate-fade-in space-y-4">
                      <Divider />
                      <Field label="Preferred Artist">
                        <div className="relative">
                          <PenTool className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
                          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
                          <select name="artistId" value={formData.artistId} onChange={handleInputChange} className={`${inputWithIcon} appearance-none pr-10 cursor-pointer`}>
                            <option value="">Any Available Artist</option>
                            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                          </select>
                        </div>
                      </Field>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <BackBtn onClick={handlePrevStep} />
                <PrimaryBtn onClick={handleNextStep} label="Continue to Details" />
              </div>
            </div>
          )}

          {/* Step 3 — Project Details */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-ink-900/50 border border-white/6 rounded-2xl overflow-hidden">
                <SectionHeader icon={FileText} title="Project Details" sub="Tell us more about your vision" />
                <div className="p-6 space-y-6">

                  <Field label="Concept Description" error={errors.description}>
                    <textarea
                      name="description"
                      rows={5}
                      placeholder="Describe your idea — size, placement on body, colour vs black & grey, specific elements..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className={`${inputBase} resize-none leading-relaxed ${errors.description ? 'border-red-500/50' : ''}`}
                    />
                  </Field>

                  {/* File upload */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                      Reference Image
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                        formData.referenceFile
                          ? 'border-ink-accent/50 bg-ink-accent/4'
                          : errors.referenceFile
                            ? 'border-red-500/40 bg-red-500/5'
                            : 'border-white/10 hover:border-white/20 bg-ink-950/30 hover:bg-ink-950/50'
                      }`}
                    >
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
                      <div className="flex flex-col items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${formData.referenceFile ? 'bg-ink-accent text-black' : errors.referenceFile ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-gray-500'}`}>
                          {formData.referenceFile ? <Check className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white mb-0.5">
                            {formData.referenceFile ? formData.referenceFile.name : 'Upload Reference'}
                          </p>
                          {!formData.referenceFile && <p className="text-xs text-gray-500">JPG, PNG, PDF · Max 15MB</p>}
                        </div>
                        {formData.referenceFile && (
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); setFormData(prev => ({ ...prev, referenceFile: null })); setErrors(curr => ({ ...curr, referenceFile: undefined })); }}
                            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                          >
                            Remove file
                          </button>
                        )}
                      </div>
                    </div>
                    {errors.referenceFile && (
                      <p className="text-red-400 text-[11px] font-bold mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {errors.referenceFile}
                      </p>
                    )}
                  </div>

                  {/* Preferred date */}
                  <Field label="Preferred Date & Time" error={errors.preferredDate}>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
                      <input
                        type="datetime-local"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        className={`${inputWithIcon} scheme-dark cursor-pointer ${errors.preferredDate ? 'border-red-500/50' : ''}`}
                      />
                    </div>
                    <p className="text-[10px] text-gray-600 mt-1.5">Final appointment time will be confirmed by the studio.</p>
                  </Field>
                </div>
              </div>

              <div className="flex gap-3">
                <BackBtn onClick={handlePrevStep} />
                <button
                  type="submit"
                  className="flex-1 py-4 bg-ink-accent hover:bg-yellow-400 text-black font-black text-sm tracking-[0.2em] uppercase rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group shadow-[0_4px_24px_rgba(212,175,55,0.22)]"
                >
                  Review Request
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <p className="text-center text-gray-600 text-[10px] leading-relaxed">
                By submitting, you agree to our studio policies regarding deposits and cancellations.
              </p>
            </div>
          )}
        </form>
      </div>

      {/* ─── Review Modal ──────────────────────────────────────────── */}
      {showReview && (
        <Modal>
          <div className="bg-ink-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[92vh]">
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Review Booking</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Confirm your details before submitting</p>
              </div>
              <IconBtn onClick={() => setShowReview(false)}><X className="w-4 h-4" /></IconBtn>
            </div>

            <div className="p-5 overflow-y-auto space-y-3">
              <ReviewCard title="Client">
                <p className="text-white font-bold text-sm">{formData.firstName} {formData.lastName}</p>
                <p className="text-gray-400 text-xs">{formData.email} · {formData.phone}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-[10px] text-gray-500">{formData.ageVerification === 'yes' ? '18+ Verified' : 'Guardian Required'}</span>
                </div>
              </ReviewCard>

              <ReviewCard title="Booking">
                {[
                  { label: 'Service', value: formData.services.join(', ') || '-' },
                  showStyle && formData.tattooStyle ? { label: 'Style', value: formData.tattooStyle === 'Others' ? formData.tattooStyleOther : formData.tattooStyle } : null,
                  formData.services.includes('Piercing') && formData.piercingPlacement ? { label: 'Placement', value: formData.piercingPlacement === 'Others' ? formData.piercingPlacementOther : formData.piercingPlacement } : null,
                  { label: 'Artist', value: getArtistName(formData.artistId) },
                  { label: 'Date', value: formData.preferredDate ? new Date(formData.preferredDate).toLocaleString() : 'Flexible' },
                ].filter(Boolean).map((row, i) => row && (
                  <div key={i} className="flex justify-between items-start gap-4">
                    <span className="text-[10px] text-gray-500 shrink-0">{row.label}</span>
                    <span className="text-xs text-white text-right">{row.value || '-'}</span>
                  </div>
                ))}
              </ReviewCard>

              {formData.description && (
                <ReviewCard title="Concept">
                  <p className="text-xs text-gray-300 italic leading-relaxed">&ldquo;{formData.description}&rdquo;</p>
                </ReviewCard>
              )}

              {formData.referenceFile && (
                <div className="flex items-center gap-2.5 px-4 py-3 bg-ink-accent/5 border border-ink-accent/15 rounded-xl">
                  <ImageIcon className="w-4 h-4 text-ink-accent shrink-0" />
                  <span className="text-xs text-gray-300 truncate">{formData.referenceFile.name}</span>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-white/5 flex gap-3">
              <button
                onClick={() => setShowReview(false)}
                disabled={loading}
                className="px-5 py-3 border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all"
              >
                Edit
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-ink-accent hover:bg-yellow-400 disabled:opacity-60 text-black font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ─── Confirmation Modal ────────────────────────────────────── */}
      {showConfirmation && (
        <Modal>
          <div className="bg-ink-900 border border-ink-accent/15 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="h-px bg-linear-to-r from-transparent via-ink-accent to-transparent" />
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-ink-accent/10 border border-ink-accent/20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                <CheckCircle className="w-8 h-8 text-ink-accent" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white mb-1.5">Booking Received</h2>
              <p className="text-gray-400 text-sm mb-6">Your request has been submitted successfully.</p>

              <div className="bg-ink-950/60 border border-white/5 rounded-xl p-5 text-left space-y-3 mb-4">
                {[
                  { label: 'Client', value: `${formData.firstName} ${formData.lastName}` },
                  { label: 'Service', value: formData.services.join(', ') },
                  { label: 'Artist', value: getArtistName(formData.artistId) },
                ].map(row => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-[10px] text-gray-500">{row.label}</span>
                    <span className="text-xs text-white font-medium">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2.5 p-3.5 bg-ink-accent/5 border border-ink-accent/10 rounded-xl text-left mb-6">
                <Info className="w-4 h-4 text-ink-accent shrink-0 mt-0.5" />
                <p className="text-xs text-gray-400">
                  We&apos;ll contact you at <span className="text-white font-medium">{formData.email}</span> within 24–48 hours to confirm.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => router.push('/')} className="flex-1 py-3 border border-white/10 hover:border-white/25 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                  Return Home
                </button>
                <button onClick={handleBookAnother} className="flex-1 py-3 bg-ink-accent hover:bg-yellow-400 text-black font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all">
                  Book Another
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ─── Policies Modal ────────────────────────────────────────── */}
      {showPolicies && (
        <Modal>
          <div className="bg-ink-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                <Info className="w-4 h-4 text-ink-accent" /> Studio Policies
              </h3>
              <IconBtn onClick={() => setShowPolicies(false)}><X className="w-4 h-4" /></IconBtn>
            </div>
            <div className="p-6 overflow-y-auto">
              <ol className="space-y-4">
                {[
                  'All clients must read and sign our Client Information and Consent Form and present a <strong>VALID ID</strong> with Date of Birth.',
                  'Clients <strong>UNDER 18</strong> must be accompanied by a parent/legal guardian with valid ID.',
                  'The studio reserves the right to <strong>REFUSE</strong> clients under the influence of alcohol/drugs or with conditions unfit for a session.',
                  'The studio offers <strong>FREE CONSULTATION</strong>. A <strong>DEPOSIT</strong> is required to secure a slot. Quoted prices are estimates and may change.',
                  'The studio will <strong>NOT</strong> send electronic copies of custom designs — designs are viewed in-studio only.',
                  'For <strong>COVER-UP</strong> projects, the artist may suggest tweaks to properly conceal the existing tattoo.',
                  'A <strong>TOUCH-UP</strong> may be done within <strong>2 weeks</strong> after the session if needed. Outside this window, regular pricing applies.',
                  'Special appointments outside studio hours require a deposit to secure the slot.',
                  'The deposit is <strong>NON-REFUNDABLE</strong> and <strong>NON-TRANSFERABLE</strong>. Forfeited for: major design changes, no-shows, failing to cancel 48h prior, rescheduling more than twice, or failing to rebook within 90 days.',
                  'If you are 15+ minutes late, the studio may accept other clients.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                    <span className="text-ink-accent font-black shrink-0 text-sm">{String(i + 1).padStart(2, '0')}.</span>
                    <span dangerouslySetInnerHTML={{ __html: item.replace(/<strong>/g, '<strong class="text-white">') }} />
                  </li>
                ))}
              </ol>
            </div>
            <div className="p-5 border-t border-white/5 flex justify-end">
              <button onClick={() => setShowPolicies(false)} className="px-6 py-2.5 bg-ink-accent hover:bg-yellow-400 text-black font-bold uppercase text-[10px] tracking-widest rounded-xl transition-colors">
                I Understand
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ─── Read Before Modal ─────────────────────────────────────── */}
      {showReadBefore && (
        <Modal>
          <div className="bg-ink-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-ink-accent" /> Read Before You Book
              </h3>
              <IconBtn onClick={() => setShowReadBefore(false)}><X className="w-4 h-4" /></IconBtn>
            </div>
            <div className="p-6 overflow-y-auto space-y-8">

              <div>
                <h4 className="text-[10px] font-black text-ink-accent uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Check className="w-3 h-3" /> Preparation Checklist
                </h4>
                <ol className="space-y-4">
                  {[
                    { title: 'Get enough sleep.', body: 'Being well-rested keeps you alert and in-tune with your body during the session.' },
                    { title: 'Stay hydrated.', body: 'Hydrated skin takes ink better. Bring a water bottle if needed.' },
                    { title: 'Wear the right clothes.', body: 'Choose loose, comfortable clothing — tight clothes near the tattoo area may affect blood flow.' },
                    { title: 'Be punctual.', body: 'The studio may take other clients if you are 15+ minutes late from your appointment.' },
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-ink-accent font-black shrink-0 w-5 text-sm">{i + 1}.</span>
                      <div>
                        <p className="text-white font-bold text-sm mb-0.5">{item.title}</p>
                        <p className="text-gray-400 text-xs leading-relaxed">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="h-px bg-white/5" />

              <div>
                <h4 className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <X className="w-3 h-3" /> Things to Avoid
                </h4>
                <ol className="space-y-4">
                  {[
                    { title: 'Alcohol and drugs.', body: 'We will not proceed if you show up under the influence — it thins blood and creates complications.' },
                    { title: 'Intensive exercise.', body: 'Avoid heavy workouts before your session — sore muscles make tattooing more painful.' },
                    { title: 'Damaged or problematic skin.', body: 'Conditions like eczema, keloids, or rashes — consult your doctor first.' },
                    { title: 'Shaving the area yourself.', body: 'The artist will shave the area at the start of your session using the correct technique.' },
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-red-400 font-black shrink-0 w-5 text-sm">{i + 1}.</span>
                      <div>
                        <p className="text-white font-bold text-sm mb-0.5">{item.title}</p>
                        <p className="text-gray-400 text-xs leading-relaxed">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 bg-white/3 border border-white/8 rounded-xl">
                <AlertCircle className="w-4 h-4 text-ink-accent shrink-0 mt-0.5" />
                <p className="text-xs text-gray-400 italic">Clients under 18 must be accompanied by a parent/legal guardian with valid ID.</p>
              </div>
            </div>
            <div className="p-5 border-t border-white/5 flex justify-end">
              <button onClick={() => setShowReadBefore(false)} className="px-6 py-2.5 bg-ink-accent hover:bg-yellow-400 text-black font-bold uppercase text-[10px] tracking-widest rounded-xl transition-colors">
                I&apos;m Ready
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ── Small shared sub-components ────────────────────────────────── */

function SectionHeader({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
      <div className="w-8 h-8 bg-ink-accent/10 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-ink-accent" />
      </div>
      <div>
        <h3 className="text-xs font-black text-white uppercase tracking-widest">{title}</h3>
        <p className="text-[10px] text-gray-500">{sub}</p>
      </div>
    </div>
  );
}

function PrimaryBtn({ onClick, label }: { onClick?: () => void; label: string }) {
  return (
    <button
      type={onClick ? 'button' : 'submit'}
      onClick={onClick}
      className="w-full py-4 bg-ink-accent hover:bg-yellow-400 text-black font-black text-sm tracking-[0.2em] uppercase rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group shadow-[0_4px_24px_rgba(212,175,55,0.22)]"
    >
      {label}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-5 py-4 border border-white/10 hover:border-white/25 text-gray-400 hover:text-white font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-200 flex items-center gap-2"
    >
      <ChevronLeft className="w-4 h-4" />
      Back
    </button>
  );
}

function IconBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
    >
      {children}
    </button>
  );
}

function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      {children}
    </div>
  );
}

function ReviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/3 border border-white/5 rounded-xl p-4 space-y-2">
      <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">{title}</p>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-white/5" />;
}

export default Booking;
