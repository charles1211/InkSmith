'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Upload, Trash2, X, Plus } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

export type GalleryItem = {
  id: string;
  src: string;
  title: string;
  category: string;
  artist: string;
};

const CATEGORIES = [
  'Realism',
  'Traditional',
  'Japanese',
  'Blackwork',
  'Fine Line',
  'Color',
  'Watercolor',
];

// ─── UPLOAD MODAL ─────────────────────────────────────────────────────────────

interface UploadModalProps {
  onClose: () => void;
  onUploaded: (item: GalleryItem) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [artist, setArtist] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file || !title.trim() || !artist.trim()) {
      setError('Please fill in all fields and select an image.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Upload timed out — check that the "portfolio-images" bucket exists in Supabase.')), 20000)
      );

      const { error: uploadError } = await Promise.race([
        supabase.storage.from('portfolio-images').upload(fileName, file, { upsert: true }),
        timeout,
      ]);
      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);

      const { data, error: dbError } = await supabase
        .from('portfolio_images')
        .insert({
          src: urlData.publicUrl,
          title: title.trim(),
          category,
          artist: artist.trim(),
        })
        .select()
        .single();

      if (dbError) throw new Error(dbError.message);

      onUploaded({
        id: data.id,
        src: data.src,
        title: data.title,
        category: data.category,
        artist: data.artist ?? '',
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-ink-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h2 className="text-lg font-serif font-bold text-white">Upload Portfolio Image</h2>
            <p className="text-xs text-gray-400 mt-0.5">Add a new work to the public gallery</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Image picker */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full h-48 rounded-xl border-2 border-dashed border-white/10 hover:border-ink-accent/50 hover:bg-ink-accent/5 transition-all flex items-center justify-center overflow-hidden"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-500">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-bold">Click to select image</p>
                <p className="text-xs mt-1">JPG, PNG, WEBP</p>
              </div>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Title *
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Eternal Dragon"
              className="w-full bg-ink-950 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-ink-accent outline-none transition-colors placeholder:text-gray-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-ink-950 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-ink-accent outline-none transition-colors"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Artist */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                Artist *
              </label>
              <input
                value={artist}
                onChange={e => setArtist(e.target.value)}
                placeholder="e.g. Romark"
                className="w-full bg-ink-950 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-ink-accent outline-none transition-colors placeholder:text-gray-600"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-5 py-2.5 text-sm font-bold text-gray-400 hover:text-white border border-white/10 rounded-lg hover:border-white/30 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-ink-accent text-black rounded-lg hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-wait"
          >
            {uploading && (
              <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            )}
            {uploading ? 'Uploading…' : 'Upload Image'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── GALLERY SECTION ──────────────────────────────────────────────────────────

const GallerySection: React.FC = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('portfolio_images')
        .select('*')
        .order('created_at', { ascending: false });
      setImages(
        (data ?? []).map(r => ({
          id: r.id,
          src: r.src,
          title: r.title,
          category: r.category,
          artist: r.artist ?? '',
        }))
      );
      setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async (item: GalleryItem) => {
    setDeleting(item.id);
    try {
      const supabase = createClient();
      const fileName = item.src.split('/').pop();
      if (fileName) {
        await supabase.storage.from('portfolio-images').remove([fileName]);
      }
      await supabase.from('portfolio_images').delete().eq('id', item.id);
      setImages(prev => prev.filter(i => i.id !== item.id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header bar */}
        <div className="flex justify-between items-center bg-ink-900 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center space-x-4">
            <ImageIcon className="w-6 h-6 text-ink-accent" />
            <div>
              <h3 className="text-lg font-bold text-white">Portfolio Images</h3>
              <p className="text-xs text-gray-400">
                {loading ? 'Loading…' : `${images.length} image${images.length !== 1 ? 's' : ''} in gallery`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-ink-accent text-black font-bold rounded-lg hover:bg-white transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Upload New
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            <div className="w-8 h-8 border-2 border-ink-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm">Loading gallery…</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-xl text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-bold">No images yet</p>
            <p className="text-sm mt-1 mb-6">Upload your first portfolio image.</p>
            <button
              onClick={() => setShowUpload(true)}
              className="px-5 py-2.5 bg-ink-accent text-black font-bold rounded-lg text-sm hover:bg-white transition-colors"
            >
              Upload First Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map(item => (
              <div
                key={item.id}
                className="relative group bg-ink-900 rounded-xl overflow-hidden border border-white/5 aspect-square"
              >
                <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-3 text-center">
                  <p className="text-white font-bold text-sm line-clamp-1">{item.title}</p>
                  <span className="text-ink-accent text-[10px] uppercase tracking-widest font-bold">
                    {item.category}
                  </span>
                  <span className="text-gray-400 text-xs">{item.artist}</span>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={deleting === item.id}
                    className="mt-2 p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {deleting === item.id ? (
                      <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin block" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {/* Upload slot */}
            <button
              onClick={() => setShowUpload(true)}
              className="border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-6 text-gray-500 hover:text-ink-accent hover:border-ink-accent/50 hover:bg-ink-accent/5 transition-all aspect-square"
            >
              <Upload className="w-8 h-8 mb-2" />
              <span className="text-xs font-bold uppercase tracking-widest">Upload</span>
            </button>
          </div>
        )}
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={item => setImages(prev => [item, ...prev])}
        />
      )}
    </>
  );
};

export default GallerySection;
