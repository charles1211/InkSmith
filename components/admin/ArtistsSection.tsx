import React from 'react';
import { Search, Users, Instagram, Pencil, Trash2 } from 'lucide-react';
import { Artist } from '../../types';

interface ArtistsSectionProps {
  artists: Artist[];
  artistsLoading: boolean;
  artistSearch: string;
  setArtistSearch: (v: string) => void;
  filteredArtists: Artist[];
  openEditArtist: (a: Artist) => void;
  setDeleteTarget: (a: Artist) => void;
}

const ArtistsSection: React.FC<ArtistsSectionProps> = ({
  artists,
  artistsLoading,
  artistSearch,
  setArtistSearch,
  filteredArtists,
  openEditArtist,
  setDeleteTarget,
}) => (
  <div className="space-y-6">
    {/* Toolbar */}
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <input
        value={artistSearch}
        onChange={e => setArtistSearch(e.target.value)}
        placeholder="Search artists or styles…"
        className="w-full bg-ink-900 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-ink-accent outline-none transition-colors"
      />
    </div>

    {/* Summary bar */}
    <div className="flex items-center gap-6 text-sm text-gray-400">
      <span>
        <span className="text-white font-bold">{artists.length}</span> artists on roster
      </span>
      <span className="text-gray-700">|</span>
      <span>
        <span className="text-white font-bold">{filteredArtists.length}</span> shown
      </span>
    </div>

    {/* Artist cards */}
    {artistsLoading ? (
      <div className="text-center py-20 text-gray-500">
        <div className="w-8 h-8 border-2 border-ink-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">Loading artists…</p>
      </div>
    ) : filteredArtists.length === 0 ? (
      <div className="text-center py-20 text-gray-500">
        <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="font-bold">No artists found</p>
        <p className="text-sm mt-1">Try a different search or add a new artist.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredArtists.map(artist => (
          <div
            key={artist.id}
            className="bg-ink-900 border border-white/5 rounded-xl overflow-hidden group hover:border-white/15 transition-colors"
          >
            {/* Image */}
            <div className="relative h-52 overflow-hidden bg-ink-800">
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                onError={e => {
                  (e.target as HTMLImageElement).src = 'https://picsum.photos/400/300?grayscale';
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink-950/80 via-transparent to-transparent" />

              {/* Hover action buttons */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditArtist(artist)}
                  className="p-2 bg-black/70 backdrop-blur-sm text-white rounded-lg hover:bg-ink-accent hover:text-black transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(artist)}
                  className="p-2 bg-black/70 backdrop-blur-sm text-white rounded-lg hover:bg-red-500 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Name over image */}
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-white font-serif font-bold text-lg leading-tight">{artist.name}</p>
                <a
                  href={`https://instagram.com/${artist.instagramHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-accent text-xs flex items-center gap-1 hover:underline"
                >
                  <Instagram className="w-3 h-3" />
                  {artist.instagramHandle}
                </a>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Specialties */}
              <div className="flex flex-wrap gap-1.5">
                {artist.specialties.map(s => (
                  <span
                    key={s}
                    className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/10 bg-white/5 text-ink-accent rounded-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Highlights preview */}
              {artist.highlights && artist.highlights.length > 0 && (
                <ul className="space-y-1.5">
                  {artist.highlights.slice(0, 2).map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="text-ink-accent mt-0.5 shrink-0">•</span>
                      <span className="line-clamp-1">{h}</span>
                    </li>
                  ))}
                  {artist.highlights.length > 2 && (
                    <li className="text-xs text-gray-600">
                      +{artist.highlights.length - 2} more highlights
                    </li>
                  )}
                </ul>
              )}

              {/* Footer actions */}
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <span className="text-xs text-gray-600 font-mono">ID: {artist.id}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditArtist(artist)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(artist)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ArtistsSection;
