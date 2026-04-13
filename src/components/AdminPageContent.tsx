import React, { useEffect, useState } from 'react';
import AdminAuthPanel from './AdminAuthPanel';
import AdminNewsPanel from './AdminNewsPanel';
import AdminLeadersPanel from './AdminLeadersPanel';
import AdminServicesPanel from './AdminServicesPanel';
import AdminProjectsPanel from './AdminProjectsPanel';
import AdminPartnersPanel from './AdminPartnersPanel';
import AdminProductsPanel from './AdminProductsPanel';
import AdminImpactsPanel from './AdminImpactsPanel';
import { getCurrentAdmin } from '../lib/appwrite';
import type { NewsCategory } from '../types';

type Props = {
  t: any;
};

export default function AdminPageContent({ t }: Props) {
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      const user = await getCurrentAdmin();
      setAdminEmail(user?.email ?? null);
    };
    check();
  }, []);

  const categoryLabels: Record<NewsCategory, string> = {
    training: t.news.categories[1],
    projects: t.news.categories[2],
    impact: t.news.categories[3],
    media: t.news.categories[4],
  };

  return (
    <div className="pb-24">
      <section className="bg-[#fcfcf7] py-24 border-b border-emerald-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-emerald-900 mb-6">Admin Panel</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Manage website content from one secure place.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AdminAuthPanel
          currentAdminEmail={adminEmail}
          onLoggedIn={setAdminEmail}
          onLoggedOut={() => setAdminEmail(null)}
        />

        {adminEmail ? (
          <div className="space-y-16">
            <AdminNewsPanel labels={categoryLabels} isLoggedIn={true} />
            <AdminLeadersPanel isLoggedIn={true} />
            <AdminServicesPanel isLoggedIn={true} />
            <AdminProjectsPanel isLoggedIn={true} />
            <AdminPartnersPanel isLoggedIn={true} />
            <AdminProductsPanel isLoggedIn={true} />
            <AdminImpactsPanel isLoggedIn={true} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-emerald-900/10 shadow-sm p-8 text-slate-600">
            Sign in first to see upload tools.
          </div>
        )}
      </section>
    </div>
  );
}