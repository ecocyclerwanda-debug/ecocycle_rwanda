import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Language } from '../i18n';
import type { NewsCategory, NewsItem, Page } from '../types';
import { startNewsPolling } from '../services/newsService';

type Props = {
  t: any;
  language: Language;
  setCurrentPage: (page: Page) => void;
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
  };
}

export default function HomeNewsSection({ t, language, setCurrentPage }: Props) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  const visibleNews = useMemo(() => {
    const featured = items.filter((item) => item.featured);
    if (featured.length >= 3) return featured.slice(0, 3);
    return items.slice(0, 3);
  }, [items]);

  const categoryLabels: Record<NewsCategory, string> = {
    training: t.news.categories[1],
    projects: t.news.categories[2],
    impact: t.news.categories[3],
    media: t.news.categories[4],
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <span className="text-emerald-500 font-bold tracking-widest uppercase text-sm mb-4 block">
            {t.common.latestUpdates}
          </span>
          <h2 className="text-5xl font-bold text-emerald-900">{t.home.newsTitle}</h2>
        </div>

        <button
          onClick={() => setCurrentPage('news')}
          className="hidden md:flex items-center gap-3 text-emerald-900 font-bold hover:text-emerald-500 group"
        >
          {t.common.exploreAllNews}
          <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading latest news...</div>
      ) : visibleNews.length === 0 ? (
        <div className="text-slate-500">No news published yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {visibleNews.map((item) => {
            const text = getLocalizedText(item, language);

            return (
              <div
                key={item.id}
                onClick={() => setCurrentPage('news')}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 relative">
                  <img
                    src={item.imageUrl}
                    alt={text.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <span className="text-white font-bold flex items-center gap-2">
                      {t.common.readMore} <ArrowRight size={18} />
                    </span>
                  </div>

                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-emerald-900 text-xs font-bold shadow-lg">
                    {categoryLabels[item.category]} • {formatDate(item.date)}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-emerald-900 mb-4 group-hover:text-emerald-500 transition-colors leading-tight">
                  {text.title}
                </h3>

                <p className="text-slate-500 leading-relaxed line-clamp-2">
                  {text.summary}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => setCurrentPage('news')}
        className="md:hidden mt-12 w-full py-5 bg-emerald-900 text-white rounded-2xl font-bold"
      >
        {t.common.viewAllNews}
      </button>
    </section>
  );
}