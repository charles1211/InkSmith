import React from 'react';

const styles: Record<string, string> = {
  Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  Confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Completed: 'bg-green-500/10 text-green-500 border-green-500/20',
  Cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${styles[status] || styles.Pending}`}
  >
    {status}
  </span>
);

export default StatusBadge;
