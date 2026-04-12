import React, { useState } from 'react';

type Props = {
  t: any;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialData: FormData = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export default function ContactForm({ t }: Props) {
  const [form, setForm] = useState<FormData>(initialData);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState('');

  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback('');

    if (!endpoint) {
      setFeedback('Missing VITE_FORMSPREE_ENDPOINT in .env.local');
      return;
    }

    try {
      setSending(true);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message.');
      }

      setForm(initialData);
      setFeedback('Your message has been sent successfully.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to send message.';
      setFeedback(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white p-12 rounded-3xl shadow-sm border border-emerald-900/5">
      <h3 className="text-2xl font-bold text-emerald-900 mb-8">
        {t.contact.formTitle}
      </h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder={t.contact.yourName}
          required
          className="px-6 py-4 rounded-xl border border-emerald-900/10 focus:outline-none focus:border-emerald-500"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder={t.contact.yourEmail}
          required
          className="px-6 py-4 rounded-xl border border-emerald-900/10 focus:outline-none focus:border-emerald-500"
        />

        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder={t.contact.phoneNumber}
          className="md:col-span-2 px-6 py-4 rounded-xl border border-emerald-900/10 focus:outline-none focus:border-emerald-500"
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder={t.contact.yourMessage}
          rows={6}
          required
          className="md:col-span-2 px-6 py-4 rounded-xl border border-emerald-900/10 focus:outline-none focus:border-emerald-500"
        />

        <button
          type="submit"
          disabled={sending}
          className="md:col-span-2 bg-emerald-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-800 transition-colors disabled:opacity-60"
        >
          {sending ? 'Sending...' : t.common.sendMessage}
        </button>
      </form>

      {feedback && <p className="mt-4 text-sm text-slate-600">{feedback}</p>}
    </div>
  );
}