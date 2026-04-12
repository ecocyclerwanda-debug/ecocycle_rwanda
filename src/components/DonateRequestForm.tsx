import React, { useState } from 'react';

type Props = {
  t: any;
};

export default function DonateRequestForm({ t }: Props) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState('');

  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessageText('');

    if (!endpoint) {
      setMessageText('Missing VITE_FORMSPREE_ENDPOINT in .env.local');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          subject: 'New donation request from website',
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          interest: form.interest,
          message: form.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send donation request.');
      }

      setMessageText('Donation request sent successfully.');
      setForm({
        fullName: '',
        email: '',
        phone: '',
        interest: '',
        message: '',
      });
    } catch (error) {
      setMessageText(
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder={t.donate.fullName}
        className="w-full px-6 py-4 rounded-xl border border-emerald-900/10 focus:outline-none focus:border-emerald-500"
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder={t.donate.email}
        className="w-full px-6 py-4 rounded-xl border border-emerald-900/10 focus:outline-none focus:border-emerald-500"
      />
      <input
        type="tel"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder={t.donate.phone}
        className="w-full px-6 py-4 rounded-xl border border-emerald-900/10 focus:outline-none focus:border-emerald-500"
      />
      <input
        type="text"
        name="interest"
        value={form.interest}
        onChange={handleChange}
        placeholder={t.donate.supportText}
        className="w-full px-6 py-4 rounded-xl border border-emerald-900/10 focus:outline-none focus:border-emerald-500"
      />
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder={t.donate.interests}
        rows={4}
        className="w-full px-6 py-4 rounded-xl border border-emerald-900/10 focus:outline-none focus:border-emerald-500"
      />
      <button
        className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-800 transition-colors disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Sending...' : t.donate.donateNow}
      </button>

      {messageText && <p className="text-sm text-slate-600">{messageText}</p>}
    </form>
  );
}