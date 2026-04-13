/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Sprout,
  Recycle,
  Heart,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  Globe,
  Award,
  Zap,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Twitter,
  Package,
  CheckCircle,
  PlayCircle,
  ExternalLink,
  Youtube,
  Leaf,
  Trees,
  Beef,
  Factory,
  Wrench,
  ShieldCheck,
  ShoppingBag,
  Flower2,
} from 'lucide-react';
import {
  Page,
  NavItem,
  LeaderItem,
  ServiceItem,
  ProjectItem,
  PartnerItem,
  ImpactStoryItem,
} from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import SplashScreen from './components/SplashScreen';
import LanguageSelector from './components/LanguageSelector';
import HomeNewsSection from './components/HomeNewsSection';
import NewsPageContent from './components/NewsPageContent';
import ContactForm from './components/ContactForm';
import DonateRequestForm from './components/DonateRequestForm';
import AdminPageContent from './components/AdminPageContent';
import { startLeadersPolling } from './services/leadersService';
import { startServicesPolling } from './services/servicesService';
import { startProjectsPolling } from './services/projectsService';
import { startPartnersPolling } from './services/partnersService';
import { startImpactStoriesPolling } from './services/impactsService';
import { translations, type Language } from './i18n';

import logoImg from './assets/logo.png';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type T = (typeof translations)[Language];
const YOUTUBE_URL = 'https://www.youtube.com/@EcoCycleRwanda';

function getLocalizedLeader(item: LeaderItem, language: Language) {
  const current = item.translations[language];
  const fallback = item.translations.en;

  return {
    role: current.role || fallback.role,
    bio: current.bio || fallback.bio,
  };
}

function getLocalizedService(item: ServiceItem, language: Language) {
  const current = item.translations[language];
  const fallback = item.translations.en;

  return {
    title: current.title || fallback.title,
    subtitle: current.subtitle || fallback.subtitle,
    description: current.description || fallback.description,
    features: current.features.length ? current.features : fallback.features,
    outcomes: current.outcomes.length ? current.outcomes : fallback.outcomes,
  };
}

function getLocalizedProject(item: ProjectItem, language: Language) {
  const current = item.translations[language];
  const fallback = item.translations.en;

  return {
    title: current.title || fallback.title,
    goal: current.goal || fallback.goal,
    impact: current.impact || fallback.impact,
    activities: current.activities || fallback.activities,
  };
}

function getLocalizedPartner(item: PartnerItem, language: Language) {
  const current = item.translations[language];
  const fallback = item.translations.en;

  return {
    description: current.description || fallback.description,
  };
}

function getLocalizedImpact(item: ImpactStoryItem, language: Language) {
  const current = item.translations[language];
  const fallback = item.translations.en;

  return {
    role: current.role || fallback.role,
    quote: current.quote || fallback.quote,
  };
}

