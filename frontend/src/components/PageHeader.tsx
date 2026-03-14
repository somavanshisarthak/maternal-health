import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-1 inline-flex items-center justify-center p-2 rounded-full bg-teal-50 text-teal-700">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

