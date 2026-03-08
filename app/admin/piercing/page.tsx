'use client';

import React from 'react';
import PiercingImages from '../../../components/admin/piercingImages';

export default function AdminPiercingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white uppercase">Piercing Images</h1>
        <p className="text-gray-400 text-sm mt-1">Upload and manage piercing reference photos.</p>
      </div>

      <PiercingImages />
    </div>
  );
}
