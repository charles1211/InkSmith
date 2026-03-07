import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-ink-900 border border-white/5 p-6 rounded-xl">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-ink-accent/10 rounded-lg">
        <Icon className="w-6 h-6 text-ink-accent" />
      </div>
      {trend && (
        <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded">
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-1">{title}</h3>
    <p className="text-2xl font-serif font-bold text-white">{value}</p>
  </div>
);

export default StatCard;
