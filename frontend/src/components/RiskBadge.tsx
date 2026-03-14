import React from 'react';

import type { RiskLevel } from '../hooks/usePatients';

interface RiskBadgeProps {
  risk: RiskLevel | undefined;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ risk }) => {
  if (!risk) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
        No data
      </span>
    );
  }

  const normalized = risk as string;

  const colorClasses =
    normalized === 'Red'
      ? 'bg-red-100 text-red-700'
      : normalized === 'Yellow'
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-green-100 text-green-700';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colorClasses}`}
    >
      <span className="w-2 h-2 rounded-full bg-current mr-1.5" />
      {normalized}
    </span>
  );
};

