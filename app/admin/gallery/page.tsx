'use client';

import React from 'react';
import GallerySection from '../../../components/admin/GallerySection';

export default function AdminGalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white uppercase">Gallery</h1>
        <p className="text-gray-400 text-sm mt-1">Upload and manage portfolio images shown on the public gallery.</p>
      </div>

      <GallerySection />
    </div>
  );
}
