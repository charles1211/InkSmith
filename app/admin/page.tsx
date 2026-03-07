'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Artist } from '../../types';
import { Plus } from 'lucide-react';

import AdminSidebar from '../../components/admin/AdminSidebar';
import ArtistFormModal from '../../components/admin/ArtistFormModal';
import DeleteConfirm from '../../components/admin/DeleteConfirm';
import OverviewSection, { Booking } from '../../components/admin/OverviewSection';
import BookingsSection from '../../components/admin/BookingsSection';
import ArtistsSection from '../../components/admin/ArtistsSection';
import GallerySection from '../../components/admin/GallerySection';
import StudioImages from '../../components/admin/StudioImages';
import PiercingImages from '../../components/admin/piercingImages';

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────

const initialBookings: Booking[] = [
  { id: 'BK-001', client: 'Sarah Connor', email: 'sarah@example.com', artist: 'Viper', date: '2023-11-15', time: '14:00', status: 'Pending', type: 'Tattoo' },
  { id: 'BK-002', client: 'John Wick', email: 'john@example.com', artist: 'Kenji', date: '2023-11-16', time: '10:00', status: 'Confirmed', type: 'Tattoo' },
  { id: 'BK-003', client: 'Ellen Ripley', email: 'ellen@example.com', artist: 'Sarah', date: '2023-11-18', time: '12:30', status: 'Completed', type: 'Piercing' },
  { id: 'BK-004', client: 'Tony Stark', email: 'tony@stark.com', artist: 'Romark', date: '2023-11-20', time: '15:00', status: 'Cancelled', type: 'Consultation' },
  { id: 'BK-005', client: 'Bruce Wayne', email: 'bruce@wayne.com', artist: 'Viper', date: '2023-11-22', time: '11:00', status: 'Pending', type: 'Tattoo' },
];

const EMPTY_ARTIST: Artist = {
  id: '',
  name: '',
  specialties: [],
  bio: '',
  imageUrl: '',
  instagramHandle: '',
  highlights: [''],
};

// ─── MAIN ADMIN CONTENT ────────────────────────────────────────────────────────

const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artistsLoading, setArtistsLoading] = useState(true);
  const [artistSearch, setArtistSearch] = useState('');
  const [formTarget, setFormTarget] = useState<Artist | null>(null);
  const [isNewArtist, setIsNewArtist] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Artist | null>(null);

  // Load artists from Supabase
  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && data) {
        setArtists(
          data.map(r => ({
            id: r.id,
            name: r.name,
            specialties: r.specialties ?? [],
            bio: r.bio ?? '',
            imageUrl: r.image_url ?? '',
            instagramHandle: r.instagram_handle ?? '',
            highlights: r.highlights ?? [],
          }))
        );
      }
      setArtistsLoading(false);
    };
    load();
  }, []);

  const updateBookingStatus = (id: string, newStatus: string) =>
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, status: newStatus } : b)));

  const openAddArtist = () => { setFormTarget({ ...EMPTY_ARTIST }); setIsNewArtist(true); };
  const openEditArtist = (a: Artist) => { setFormTarget({ ...a }); setIsNewArtist(false); };
  const closeForm = () => setFormTarget(null);

  const saveArtist = async (updated: Artist) => {
    const supabase = createClient();
    const { error } = await supabase.from('artists').upsert({
      id: updated.id,
      name: updated.name,
      specialties: updated.specialties,
      bio: updated.bio,
      image_url: updated.imageUrl,
      instagram_handle: updated.instagramHandle,
      highlights: updated.highlights ?? [],
    });
    if (error) throw new Error(error.message);
    if (isNewArtist) {
      setArtists(prev => [...prev, updated]);
    } else {
      setArtists(prev => prev.map(a => (a.id === updated.id ? updated : a)));
    }
    closeForm();
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      const supabase = createClient();
      await supabase.from('artists').delete().eq('id', deleteTarget.id);
      setArtists(prev => prev.filter(a => a.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  const filteredArtists = artists.filter(
    a =>
      a.name.toLowerCase().includes(artistSearch.toLowerCase()) ||
      a.specialties.some(s => s.toLowerCase().includes(artistSearch.toLowerCase()))
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewSection
            bookings={bookings}
            artists={artists}
            openAddArtist={() => { setActiveTab('artists'); openAddArtist(); }}
          />
        );
      case 'bookings':
        return <BookingsSection bookings={bookings} updateBookingStatus={updateBookingStatus} />;
      case 'artists':
        return (
          <ArtistsSection
            artists={artists}
            artistsLoading={artistsLoading}
            artistSearch={artistSearch}
            setArtistSearch={setArtistSearch}
            filteredArtists={filteredArtists}
            openEditArtist={openEditArtist}
            setDeleteTarget={setDeleteTarget}
          />
        );
      case 'gallery':
        return <GallerySection />;
      case 'studio':
        return <StudioImages />;
      case 'piercing':
        return <PiercingImages />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 pt-20 flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        artistCount={artists.length}
      />

      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Tab Nav */}
          <div className="lg:hidden mb-6 flex space-x-2 overflow-x-auto pb-2">
            {['overview', 'bookings', 'artists', 'gallery', 'studio', 'piercing'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                  activeTab === tab ? 'bg-ink-accent text-black' : 'bg-white/5 text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-white uppercase">{activeTab}</h1>
              <p className="text-gray-400 text-sm mt-1">
                Welcome back, Admin. Here is what&apos;s happening today.
              </p>
            </div>
            {activeTab === 'artists' && (
              <button
                onClick={openAddArtist}
                className="flex items-center gap-2 px-5 py-2.5 bg-ink-accent text-black font-bold rounded-lg hover:bg-white transition-colors text-sm"
              >
                <Plus className="w-4 h-4" /> Add Artist
              </button>
            )}
          </div>

          {renderContent()}
        </div>
      </main>

      {formTarget && (
        <ArtistFormModal
          initial={formTarget}
          onSave={saveArtist}
          onClose={closeForm}
          isNew={isNewArtist}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

// ─── PAGE ──────────────────────────────────────────────────────────────────────

const AdminPage: React.FC = () => (
  <ProtectedRoute requireAdmin={true}>
    <AdminContent />
  </ProtectedRoute>
);

export default AdminPage;
