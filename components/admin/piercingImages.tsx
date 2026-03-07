'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Zap, Upload, Trash2, X, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

type PiercingImage = {
  id: string;
  src: string;
  name: string;
};

type FileStatus = 'pending' | 'uploading' | 'done' | 'error';

type FileEntry = {
  file: File;
  preview: string;
  name: string;
  status: FileStatus;
  error?: string;
};

// ─── UPLOAD MODAL ─────────────────────────────────────────────────────────────

interface UploadModalProps {
  onClose: () => void;
  onUploaded: (item: PiercingImage) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUploaded }) => {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [uploading, setUploading] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (!picked.length) return;
    setEntries(prev => [
      ...prev,
      ...picked.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        status: 'pending' as FileStatus,
      })),
    ]);
    e.target.value = '';
  };

  const removeEntry = (idx: number) =>
    setEntries(prev => prev.filter((_, i) => i !== idx));

  const setName = (idx: number, val: string) =>
    setEntries(prev => prev.map((e, i) => (i === idx ? { ...e, name: val } : e)));

  const uploadOne = async (
    entry: FileEntry,
    supabase: ReturnType<typeof createClient>
  ): Promise<PiercingImage | null> => {
    const ext = entry.file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('Upload timed out — check that the "piercing-images" bucket exists.')),
        20000
      )
    );

    const { error: uploadError } = await Promise.race([
      supabase.storage.from('piercing-images').upload(fileName, entry.file, { upsert: true }),
      timeout,
    ]);
    if (uploadError) throw new Error(uploadError.message);

    const { data: urlData } = supabase.storage.from('piercing-images').getPublicUrl(fileName);

    const { data, error: dbError } = await supabase
      .from('piercing_images')
      .insert({ src: urlData.publicUrl, name: entry.name.trim() || 'Untitled' })
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);
    return { id: data.id, src: data.src, name: data.name ?? '' };
  };

  const handleUpload = async () => {
    if (!entries.some(e => e.status === 'pending')) return;
    setUploading(true);
    const supabase = createClient();

    for (let i = 0; i < entries.length; i++) {
      if (entries[i].status !== 'pending') continue;
      setEntries(prev => prev.map((e, idx) => (idx === i ? { ...e, status: 'uploading' } : e)));
      try {
        const result = await uploadOne(entries[i], supabase);
        if (result) onUploaded(result);
        setEntries(prev => prev.map((e, idx) => (idx === i ? { ...e, status: 'done' } : e)));
        setDoneCount(c => c + 1);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Upload failed';
        setEntries(prev => prev.map((e, idx) => (idx === i ? { ...e, status: 'error', error: msg } : e)));
      }
    }
    setUploading(false);
  };

  const allDone = entries.length > 0 && entries.every(e => e.status === 'done');
  const pendingCount = entries.filter(e => e.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={!uploading ? onClose : undefined} />
      <div className="relative bg-ink-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
          <div>
            <h2 className="text-lg font-serif font-bold text-white">Upload Piercing Images</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {entries.length === 0
                ? 'Select one or more photos'
                : `${entries.length} image${entries.length !== 1 ? 's' : ''} selected${doneCount ? ` · ${doneCount} uploaded` : ''}`}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Drop zone */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full rounded-xl border-2 border-dashed border-white/10 hover:border-ink-accent/50 hover:bg-ink-accent/5 transition-all flex items-center justify-center gap-3 py-6 text-gray-500 disabled:pointer-events-none"
          >
            <Upload className="w-6 h-6" />
            <span className="text-sm font-bold">
              {entries.length === 0 ? 'Click to select images' : 'Add more images'}
            </span>
            <span className="text-xs text-gray-600">JPG, PNG, WEBP · multiple allowed</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />

          {/* Entries list */}
          {entries.length > 0 && (
            <div className="space-y-3">
              {entries.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-ink-950 rounded-xl p-3 border border-white/5">
                  {/* Thumbnail */}
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-ink-900">
                    <img src={entry.preview} alt="" className="w-full h-full object-cover" />
                    {entry.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="w-5 h-5 border-2 border-ink-accent border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {entry.status === 'done' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                    )}
                    {entry.status === 'error' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      </div>
                    )}
                  </div>

                  {/* Name input */}
                  <div className="flex-1 min-w-0">
                    <input
                      value={entry.name}
                      onChange={e => setName(idx, e.target.value)}
                      disabled={entry.status !== 'pending'}
                      placeholder="Piercing name (e.g. Conch)"
                      className="w-full bg-ink-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-ink-accent outline-none transition-colors placeholder:text-gray-600 disabled:opacity-60"
                    />
                    {entry.status === 'error' && (
                      <p className="text-red-400 text-[10px] mt-1 truncate">{entry.error}</p>
                    )}
                  </div>

                  {/* Remove */}
                  {entry.status === 'pending' && (
                    <button
                      onClick={() => removeEntry(idx)}
                      className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-5 py-2.5 text-sm font-bold text-gray-400 hover:text-white border border-white/10 rounded-lg hover:border-white/30 transition-colors disabled:opacity-50"
          >
            {allDone ? 'Close' : 'Cancel'}
          </button>
          {!allDone && (
            <button
              onClick={handleUpload}
              disabled={uploading || pendingCount === 0}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-ink-accent text-black rounded-lg hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-wait"
            >
              {uploading && (
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              )}
              {uploading
                ? 'Uploading…'
                : `Upload ${pendingCount > 0 ? `${pendingCount} ` : ''}Image${pendingCount !== 1 ? 's' : ''}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── PIERCING IMAGES SECTION ──────────────────────────────────────────────────

const PiercingImages: React.FC = () => {
  const [images, setImages] = useState<PiercingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('piercing_images')
        .select('*')
        .order('created_at', { ascending: false });
      setImages((data ?? []).map(r => ({ id: r.id, src: r.src, name: r.name ?? '' })));
      setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async (item: PiercingImage) => {
    setDeleting(item.id);
    try {
      const supabase = createClient();
      const fileName = item.src.split('/').pop();
      if (fileName) {
        await supabase.storage.from('piercing-images').remove([fileName]);
      }
      await supabase.from('piercing_images').delete().eq('id', item.id);
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
            <Zap className="w-6 h-6 text-ink-accent" />
            <div>
              <h3 className="text-lg font-bold text-white">Piercing Images</h3>
              <p className="text-xs text-gray-400">
                {loading ? 'Loading…' : `${images.length} image${images.length !== 1 ? 's' : ''} uploaded`}
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

        {/* SQL hint */}
        <div className="bg-ink-900/40 border border-white/5 rounded-xl px-5 py-3">
          <p className="text-[11px] text-gray-500 font-mono">
            Supabase table: <span className="text-ink-accent">piercing_images</span> &nbsp;|&nbsp;
            Storage bucket: <span className="text-ink-accent">piercing-images</span> &nbsp;|&nbsp;
            Columns: <span className="text-gray-400">id, src, name, created_at</span>
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            <div className="w-8 h-8 border-2 border-ink-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm">Loading piercing images…</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-xl text-gray-500">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-bold">No piercing images yet</p>
            <p className="text-sm mt-1 mb-6">Upload your first piercing photos.</p>
            <button
              onClick={() => setShowUpload(true)}
              className="px-5 py-2.5 bg-ink-accent text-black font-bold rounded-lg text-sm hover:bg-white transition-colors"
            >
              Upload Images
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {images.map(item => (
              <div
                key={item.id}
                className="relative group bg-ink-900 rounded-xl overflow-hidden border border-white/5 aspect-[4/5]"
              >
                <img src={item.src} alt={item.name} className="w-full h-full object-cover" />

                {/* Name badge */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                  <p className="text-white text-xs font-bold uppercase tracking-wide truncate">{item.name}</p>
                </div>

                {/* Delete overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={deleting === item.id}
                    className="p-2.5 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
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
              className="border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-6 text-gray-500 hover:text-ink-accent hover:border-ink-accent/50 hover:bg-ink-accent/5 transition-all aspect-[4/5]"
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

export default PiercingImages;
