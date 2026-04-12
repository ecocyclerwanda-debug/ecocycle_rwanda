import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Language } from '../i18n';
import type { NewsCategory, NewsItem } from '../types';
import { startNewsPolling } from '../services/newsService';
import NewsFilter from './NewsFilter';
import NewsCard from './NewsCard';

type Props = {
  t: any;
  language: Language;
};

type FilterValue = 'all' | NewsCategory;

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

export default function NewsPageContent({ t, language }: Props) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const stop = startNewsPolling(
      (news) => {
        setItems(news);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return stop;
  }, []);

  const categoryLabels: Record<NewsCategory, string> = {
    training: t.news.categories[1],
    projects: t.news.categories[2],
    impact: t.news.categories[3],
    media: t.news.categories[4],
  };

  const filterItems = [
    { value: 'all' as const, label: t.news.categories[0] },
    { value: 'training' as const, label: t.news.categories[1] },
    { value: 'projects' as const, label: t.news.categories[2] },
    { value: 'impact' as const, label: t.news.categories[3] },
    { value: 'media' as const, label: t.news.categories[4] },
  ];

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return items;
    return items.filter((item) => item.category === activeFilter);
  }, [activeFilter, items]);

  if (selectedNews) {
    const text = getLocalizedText(selectedNews, language);

    return (
      <div className="pb-24">
        <section className="bg-[#fcfcf7] py-24 border-b border-emerald-900/5">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSelectedNews(null)}
              className="mb-8 inline-flex items-center gap-2 text-emerald-900 font-bold hover:text-emerald-500"
            >
              <ArrowLeft size={18} />
              Back to news
            </button>

            <div className="text-xs text-emerald-500 font-bold uppercase mb-3">
              {categoryLabels[selectedNews.category]} • {formatDate(selectedNews.date)}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-6">
              {text.title}
            </h1>

            <p className="text-xl text-slate-600 max-w-3xl">
              {text.summary}
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-3xl overflow-hidden mb-10">
            <img
              src={selectedNews.imageUrl}
              alt={text.title}
              className="w-full h-auto object-cover"
            />
          </div>

          <article className="prose prose-lg max-w-none text-slate-700 whitespace-pre-line">
            {text.content}
          </article>
        </section>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <section className="bg-[#fcfcf7] py-24 border-b border-emerald-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-emerald-900 mb-6">{t.news.title}</h1>

          <NewsFilter
            items={filterItems}
            active={activeFilter}
            onChange={setActiveFilter}
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {loading ? (
          <div className="text-slate-500">Loading news...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-slate-500">No news found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredItems.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                language={language}
                categoryLabel={categoryLabels[item.category]}
                readMoreLabel={t.common.readMore}
                onReadMore={setSelectedNews}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}