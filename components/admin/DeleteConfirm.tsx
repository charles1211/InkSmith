import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmProps {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({ name, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-ink-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
      <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Trash2 className="w-7 h-7 text-red-400" />
      </div>
      <h3 className="text-xl font-serif font-bold text-white mb-2">Remove Artist?</h3>
      <p className="text-gray-400 text-sm mb-6">
        <span className="text-white font-bold">{name}</span> will be permanently removed from the
        roster.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 border border-white/10 text-gray-400 font-bold rounded-lg hover:text-white hover:border-white/30 transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-lg hover:bg-red-400 transition-colors text-sm"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirm;
