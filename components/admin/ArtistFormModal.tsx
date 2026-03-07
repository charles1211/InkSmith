'use client';

import React, { useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import { Artist, TattooStyle } from '../../types';
import {
  X,
  Upload,
  Instagram,
  ChevronDown,
  Check,
  Trash2,
  Plus,
  GripVertical,
} from 'lucide-react';

const ALL_STYLES = Object.values(TattooStyle);

interface ArtistFormModalProps {
  initial: Artist;
  onSave: (artist: Artist) => Promise<void>;
  onClose: () => void;
  isNew: boolean;
}

const ArtistFormModal: React.FC<ArtistFormModalProps> = ({ initial, onSave, onClose, isNew }) => {
  const [form, setForm] = useState<Artist>({
    ...initial,
    highlights: initial.highlights?.length ? [...initial.highlights] : [''],
  });
  const [styleOpen, setStyleOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Artist, string>>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      // Race the upload against a 20-second timeout so the spinner never hangs forever
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Upload timed out — check that the "artist-images" storage bucket exists in Supabase.')), 20000)
      );

      const { error } = await Promise.race([
        supabase.storage.from('artist-images').upload(fileName, file, { upsert: true }),
        timeout,
      ]);

      if (error) throw new Error(error.message);
      const { data } = supabase.storage.from('artist-images').getPublicUrl(fileName);
      set('imageUrl', data.publicUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  };

  const set = <K extends keyof Artist>(key: K, value: Artist[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const toggleStyle = (style: TattooStyle) =>
    set(
      'specialties',
      form.specialties.includes(style)
        ? form.specialties.filter(s => s !== style)
        : [...form.specialties, style]
    );

  const setHighlight = (idx: number, val: string) =>
    set('highlights', form.highlights!.map((h, i) => (i === idx ? val : h)));

  const addHighlight = () => set('highlights', [...(form.highlights ?? []), '']);

  const removeHighlight = (idx: number) =>
    set('highlights', form.highlights!.filter((_, i) => i !== idx));

  const validate = () => {
    const e: Partial<Record<keyof Artist, string>> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.imageUrl.trim()) e.imageUrl = 'Please upload a photo first';
    if (!form.instagramHandle.trim()) e.instagramHandle = 'Instagram handle is required';
    if (form.specialties.length === 0) e.specialties = 'Select at least one style';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaveError('');
    setSaving(true);
    try {
      const cleaned: Artist = {
        ...form,
        id: form.id || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        instagramHandle: form.instagramHandle.startsWith('@')
          ? form.instagramHandle
          : `@${form.instagramHandle}`,
        highlights: form.highlights?.filter(h => h.trim()) ?? [],
      };
      await onSave(cleaned);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save artist';
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (err?: string) =>
    `w-full bg-ink-950 border ${err ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white text-sm focus:border-ink-accent outline-none transition-colors placeholder:text-gray-600`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-ink-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-ink-900 border-b border-white/10 px-6 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-serif font-bold text-white">
              {isNew ? 'Add New Artist' : 'Edit Artist'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isNew ? 'Fill in the profile details below' : `Editing — ${initial.name}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Preview strip */}
          {form.imageUrl && (
            <div className="flex items-center gap-4 bg-ink-950 rounded-xl p-4 border border-white/5">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-16 h-16 rounded-lg object-cover border border-white/10"
                onError={e => {
                  (e.target as HTMLImageElement).src = 'https://picsum.photos/64/64?grayscale';
                }}
              />
              <div>
                <p className="text-white font-bold text-sm">{form.name || 'Artist Name'}</p>
                <p className="text-ink-accent text-xs">{form.instagramHandle || '@handle'}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {form.specialties.map(s => (
                    <span
                      key={s}
                      className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full border border-white/10"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Display Name *
            </label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. ROMARK"
              className={inputCls(errors.name)}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Profile Image *
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`w-full flex items-center justify-center gap-2 bg-ink-950 border border-dashed rounded-lg px-4 py-5 text-sm transition-colors ${
                uploading
                  ? 'border-ink-accent/40 text-ink-accent cursor-wait'
                  : errors.imageUrl
                  ? 'border-red-500 text-gray-400 hover:border-red-400'
                  : 'border-white/20 text-gray-400 hover:border-ink-accent hover:text-ink-accent'
              }`}
            >
              <Upload className="w-4 h-4" />
              {uploading
                ? 'Uploading…'
                : form.imageUrl
                ? 'Image uploaded — click to change'
                : 'Click to upload artist photo'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFile}
            />
            {uploadError && (
              <p className="text-red-400 text-xs mt-1">Upload failed: {uploadError}</p>
            )}
            {!uploadError && errors.imageUrl && (
              <p className="text-red-400 text-xs mt-1">{errors.imageUrl}</p>
            )}
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Instagram Handle *
            </label>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={form.instagramHandle}
                onChange={e => set('instagramHandle', e.target.value)}
                placeholder="@handle"
                className={`${inputCls(errors.instagramHandle)} pl-10`}
              />
            </div>
            {errors.instagramHandle && (
              <p className="text-red-400 text-xs mt-1">{errors.instagramHandle}</p>
            )}
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Tattoo Styles / Specialties *
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setStyleOpen(o => !o)}
                className={`w-full flex items-center justify-between bg-ink-950 border ${
                  errors.specialties ? 'border-red-500' : 'border-white/10'
                } rounded-lg px-4 py-3 text-sm text-left focus:border-ink-accent outline-none transition-colors`}
              >
                <span className={form.specialties.length ? 'text-white' : 'text-gray-600'}>
                  {form.specialties.length ? form.specialties.join(', ') : 'Select styles…'}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${styleOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {styleOpen && (
                <div className="absolute z-20 mt-1 w-full bg-ink-800 border border-white/10 rounded-xl p-3 shadow-2xl grid grid-cols-2 gap-1">
                  {ALL_STYLES.map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleStyle(style)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                        form.specialties.includes(style)
                          ? 'bg-ink-accent/15 text-ink-accent border border-ink-accent/30'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                          form.specialties.includes(style)
                            ? 'bg-ink-accent border-ink-accent'
                            : 'border-white/20'
                        }`}
                      >
                        {form.specialties.includes(style) && (
                          <Check className="w-2.5 h-2.5 text-black" />
                        )}
                      </span>
                      {style}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.specialties && (
              <p className="text-red-400 text-xs mt-1">{errors.specialties}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Bio{' '}
              <span className="text-gray-600 normal-case font-normal">(optional)</span>
            </label>
            <textarea
              value={form.bio}
              onChange={e => set('bio', e.target.value)}
              rows={3}
              placeholder="Short paragraph about the artist's background…"
              className={`${inputCls()} resize-none`}
            />
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Highlights / Bullet Points
            </label>
            <div className="space-y-2">
              {(form.highlights ?? []).map((h, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <GripVertical className="w-4 h-4 text-gray-600 shrink-0 cursor-grab" />
                  <span className="text-ink-accent shrink-0 text-lg leading-none">•</span>
                  <input
                    value={h}
                    onChange={e => setHighlight(idx, e.target.value)}
                    placeholder={`Highlight ${idx + 1}…`}
                    className="flex-1 bg-ink-950 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:border-ink-accent outline-none transition-colors placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeHighlight(idx)}
                    disabled={(form.highlights?.length ?? 0) <= 1}
                    className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded disabled:opacity-20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addHighlight}
              className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-ink-accent transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Highlight
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-ink-900 border-t border-white/10 px-6 py-4 space-y-2">
          {saveError && <p className="text-red-400 text-xs text-right">{saveError}</p>}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-bold text-gray-400 hover:text-white border border-white/10 rounded-lg hover:border-white/30 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || uploading}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-ink-accent text-black rounded-lg hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-wait"
            >
              {saving && (
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              )}
              {saving ? 'Saving…' : isNew ? 'Add Artist' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistFormModal;
