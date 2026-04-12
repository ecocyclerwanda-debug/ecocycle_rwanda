import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { Language } from '../i18n';
import type { NewsItem } from '../types';

type Props = {
  item: NewsItem;
  language: Language;
  categoryLabel: string;
  readMoreLabel: string;
  onReadMore: (item: NewsItem) => void;
};

function formatDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString();
}

function getLocalizedText(item: NewsItem, language: Language) {
  const current = item.translations[language];
  const fallback = item.translations.en;

  return {
    title: current.title || fallback.title,
    summary: current.summary || fallback.summary,
    content: current.content || fallback.content,
  };
}

export default function NewsCard({
  item,
  language,
  categoryLabel,
  readMoreLabel,
  onReadMore,
}: Props) {
  const text = getLocalizedText(item, language);

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-900/5 group">
      <div className="aspect-video overflow-hidden">
        <img
          src={item.imageUrl}
          alt={text.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-8">
        <div className="text-xs text-emerald-500 font-bold uppercase mb-3">
          {categoryLabel} • {formatDate(item.date)}
        </div>

        <h3 className="text-2xl font-bold text-emerald-900 mb-4">
          {text.title}
        </h3>

        <p className="text-slate-600 text-sm mb-6 line-clamp-3">
          {text.summary}
        </p>

        <button
          onClick={() => onReadMore(item)}
          className="text-emerald-900 font-bold flex items-center gap-2 hover:text-emerald-500"
        >
          {readMoreLabel} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}