const TopBar = ({ t }: { t: T }) => {
  return (
    <div className="bg-emerald-900 text-white py-2 border-b border-white/10 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs font-medium">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-emerald-400" />
            <a href="mailto:ecocyclerwandaltd@gmail.com" className="hover:text-emerald-400 transition-colors">
              {t.topbar.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-emerald-400" />
            <a href="tel:+250788963938" className="hover:text-emerald-400 transition-colors">
              {t.topbar.phone}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={14} className="text-emerald-400" />
            <a
              href="https://wa.me/250788963938"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors"
            >
              {t.topbar.whatsapp}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-white/60">{t.common.followUs}</span>
          <a href="https://www.facebook.com/EcoCycleRwanda" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
            <Facebook size={14} />
          </a>
          <a href="https://www.instagram.com/ecocyclerwanda" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
            <Instagram size={14} />
          </a>
          <a href="https://www.linkedin.com/company/ecocyclerwanda" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
            <Linkedin size={14} />
          </a>
          <a href="https://x.com/EcoCycleRwanda" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
            <Twitter size={14} />
          </a>
          <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
            <Youtube size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({
  currentPage,
  setCurrentPage,
  t,
  language,
  setLanguage,
}: {
  currentPage: Page;
  setCurrentPage: (p: Page) => void;
  t: T;
  language: Language;
  setLanguage: (l: Language) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  const navItems: NavItem[] = [
    { label: t.nav.home, id: 'home' },
    { label: t.nav.about, id: 'about' },
    { label: t.nav.services, id: 'services' },
    { label: t.nav.products, id: 'products' },
    { label: t.nav.projects, id: 'projects' },
    { label: t.nav.impact, id: 'impact' },
    { label: t.nav.partners, id: 'partners' },
    { label: t.nav.news, id: 'news' },
    { label: t.nav.donate, id: 'donate' },
    { label: t.nav.contact, id: 'contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#fcfcf7]/90 backdrop-blur-md border-b border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => {
              const next = logoClicks + 1;
              if (next >= 5) {
                setCurrentPage('admin');
                setLogoClicks(0);
              } else {
                setCurrentPage('home');
                setLogoClicks(next);
                window.setTimeout(() => setLogoClicks(0), 2000);
              }
            }}
          >
            <img
              src={logoImg}
              alt="EcoCycle Rwanda Logo"
              className="h-16 w-auto group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-emerald-500',
                  currentPage === item.id
                    ? 'text-emerald-900 border-b-2 border-emerald-900'
                    : 'text-slate-600'
                )}
              >
                {item.label}
              </button>
            ))}

            <div className="flex items-center gap-1 border border-emerald-900/15 rounded-xl p-1">
              {(['en', 'rw', 'fr'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={cn(
                    'px-2 py-1 text-xs rounded-lg font-bold',
                    language === l
                      ? 'bg-emerald-900 text-white'
                      : 'text-emerald-900 hover:bg-emerald-50'
                  )}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage('contact')}
              className="bg-emerald-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-md"
            >
              {t.common.getInTouch}
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#fcfcf7] border-b border-emerald-900/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'block w-full text-left px-3 py-4 text-base font-medium rounded-md',
                    currentPage === item.id
                      ? 'bg-emerald-900/10 text-emerald-900'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {item.label}
                </button>
              ))}

              <div className="flex justify-center gap-2 py-4 border-t border-emerald-900/5 mt-4">
                {(['en', 'rw', 'fr'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={cn(
                      'px-3 py-2 text-sm rounded-lg font-bold',
                      language === l
                        ? 'bg-emerald-900 text-white'
                        : 'border border-emerald-900/15 text-emerald-900'
                    )}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex justify-center gap-8 py-6 border-t border-emerald-900/5 mt-4">
                <a href="https://www.facebook.com/EcoCycleRwanda" target="_blank" rel="noopener noreferrer" className="text-emerald-900 hover:text-emerald-500 transition-colors"><Facebook size={24} /></a>
                <a href="https://www.instagram.com/ecocyclerwanda" target="_blank" rel="noopener noreferrer" className="text-emerald-900 hover:text-emerald-500 transition-colors"><Instagram size={24} /></a>
                <a href="https://www.linkedin.com/company/ecocyclerwanda" target="_blank" rel="noopener noreferrer" className="text-emerald-900 hover:text-emerald-500 transition-colors"><Linkedin size={24} /></a>
                <a href="https://x.com/EcoCycleRwanda" target="_blank" rel="noopener noreferrer" className="text-emerald-900 hover:text-emerald-500 transition-colors"><Twitter size={24} /></a>
                <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-900 hover:text-emerald-500 transition-colors"><Youtube size={24} /></a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = ({
  setCurrentPage,
  t,
}: {
  setCurrentPage: (p: Page) => void;
  t: T;
}) => {
  return (
    <footer className="bg-emerald-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <img
                src={logoImg}
                alt="EcoCycle Rwanda Logo"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/EcoCycleRwanda" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-emerald-500 transition-colors"><Facebook size={18} /></a>
              <a href="https://www.instagram.com/ecocyclerwanda" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-emerald-500 transition-colors"><Instagram size={18} /></a>
              <a href="https://www.linkedin.com/company/ecocyclerwanda" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-emerald-500 transition-colors"><Linkedin size={18} /></a>
              <a href="https://x.com/EcoCycleRwanda" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-emerald-500 transition-colors"><Twitter size={18} /></a>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-emerald-500 transition-colors"><Youtube size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">{t.footer.quickLinks}</h4>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li><button onClick={() => setCurrentPage('about')} className="hover:text-emerald-400 transition-colors">{t.nav.about}</button></li>
              <li><button onClick={() => setCurrentPage('services')} className="hover:text-emerald-400 transition-colors">{t.nav.services}</button></li>
              <li><button onClick={() => setCurrentPage('products')} className="hover:text-emerald-400 transition-colors">{t.nav.products}</button></li>
              <li><button onClick={() => setCurrentPage('projects')} className="hover:text-emerald-400 transition-colors">{t.nav.projects}</button></li>
              <li><button onClick={() => setCurrentPage('donate')} className="hover:text-emerald-400 transition-colors">{t.nav.donate}</button></li>
              <li><button onClick={() => setCurrentPage('contact')} className="hover:text-emerald-400 transition-colors">{t.nav.contact}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">{t.footer.contactInfo}</h4>
            <ul className="space-y-4 text-slate-300 text-sm">
              <li className="flex gap-3 items-start"><MapPin size={18} className="text-emerald-400 shrink-0" /><span>{t.footer.address}</span></li>
              <li className="flex gap-3 items-center"><Phone size={18} className="text-emerald-400 shrink-0" /><a href="tel:+250788963938" className="hover:text-emerald-400 transition-colors">{t.topbar.phone}</a></li>
              <li className="flex gap-3 items-center"><MessageCircle size={18} className="text-emerald-400 shrink-0" /><a href="https://wa.me/250788963938" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">{t.footer.whatsappUs}</a></li>
              <li className="flex gap-3 items-center"><Mail size={18} className="text-emerald-400 shrink-0" /><span>{t.topbar.email}</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">{t.footer.newsletter}</h4>
            <p className="text-slate-300 text-sm mb-4">{t.footer.newsletterText}</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder={t.footer.yourEmail}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
          <p>© {new Date().getFullYear()} EcoCycle Rwanda. {t.footer.rights}</p>
          <p>{t.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
};

const HomePage = ({
  setCurrentPage,
  t,
  language,
}: {
  setCurrentPage: (p: Page) => void;
  t: T;
  language: Language;
}) => {
  const stats = [
    { label: t.home.stats.soil, value: '500+' },
    { label: t.home.stats.youth, value: '800+' },
    { label: t.home.stats.women, value: '600+' },
    { label: t.home.stats.pwd, value: '150+' },
  ];

  const services = [
    { title: t.home.services.crop, icon: <Sprout className="w-8 h-8" /> },
    { title: t.home.services.livestock, icon: <Users className="w-8 h-8" /> },
    { title: t.home.services.compost, icon: <Recycle className="w-8 h-8" /> },
    { title: t.home.services.circular, icon: <Globe className="w-8 h-8" /> },
    { title: t.home.services.empowerment, icon: <Heart className="w-8 h-8" /> },
    { title: t.home.services.inclusion, icon: <Award className="w-8 h-8" /> },
  ];

  return (
    <div className="space-y-24 pb-24">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80&w=1920"
            alt="Lush Rwandan Landscape"
            className="w-full h-full object-cover brightness-[0.45] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/60 via-transparent to-emerald-900/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="max-w-5xl mx-auto flex flex-col items-center"
          >
            <span className="inline-block px-6 py-2 bg-emerald-400/20 backdrop-blur-xl border border-emerald-400/30 rounded-full text-emerald-300 text-sm font-black tracking-[0.3em] uppercase mb-12">
              {t.home.badge}
            </span>

            <div className="space-y-2 md:space-y-4">
              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter text-white drop-shadow-2xl">
                {t.home.hero1}
              </h1>
              <h2 className="text-2xl md:text-4xl font-black leading-tight tracking-tight text-emerald-300 drop-shadow-xl">
                {t.home.hero2}
              </h2>
              <h3 className="text-lg md:text-2xl font-bold leading-tight tracking-normal text-emerald-100/80">
                {t.home.hero3}
              </h3>
            </div>

            <p className="text-lg md:text-xl mt-10 text-slate-100 font-light max-w-2xl leading-relaxed drop-shadow-lg">
              {t.home.heroText}
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <button
                onClick={() => setCurrentPage('products')}
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-12 py-6 rounded-2xl font-black text-lg transition-all flex items-center gap-3 shadow-2xl group"
              >
                {t.common.ourProducts}
                <Package size={24} className="group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => setCurrentPage('about')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/30 px-12 py-6 rounded-2xl font-black text-lg transition-all flex items-center gap-3 group"
              >
                {t.common.aboutUs}
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-10 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50"
            >
              <div className="text-5xl font-bold text-emerald-900 mb-3">{stat.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-emerald-500 font-bold tracking-widest uppercase text-sm mb-4 block">
                {t.common.whatWeDo}
              </span>
              <h2 className="text-5xl font-bold text-emerald-900 leading-tight">
                {t.home.servicesTitle}
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('services')}
              className="px-8 py-4 bg-emerald-900/5 text-emerald-900 rounded-2xl font-bold hover:bg-emerald-900 hover:text-white transition-all flex items-center gap-2"
            >
              {t.common.viewAllServices} <ChevronRight size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-[#fcfcf7] p-10 rounded-[2.5rem] border border-emerald-900/5 hover:bg-white hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-16 h-16 bg-emerald-900 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-4">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-8">{t.home.serviceText}</p>
                <div className="w-12 h-1 bg-emerald-400/30 group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <HomeNewsSection t={t} language={language} setCurrentPage={setCurrentPage} />
    </div>
  );
};

const AboutPage = ({
  t,
  language,
}: {
  t: T;
  language: Language;
}) => {
  const [leaders, setLeaders] = useState<LeaderItem[]>([]);

  useEffect(() => {
    const stop = startLeadersPolling((items) => {
      setLeaders(items.filter((item) => item.active));
    });
    return stop;
  }, []);

  return (
    <div className="pb-24">
      <section className="relative h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1920"
            alt="About Us"
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-5xl font-bold">{t.about.title}</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-emerald-900 mb-4">{t.about.vision}</h2>
              <p className="text-xl text-slate-600 italic leading-relaxed">{t.about.visionText}</p>
            </div>
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-emerald-900 mb-4">{t.about.mission}</h2>
              <p className="text-lg text-slate-600 leading-relaxed">{t.about.missionText}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {t.about.values.map((val) => (
                <div key={val} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="font-medium text-slate-700">{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=1000"
              alt="Team"
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-8 -left-8 bg-emerald-900 text-white p-8 rounded-3xl shadow-xl hidden md:block">
              <div className="text-3xl font-bold mb-1">{t.about.registered}</div>
              <div className="text-emerald-300 text-sm">{t.about.official}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-emerald-900/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-emerald-900 mb-4">{t.about.leadership}</h2>
            <p className="text-slate-500">{t.about.leadershipText}</p>
          </div>

          {leaders.length === 0 ? (
            <div className="text-center text-slate-500 mb-12">No leaders added yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {leaders.map((member) => {
                const text = getLocalizedLeader(member, language);

                return (
                  <div
                    key={member.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-900/5 group hover:shadow-xl transition-all duration-500"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-emerald-900 mb-1">{member.name}</h3>
                      <div className="text-emerald-500 font-medium mb-4">{text.role}</div>
                      <p className="text-slate-600 text-sm leading-relaxed">{text.bio}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const ServicesPage = ({
  setCurrentPage,
  setSelectedService,
  t,
  language,
}: {
  setCurrentPage: (p: Page) => void;
  setSelectedService: (service: ServiceItem | null) => void;
  t: T;
  language: Language;
}) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stop = startServicesPolling(
      (items) => {
        setServices(items.filter((item) => item.active));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return stop;
  }, []);

  return (
    <div className="pb-24">
      <section className="bg-emerald-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">{t.servicesPage.title}</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            {t.servicesPage.subtitle}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {loading ? (
          <div className="text-center text-slate-500">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="text-center text-slate-500">No services added yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {services.map((service) => {
              const text = getLocalizedService(service, language);

              return (
                <div
                  key={service.id}
                  className="bg-white p-10 rounded-3xl shadow-sm border border-emerald-900/5 hover:shadow-xl transition-shadow"
                >
                  <div className="mb-6">
                    <img
                      src={service.imageUrl}
                      alt={text.title}
                      className="w-full h-52 object-cover rounded-2xl"
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-emerald-900 mb-4">
                    {text.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed mb-8">
                    {text.subtitle}
                  </p>

                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setCurrentPage('service-detail');
                    }}
                    className="text-emerald-900 font-semibold flex items-center gap-2 hover:text-emerald-500 transition-colors"
                  >
                    {t.common.learnMore} <ArrowRight size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

const DynamicServiceDetailPage = ({
  service,
  setCurrentPage,
  t,
  language,
}: {
  service: ServiceItem | null;
  setCurrentPage: (p: Page) => void;
  t: T;
  language: Language;
}) => {
  if (!service) {
    return (
      <div className="py-24 text-center text-slate-500">
        No service selected.
      </div>
    );
  }

  const text = getLocalizedService(service, language);

  return (
    <div className="pb-24">
      <section className="relative h-[45vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={service.imageUrl}
            alt={text.title}
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <button
            onClick={() => setCurrentPage('services')}
            className="mb-8 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 rounded-xl transition-colors"
          >
            {t.common.backToServices}
          </button>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{text.title}</h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-3xl">
            {text.subtitle}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-emerald-900/5 p-10">
            <h2 className="text-3xl font-bold text-emerald-900 mb-6">{t.common.overview}</h2>
            <p className="text-slate-700 text-lg leading-relaxed mb-10">{text.description}</p>

            <h3 className="text-2xl font-bold text-emerald-900 mb-5">{t.common.whatWeOffer}</h3>
            <div className="space-y-4 mb-12">
              {text.features.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-emerald-500 mt-1 shrink-0" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <h3 className="text-2xl font-bold text-emerald-900 mb-5">{t.common.expectedOutcomes}</h3>
            <div className="space-y-4">
              {text.outcomes.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-emerald-500 mt-1 shrink-0" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#fcfcf7] rounded-3xl border border-emerald-900/10 p-8">
              <h3 className="text-2xl font-bold text-emerald-900 mb-4">{t.common.needThisService}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {t.contact.subtitle}
              </p>
              <button
                onClick={() => setCurrentPage('contact')}
                className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold hover:bg-emerald-800 transition-colors"
              >
                {t.common.requestThisService}
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-emerald-900/5 p-8">
              <h3 className="text-xl font-bold text-emerald-900 mb-4">{t.common.whyItMatters}</h3>
              <p className="text-slate-600 leading-relaxed">{t.products.impactText}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProjectsPage = ({
  t,
  language,
  setCurrentPage,
}: {
  t: T;
  language: Language;
  setCurrentPage: (p: Page) => void;
}) => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stop = startProjectsPolling(
      (items) => {
        setProjects(items.filter((item) => item.active));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return stop;
  }, []);

  return (
    <div className="pb-24">
      <section className="bg-[#fcfcf7] py-24 border-b border-emerald-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-emerald-900 mb-6">{t.projects.title}</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">{t.projects.subtitle}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-24">
        {loading ? (
          <div className="text-center text-slate-500">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-slate-500">No projects added yet.</div>
        ) : (
          projects.map((project, idx) => {
            const text = getLocalizedProject(project, language);

            return (
              <div key={project.id} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className={cn(idx % 2 !== 0 && 'lg:order-2')}>
                  <img src={project.imageUrl} alt={text.title} className="rounded-3xl shadow-2xl w-full h-auto object-cover" />
                </div>

                <div className={cn(idx % 2 !== 0 && 'lg:order-1')}>
                  <h2 className="text-4xl font-bold text-emerald-900 mb-6">{text.title}</h2>
                  <div className="space-y-6 mb-10">
                    <div>
                      <h4 className="text-emerald-500 font-semibold uppercase tracking-wider text-sm mb-1">{t.projects.goal}</h4>
                      <p className="text-slate-700 text-lg">{text.goal}</p>
                    </div>
                    <div>
                      <h4 className="text-emerald-500 font-semibold uppercase tracking-wider text-sm mb-1">{t.projects.impact}</h4>
                      <p className="text-slate-700 text-lg">{text.impact}</p>
                    </div>
                    <div>
                      <h4 className="text-emerald-500 font-semibold uppercase tracking-wider text-sm mb-1">{t.projects.activities}</h4>
                      <p className="text-slate-700 whitespace-pre-line">{text.activities}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentPage('donate')}
                    className="bg-emerald-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-800 transition-colors"
                  >
                    {t.projects.support}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

const ImpactPage = ({
  t,
  language,
}: {
  t: T;
  language: Language;
}) => {
  const [items, setItems] = useState<ImpactStoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stop = startImpactStoriesPolling(
      (data) => {
        setItems(data.filter((i) => i.active));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return stop;
  }, []);

  return (
    <div className="pb-24">
      <section className="bg-emerald-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">{t.impact.title}</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">{t.impact.subtitle}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {loading ? (
          <div className="text-center text-slate-500">Loading impact stories...</div>
        ) : items.length === 0 ? (
          <div className="text-center text-slate-500">No impact stories added yet.</div>
        ) : (
          <div className="bg-[#fcfcf7] rounded-3xl p-12 md:p-24 border border-emerald-900/10">
            <h2 className="text-3xl font-bold text-emerald-900 text-center mb-16">
              {t.impact.stories}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {items.map((item) => {
                const text = getLocalizedImpact(item, language);

                return (
                  <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-900/5">
                    <div className="aspect-video overflow-hidden">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-8">
                      <div className="text-emerald-500 mb-4">
                        <Heart size={32} />
                      </div>
                      <p className="text-lg text-slate-700 italic mb-6 leading-relaxed">
                        "{text.quote}"
                      </p>
                      <div className="font-bold text-emerald-900">{item.name}</div>
                      <div className="text-sm text-emerald-600 mb-4">{text.role}</div>

                      {item.videoUrl ? (
                        <a
                          href={item.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-emerald-900 text-white px-4 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors"
                        >
                          <PlayCircle size={18} />
                          Watch Video
                        </a>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-emerald-900 mb-12">{t.impact.model}</h2>
          <div className="max-w-4xl mx-auto aspect-[16/9] bg-white rounded-3xl border-2 border-dashed border-emerald-900/20 flex items-center justify-center">
            <div className="text-slate-400 flex flex-col items-center gap-4">
              <Recycle size={64} />
              <p className="text-xl italic">{t.impact.infographic}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const NewsPage = ({
  t,
  language,
}: {
  t: T;
  language: Language;
}) => {
  return <NewsPageContent t={t} language={language} />;
};

const DonatePage = ({ t }: { t: T }) => {
  return (
    <div className="pb-24">
      <section className="bg-emerald-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">{t.donate.title}</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">{t.donate.subtitle}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-emerald-900/5">
            <h2 className="text-3xl font-bold text-emerald-900 mb-8">{t.donate.donateNow}</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {t.donate.options.map((opt) => (
                <button
                  key={opt}
                  className="p-6 border-2 border-emerald-900/10 rounded-2xl text-left hover:border-emerald-500 hover:bg-emerald-500/5 transition-all group"
                >
                  <div className="font-bold text-emerald-900 group-hover:text-emerald-500 mb-1">
                    {opt}
                  </div>
                  <div className="text-xs text-slate-500">{t.donate.supportText}</div>
                </button>
              ))}
            </div>
            <p className="text-slate-600 leading-relaxed">
              Click below to send your donation request directly to our email, and we will guide you on how to donate.
            </p>
          </div>

          <div className="bg-[#fcfcf7] p-12 rounded-3xl border border-emerald-900/10">
            <h2 className="text-3xl font-bold text-emerald-900 mb-8">{t.donate.volunteerToday}</h2>
            <DonateRequestForm t={t} />
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductsPage = ({
  t,
  language,
  setCurrentPage,
}: {
  t: T;
  language: Language;
  setCurrentPage: (p: Page) => void;
}) => {
  const productIconMap = {
    0: <Sprout className="w-6 h-6" />,
    1: <Flower2 className="w-6 h-6" />,
    2: <Beef className="w-6 h-6" />,
    3: <Package className="w-6 h-6" />,
    4: <Recycle className="w-6 h-6" />,
    5: <Trees className="w-6 h-6" />,
    6: <Wrench className="w-6 h-6" />,
    7: <ShieldCheck className="w-6 h-6" />,
    8: <ShoppingBag className="w-6 h-6" />,
  };

  const productsContent = {
    en: {
      groups: [
        {
          title: 'Agricultural & Farming Products',
          subtitle:
            'From crop growing, irrigation, machinery services, and agronomy consulting.',
          items: [
            'Cereals (maize, wheat, sorghum, etc.)',
            'Rice (including organic rice)',
            'Legumes (beans, peas, soybeans)',
            'Oil seeds (sunflower, groundnuts, etc.)',
            'Vegetables (fresh and processed)',
            'Tropical fruits (bananas, mangoes, avocados, pineapples, papayas)',
            'Mushrooms',
            'Plant seedlings (for crops)',
            'Irrigated crops (high-yield produce)',
          ],
        },
        {
          title: 'Plant & Nursery Products',
          subtitle:
            'From plant growing, nurseries, forestry, and landscaping.',
          items: [
            'Ornamental plants (flowers, decorative plants)',
            'Tree seedlings (forest & non-forest)',
            'Turf/grass for landscaping',
            'Cuttings, slips, bulbs, tubers',
            'Reforestation seedlings',
            'Landscaping plants',
          ],
        },
        {
          title: 'Animal & Livestock Products',
          subtitle: 'From animal care and livestock production.',
          items: [
            'Live animals (cattle, goats, poultry, etc.)',
            'Milk and dairy products',
            'Meat and poultry products',
            'Eggs',
            'Animal breeding stock',
          ],
        },
        {
          title: 'Agro-Processing & Market-Ready Products',
          subtitle:
            'From crop preparation, cleaning, grading, and market packaging.',
          items: [
            'Cleaned and graded grains',
            'Packaged vegetables and fruits',
            'Processed agricultural produce (semi-processed)',
            'Sorted agricultural commodities ready for market',
          ],
        },
        {
          title: 'Recycling & Environmental Products',
          subtitle:
            'From waste recycling and environmental protection.',
          items: [
            'Recycled metal materials',
            'Recycled plastic materials',
            'Scrap materials (resale)',
            'Reusable spare parts',
            'Organic compost',
            'Biomass fuel',
          ],
        },
        {
          title: 'Environmental & Ecological Products',
          subtitle:
            'From land maintenance and environmental programmes.',
          items: [
            'Carbon credits (if projects qualify)',
            'Environmental restoration outputs',
            'Soil improvement products (compost, organic fertilizers)',
            'Tree planting packages',
          ],
        },
        {
          title: 'Technical & Consulting Products',
          subtitle:
            'Packaged technical, engineering, and consultancy solutions.',
          items: [
            'Environmental impact assessment reports',
            'Engineering design plans',
            'Agricultural consultancy packages',
            'Irrigation system designs',
            'Waste management plans',
            'Research reports',
            'Feasibility studies',
          ],
        },
        {
          title: 'Cleaning & Maintenance Products',
          subtitle:
            'Indirect products from industrial cleaning and maintenance support.',
          items: [
            'Cleaning solutions (if produced or resold)',
            'Waste collected and processed (recyclables)',
            'Maintenance service bundles',
          ],
        },
        {
          title: 'Trading & Wholesale Products',
          subtitle: 'From wholesale and retail activities.',
          items: [
            'Fertilizers',
            'Agrochemicals (pesticides, herbicides)',
            'Animal feed materials',
            'Agricultural inputs (tools, seeds)',
            'Fresh food products (meat, fish, dairy, bakery, etc.)',
          ],
        },
      ],
      highlightsTitle: 'Market Highlights',
      highlights: [
        'Diverse agricultural, nursery, livestock, and environmental products',
        'Products suitable for local, institutional, and export-oriented markets',
        'Strong alignment with sustainability, restoration, and circular economy goals',
        'Inclusive business model supporting youth, women, and persons with disabilities',
      ],
      buyerTitle: 'Looking for a trusted supplier?',
      buyerText:
        'Contact EcoCycle Rwanda to discuss product availability, bulk supply, partnerships, and customized buyer support.',
      buyerButton: 'Become a Buyer',
    },

    rw: {
      groups: [
        {
          title: 'Ibikomoka ku Buhinzi n’Ubworozi',
          subtitle:
            'Bikomoka ku buhinzi bw’ibihingwa, kuhira, imashini z’ubuhinzi, n’ubujyanama mu buhinzi.',
          items: [
            'Ibinyampeke (ibigori, ingano, amasaka, n’ibindi)',
            'Umuceri (harimo n’umuceri w’umwimerere)',
            'Ibinyamisogwe (ibishyimbo, amashaza, soya)',
            'Ibimera by’amavuta (izuba, ubunyobwa, n’ibindi)',
            'Imboga mbisi cyangwa zitunganyije',
            'Imbuto zo mu turere dushyuha (ibitoki, imyembe, avoka, inanasi, amapapayi)',
            'Ibihumyo',
            'Ingemwe z’ibihingwa',
            'Ibihingwa bihirwa bitanga umusaruro mwinshi',
          ],
        },
        {
          title: 'Ibikomoka muri Pepiniyeri n’Ibimera',
          subtitle:
            'Bikomoka ku bworozi bw’ibimera, pepiniyeri, amashyamba, n’imitako y’ahantu.',
          items: [
            'Ibimera by’imitako n’indabyo',
            'Ingemwe z’ibiti by’amashyamba n’ibitari ibyo mu mashyamba',
            'Ibyatsi byo gutaka ahantu',
            'Amashami, utubuto, ibijumba n’uduce tw’ibimera',
            'Ingemwe zo gusubiranya amashyamba',
            'Ibimera byo gutaka ahantu',
          ],
        },
        {
          title: 'Ibikomoka ku Matungo',
          subtitle: 'Bikomoka ku kwita ku matungo no kuyorora.',
          items: [
            'Amatungo mazima (inka, ihene, inkoko, n’ibindi)',
            'Amata n’ibiyakomokaho',
            'Inyama n’ibikomoka ku nkoko',
            'Amagi',
            'Amatungo yo kororoka',
          ],
        },
        {
          title: 'Ibikomoka ku Gutunganya Umusaruro no Kuwugeza ku Isoko',
          subtitle:
            'Bikomoka ku gutegura, gusukura, gutoranya no gupakira umusaruro.',
          items: [
            'Ibinyampeke byasukuwe kandi byatoranyijwe',
            'Imboga n’imbuto bipfunyitse neza',
            'Umusaruro w’ubuhinzi watunganyijwe igice',
            'Ibicuruzwa by’ubuhinzi byatoranyijwe biteguye isoko',
          ],
        },
        {
          title: 'Ibikomoka ku Isubiranyamikoreshereze n’Ibidukikije',
          subtitle:
            'Bikomoka ku kongera gukoresha imyanda no kurengera ibidukikije.',
          items: [
            'Ibyuma byongeye gukoreshwa',
            'Plastiki zongeye gukoreshwa',
            'Ibikoresho bishaje bigurishwa',
            'Ibice by’imodoka cyangwa ibindi bikoresho byongera gukoreshwa',
            'Ifumbire y’imborera',
            'Ibicanwa bya biomass',
          ],
        },
        {
          title: 'Ibikomoka ku Bidukikije no Gusana Isi',
          subtitle:
            'Bikomoka ku gufata neza ubutaka no kuri gahunda z’ibidukikije.',
          items: [
            'Carbon credits (aho bishoboka)',
            'Ibyavuye mu gusana ibidukikije',
            'Ibikoresho byongera uburumbuke bw’ubutaka',
            'Pakaje zo gutera ibiti',
          ],
        },
        {
          title: 'Ibicuruzwa by’Ubugeni n’Ubujyanama',
          subtitle:
            'Pakaje z’ibikorwa bya tekiniki, engineering, n’ubujyanama.',
          items: [
            'Raporo z’isuzuma ry’ingaruka ku bidukikije',
            'Igishushanyo mbonera cya engineering',
            'Pakaje z’ubujyanama mu buhinzi',
            'Igishushanyo cya gahunda zo kuhira',
            'Gahunda zo gucunga imyanda',
            'Raporo z’ubushakashatsi',
            'Inyigo zishoboka',
          ],
        },
        {
          title: 'Ibikomoka ku Isuku n’Ufashwe rwo Kubungabunga',
          subtitle:
            'Ibikomoka ku mirimo y’isuku n’ikorwa ry’ifashwe rya maintenance.',
          items: [
            'Imiti cyangwa ibisubizo by’isuku',
            'Imyanda yakusanyijwe ikanatunganywa',
            'Pakaje z’imirimo ya maintenance',
          ],
        },
        {
          title: 'Ibicuruzwa by’Ubucuruzi n’Igurisha ry’Igicuruzwa Cyinshi',
          subtitle: 'Bikomoka ku bucuruzi bwo kugurisha no kugurisha byinshi.',
          items: [
            'Ifumbire',
            'Imiti y’ubuhinzi',
            'Ibiryo by’amatungo',
            'Ibikoresho by’ubuhinzi (ibikoresho, imbuto)',
            'Ibikomoka ku biribwa bishya (inyama, amafi, amata, imigati, n’ibindi)',
          ],
        },
      ],
      highlightsTitle: 'Iby’ingenzi ku Isoko',
      highlights: [
        'Ibicuruzwa byinshi bitandukanye mu buhinzi, pepiniyeri, ubworozi n’ibidukikije',
        'Ibicuruzwa bikwiriye amasoko yo mu gihugu, ibigo, n’ayo kohereza hanze',
        'Bihuye n’intego zo kuramba, gusana ibidukikije, n’ubukungu buzenguruka',
        'Uburyo bw’ubucuruzi bushyigikira urubyiruko, abagore n’abafite ubumuga',
      ],
      buyerTitle: 'Urashaka ugutanga ibicuruzwa wizewe?',
      buyerText:
        'Vugana na EcoCycle Rwanda ku bijyanye n’ibicuruzwa bihari, kugura byinshi, ubufatanye, n’ubufasha bwihariye ku baguzi.',
      buyerButton: 'Ba Umuguzi',
    },

    fr: {
      groups: [
        {
          title: 'Produits Agricoles et de Production',
          subtitle:
            'Issus de la culture, de l’irrigation, des services de machines agricoles et du conseil agronomique.',
          items: [
            'Céréales (maïs, blé, sorgho, etc.)',
            'Riz (y compris riz biologique)',
            'Légumineuses (haricots, pois, soja)',
            'Oléagineux (tournesol, arachides, etc.)',
            'Légumes frais et transformés',
            'Fruits tropicaux (bananes, mangues, avocats, ananas, papayes)',
            'Champignons',
            'Plants agricoles',
            'Cultures irriguées à haut rendement',
          ],
        },
        {
          title: 'Produits de Pépinière et Végétaux',
          subtitle:
            'Issus des pépinières, de la foresterie et de l’aménagement paysager.',
          items: [
            'Plantes ornementales',
            'Plants d’arbres forestiers et non forestiers',
            'Gazon pour aménagement paysager',
            'Boutures, rejets, bulbes, tubercules',
            'Plants de reboisement',
            'Plantes de paysage',
          ],
        },
        {
          title: 'Produits Animaux et d’Élevage',
          subtitle: 'Issus de l’élevage et des soins apportés aux animaux.',
          items: [
            'Animaux vivants (bovins, chèvres, volailles, etc.)',
            'Lait et produits laitiers',
            'Viande et produits avicoles',
            'Œufs',
            'Reproducteurs',
          ],
        },
        {
          title: 'Produits Agro-Transformés et Prêts pour le Marché',
          subtitle:
            'Issus de la préparation, du nettoyage, du tri et du conditionnement.',
          items: [
            'Grains nettoyés et calibrés',
            'Légumes et fruits emballés',
            'Produits agricoles semi-transformés',
            'Produits agricoles triés prêts pour le marché',
          ],
        },
        {
          title: 'Produits de Recyclage et Environnementaux',
          subtitle:
            'Issus du recyclage des déchets et de la protection de l’environnement.',
          items: [
            'Matériaux métalliques recyclés',
            'Matériaux plastiques recyclés',
            'Matériaux de récupération',
            'Pièces réutilisables',
            'Compost organique',
            'Combustible biomasse',
          ],
        },
        {
          title: 'Produits Écologiques et de Restauration',
          subtitle:
            'Issus de l’entretien des terres et des programmes environnementaux.',
          items: [
            'Crédits carbone (si les projets sont éligibles)',
            'Résultats de restauration environnementale',
            'Produits d’amélioration des sols',
            'Packages de plantation d’arbres',
          ],
        },
        {
          title: 'Produits Techniques et de Conseil',
          subtitle:
            'Solutions packagées en ingénierie, conseil et études.',
          items: [
            'Rapports d’étude d’impact environnemental',
            'Plans de conception d’ingénierie',
            'Packages de conseil agricole',
            'Plans de systèmes d’irrigation',
            'Plans de gestion des déchets',
            'Rapports de recherche',
            'Études de faisabilité',
          ],
        },
        {
          title: 'Produits de Nettoyage et de Maintenance',
          subtitle:
            'Produits indirects liés au nettoyage industriel et à la maintenance.',
          items: [
            'Solutions de nettoyage',
            'Déchets collectés et traités',
            'Packages de maintenance',
          ],
        },
        {
          title: 'Produits de Commerce et de Vente en Gros',
          subtitle: 'Issus des activités de commerce de détail et de gros.',
          items: [
            'Engrais',
            'Produits agrochimiques',
            'Aliments pour animaux',
            'Intrants agricoles (outils, semences)',
            'Produits alimentaires frais',
          ],
        },
      ],
      highlightsTitle: 'Points Forts du Marché',
      highlights: [
        'Une large gamme de produits agricoles, de pépinière, d’élevage et environnementaux',
        'Des produits adaptés aux marchés locaux, institutionnels et orientés export',
        'Un fort alignement avec la durabilité, la restauration et l’économie circulaire',
        'Un modèle inclusif soutenant les jeunes, les femmes et les personnes handicapées',
      ],
      buyerTitle: 'Vous cherchez un fournisseur fiable ?',
      buyerText:
        'Contactez EcoCycle Rwanda pour discuter de la disponibilité des produits, des achats en gros, des partenariats et d’un accompagnement personnalisé pour les acheteurs.',
      buyerButton: 'Devenir Acheteur',
    },
  } as const;

  const content = productsContent[language] ?? productsContent.en;

  return (
    <div className="pb-24">
      <section className="bg-[#fcfcf7] py-20 border-b border-emerald-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-emerald-900 mb-6">
              {t.products.title}
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {t.products.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        {content.groups.map((group, index) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            className="bg-white rounded-[2rem] border border-emerald-900/5 shadow-sm overflow-hidden"
          >
            <div className="p-6 md:p-8 border-b border-emerald-900/5 bg-[#fcfcf7]">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-900 text-white flex items-center justify-center shadow-md">
                  {productIconMap[index as keyof typeof productIconMap] ?? <Package className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-emerald-900">
                    {group.title}
                  </h2>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {group.subtitle}
              </p>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors"
                  >
                    <CheckCircle size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-slate-700 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-[2rem] border border-emerald-900/5 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-8 md:p-10 bg-emerald-900 text-white">
              <h2 className="text-4xl font-bold mb-6">{t.products.impactTitle}</h2>
              <p className="text-lg text-emerald-100 leading-relaxed mb-8">
                {t.products.impactText}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {t.products.impactItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-emerald-300 mt-1 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 md:p-10 bg-[#fcfcf7]">
              <h3 className="text-2xl font-bold text-emerald-900 mb-6">{content.highlightsTitle}</h3>
              <div className="space-y-4 text-slate-700 mb-10">
                {content.highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-emerald-500 mt-1 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl bg-white border border-emerald-900/10 p-6">
                <h4 className="text-2xl font-bold text-emerald-900 mb-3">{content.buyerTitle}</h4>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {content.buyerText}
                </p>
                <button
                  onClick={() => setCurrentPage('contact')}
                  className="inline-flex items-center gap-3 bg-emerald-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-800 transition-colors shadow-md"
                >
                  {content.buyerButton}
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ContactPage = ({ t }: { t: T }) => {
  return (
    <div className="pb-24">
      <section className="bg-[#fcfcf7] py-24 border-b border-emerald-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-emerald-900 mb-6">{t.contact.title}</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">{t.contact.subtitle}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 space-y-12">
            <div>
              <h3 className="text-xl font-bold text-emerald-900 mb-6">{t.contact.details}</h3>
              <ul className="space-y-6">
                <li className="flex gap-4 items-start"><div className="p-3 bg-emerald-900/10 rounded-xl text-emerald-900"><MapPin size={24} /></div><div><div className="font-bold">{t.contact.address}</div><div className="text-slate-600">{t.footer.address}</div></div></li>
                <li className="flex gap-4 items-start"><div className="p-3 bg-emerald-900/10 rounded-xl text-emerald-900"><Phone size={24} /></div><div><div className="font-bold">{t.contact.phone}</div><a href="tel:+250788963938" className="text-slate-600 hover:text-emerald-500 transition-colors">{t.topbar.phone}</a></div></li>
                <li className="flex gap-4 items-start"><div className="p-3 bg-emerald-900/10 rounded-xl text-emerald-900"><MessageCircle size={24} /></div><div><div className="font-bold">{t.contact.whatsapp}</div><a href="https://wa.me/250788963938" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-emerald-500 transition-colors">{t.topbar.phone}</a></div></li>
                <li className="flex gap-4 items-start"><div className="p-3 bg-emerald-900/10 rounded-xl text-emerald-900"><Mail size={24} /></div><div><div className="font-bold">{t.contact.email}</div><div className="text-slate-600">{t.topbar.email}</div></div></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-900 mb-6">{t.contact.follow}</h3>
              <div className="flex gap-4 flex-wrap">
                <a href="https://www.facebook.com/EcoCycleRwanda" target="_blank" rel="noopener noreferrer" className="p-4 bg-white shadow-sm border border-emerald-900/5 rounded-2xl hover:text-emerald-500 transition-colors"><Facebook /></a>
                <a href="https://www.instagram.com/ecocyclerwanda" target="_blank" rel="noopener noreferrer" className="p-4 bg-white shadow-sm border border-emerald-900/5 rounded-2xl hover:text-emerald-500 transition-colors"><Instagram /></a>
                <a href="https://www.linkedin.com/company/ecocyclerwanda" target="_blank" rel="noopener noreferrer" className="p-4 bg-white shadow-sm border border-emerald-900/5 rounded-2xl hover:text-emerald-500 transition-colors"><Linkedin /></a>
                <a href="https://x.com/EcoCycleRwanda" target="_blank" rel="noopener noreferrer" className="p-4 bg-white shadow-sm border border-emerald-900/5 rounded-2xl hover:text-emerald-500 transition-colors"><Twitter /></a>
                <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="p-4 bg-white shadow-sm border border-emerald-900/5 rounded-2xl hover:text-emerald-500 transition-colors"><Youtube /></a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <ContactForm t={t} />
          </div>
        </div>
      </section>
    </div>
  );
};

const PartnersPage = ({
  t,
  language,
}: {
  t: T;
  language: Language;
}) => {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stop = startPartnersPolling(
      (items) => {
        setPartners(items.filter((item) => item.active));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return stop;
  }, []);

  return (
    <div className="pb-24">
      <section className="bg-emerald-900 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-6xl font-bold mb-8">{t.partners.title}</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            {t.partners.subtitle}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-24">
          <span className="text-emerald-500 font-bold tracking-widest uppercase text-sm mb-4 block">
            {t.partners.network}
          </span>
          <h2 className="text-4xl font-bold text-emerald-900">{t.partners.ecosystem}</h2>
        </div>

        {loading ? (
          <div className="text-center text-slate-500">Loading partners...</div>
        ) : partners.length === 0 ? (
          <div className="text-center text-slate-500">No partners added yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.map((partner) => {
              const text = getLocalizedPartner(partner, language);

              return (
                <motion.div
                  key={partner.id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white p-8 rounded-[2rem] shadow-sm border border-emerald-900/5 hover:shadow-xl transition-all duration-500"
                >
                  <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-slate-50">
                    <img
                      src={partner.imageUrl}
                      alt={partner.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-emerald-900 mb-3">{partner.name}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">
                    {text.description}
                  </p>

                  {partner.websiteUrl ? (
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-emerald-900 font-semibold hover:text-emerald-500"
                    >
                      Visit <ExternalLink size={16} />
                    </a>
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-32 bg-[#fcfcf7] rounded-[3rem] p-16 md:p-24 text-center border border-emerald-900/5">
          <h3 className="text-4xl font-bold text-emerald-900 mb-8">{t.partners.collaborationTitle}</h3>
          <p className="text-slate-600 max-w-2xl mx-auto mb-12 text-lg">
            {t.partners.collaborationText}
          </p>
          <button className="bg-emerald-500 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all shadow-lg">
            {t.partners.becomePartner}
          </button>
        </div>
      </section>
    </div>
  );
};

const AdminPage = ({ t }: { t: T }) => {
  return <AdminPageContent t={t} />;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showSplash, setShowSplash] = useState(true);
  const [language, setLanguage] = useState<Language | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('site-language') as Language | null;
    if (savedLanguage === 'en' || savedLanguage === 'rw' || savedLanguage === 'fr') {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    if (language) {
      localStorage.setItem('site-language', language);
    }
  }, [language]);

  const safeLanguage: Language = language ?? 'en';
  const t = translations[safeLanguage];

  useEffect(() => {
    if (!language) return;

    const titles: Record<Page, string> = {
      home: `EcoCycle Rwanda`,
      about: `${t.nav.about} - EcoCycle Rwanda`,
      services: `${t.nav.services} - EcoCycle Rwanda`,
      'service-detail': selectedService
        ? `${getLocalizedService(selectedService, safeLanguage).title} - EcoCycle Rwanda`
        : `Service - EcoCycle Rwanda`,
      products: `${t.nav.products} - EcoCycle Rwanda`,
      projects: `${t.nav.projects} - EcoCycle Rwanda`,
      impact: `${t.nav.impact} - EcoCycle Rwanda`,
      partners: `${t.nav.partners} - EcoCycle Rwanda`,
      news: `${t.nav.news} - EcoCycle Rwanda`,
      donate: `${t.nav.donate} - EcoCycle Rwanda`,
      contact: `${t.nav.contact} - EcoCycle Rwanda`,
      admin: `Admin - EcoCycle Rwanda`,
    };
    document.title = titles[currentPage];
  }, [currentPage, language, t, selectedService, safeLanguage]);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!language) {
    return <LanguageSelector onSelect={setLanguage} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} t={t} language={safeLanguage} />;
      case 'about':
        return <AboutPage t={t} language={safeLanguage} />;
      case 'services':
        return (
          <ServicesPage
            setCurrentPage={setCurrentPage}
            setSelectedService={setSelectedService}
            t={t}
            language={safeLanguage}
          />
        );
      case 'service-detail':
        return (
          <DynamicServiceDetailPage
            service={selectedService}
            setCurrentPage={setCurrentPage}
            t={t}
            language={safeLanguage}
          />
        );
      case 'projects':
        return <ProjectsPage t={t} language={safeLanguage} setCurrentPage={setCurrentPage} />;
      case 'impact':
        return <ImpactPage t={t} language={safeLanguage} />;
      case 'partners':
        return <PartnersPage t={t} language={safeLanguage} />;
      case 'news':
        return <NewsPage t={t} language={safeLanguage} />;
      case 'donate':
        return <DonatePage t={t} />;
      case 'products':
        return <ProductsPage t={t} language={safeLanguage} setCurrentPage={setCurrentPage} />;
      case 'contact':
        return <ContactPage t={t} />;
      case 'admin':
        return <AdminPage t={t} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} t={t} language={safeLanguage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar t={t} />
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        t={t}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer setCurrentPage={setCurrentPage} t={t} />
    </div>
  );
}