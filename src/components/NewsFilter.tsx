import React from 'react';
import type { NewsCategory } from '../types';

type FilterValue = 'all' | NewsCategory;

type FilterItem = {
  value: FilterValue;
  label: string;
};

type Props = {
  items: FilterItem[];
  active: FilterValue;
  onChange: (value: FilterValue) => void;
};

export default function NewsFilter({ items, active, onChange }: Props) {
  return (
    <div className="flex justify-center gap-4 mt-8 flex-wrap">
      {items.map((item) => {
        const isActive = item.value === active;

        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={[
              'px-6 py-2 rounded-full border text-sm font-medium transition-colors',
              isActive
                ? 'bg-emerald-900 text-white border-emerald-900'
                : 'border-emerald-900/20 text-emerald-900 hover:bg-emerald-900 hover:text-white',
            ].join(' ')}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}