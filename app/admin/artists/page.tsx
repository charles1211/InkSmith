'use client';

import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { createClient } from '../../../lib/supabase/client';
import { Artist } from '../../../types';
import ArtistsSection from '../../../components/admin/ArtistsSection';
import ArtistFormModal from '../../../components/admin/ArtistFormModal';
import DeleteConfirm from '../../../components/admin/DeleteConfirm';

const BLANK_ARTIST: Artist = {
  id: '', name: '', specialties: [], bio: '', imageUrl: '', instagramHandle: '', highlights: [''],
};

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [artistSearch, setArtistSearch] = useState('');
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [isNewArtist, setIsNewArtist] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Artist | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('artists')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          setArtists(data.map(r => ({
            id: r.id,
            name: r.name,
            specialties: r.specialties ?? [],
            bio: r.bio ?? '',
            imageUrl: r.image_url ?? '',
            instagramHandle: r.instagram_handle ?? '',
            highlights: r.highlights ?? [],
          })));
        }
        setLoading(false);
      });
  }, []);

  const filteredArtists = artists.filter(a => {
    const q = artistSearch.toLowerCase();
    return (
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.specialties.some(s => s.toLowerCase().includes(q))
    );
  });

  const openEditArtist = (artist: Artist) => {
    setEditingArtist(artist);
    setIsNewArtist(false);
  };

  const openNewArtist = () => {
    setEditingArtist({ ...BLANK_ARTIST });
    setIsNewArtist(true);
  };

  const handleSaveArtist = async (artist: Artist) => {
    const supabase = createClient();
    const row = {
      id: artist.id,
      name: artist.name,
      specialties: artist.specialties,
      bio: artist.bio,
      image_url: artist.imageUrl,
      instagram_handle: artist.instagramHandle,
      highlights: artist.highlights ?? [],
    };

    if (isNewArtist) {
      const { error } = await supabase.from('artists').insert(row);
      if (error) throw new Error(error.message);
      setArtists(prev => [...prev, artist]);
    } else {
      const { error } = await supabase.from('artists').update(row).eq('id', artist.id);
      if (error) throw new Error(error.message);
      setArtists(prev => prev.map(a => a.id === artist.id ? artist : a));
    }
    setEditingArtist(null);
  };

  const handleDeleteArtist = async () => {
    if (!deleteTarget) return;
    const supabase = createClient();
    await supabase.from('artists').delete().eq('id', deleteTarget.id);
    setArtists(prev => prev.filter(a => a.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white uppercase">Artists</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your studio roster and artist profiles.</p>
        </div>
        <button
          onClick={openNewArtist}
          className="flex items-center gap-2 px-5 py-2.5 bg-ink-accent text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors text-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Artist
        </button>
      </div>

      <ArtistsSection
        artists={artists}
        artistsLoading={loading}
        artistSearch={artistSearch}
        setArtistSearch={setArtistSearch}
        filteredArtists={filteredArtists}
        openEditArtist={openEditArtist}
        setDeleteTarget={setDeleteTarget}
      />

      {editingArtist && (
        <ArtistFormModal
          initial={editingArtist}
          onSave={handleSaveArtist}
          onClose={() => setEditingArtist(null)}
          isNew={isNewArtist}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onConfirm={handleDeleteArtist}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
