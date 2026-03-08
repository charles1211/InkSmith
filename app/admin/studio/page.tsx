'use client';

import React from 'react';
import StudioImages from '../../../components/admin/StudioImages';

export default function AdminStudioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white uppercase">Studio Images</h1>
        <p className="text-gray-400 text-sm mt-1">Upload and manage photos of your studio space.</p>
      </div>

      <StudioImages />
    </div>
  );
}
