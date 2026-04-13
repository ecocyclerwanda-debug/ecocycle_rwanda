export type Page =
  | 'home'
  | 'about'
  | 'services'
  | 'service-detail'
  | 'products'
  | 'projects'
  | 'impact'
  | 'partners'
  | 'news'
  | 'donate'
  | 'contact'
  | 'admin';

export type NavItem = {
  label: string;
  id: Page;
};

export type NewsCategory = 'training' | 'projects' | 'impact' | 'media';

export type NewsTranslation = {
  title: string;
  summary: string;
  content: string;
};

export type NewsItem = {
  id: string;
  imageUrl: string;
  category: NewsCategory;
  date: string;
  featured: boolean;
  createdAt?: string;
  translations: {
    en: NewsTranslation;
    rw: NewsTranslation;
    fr: NewsTranslation;
  };
};

export type LeaderItem = {
  id: string;
  name: string;
  imageUrl: string;
  displayOrder: number;
  active: boolean;
  translations: {
    en: {
      role: string;
      bio: string;
    };
    rw: {
      role: string;
      bio: string;
    };
    fr: {
      role: string;
      bio: string;
    };
  };
};

export type ServiceItem = {
  id: string;
  slug: string;
  imageUrl: string;
  displayOrder: number;
  active: boolean;
  translations: {
    en: {
      title: string;
      subtitle: string;
      description: string;
      features: string[];
      outcomes: string[];
    };
    rw: {
      title: string;
      subtitle: string;
      description: string;
      features: string[];
      outcomes: string[];
    };
    fr: {
      title: string;
      subtitle: string;
      description: string;
      features: string[];
      outcomes: string[];
    };
  };
};

export type ProjectItem = {
  id: string;
  imageUrl: string;
  displayOrder: number;
  active: boolean;
  translations: {
    en: {
      title: string;
      goal: string;
      impact: string;
      activities: string;
    };
    rw: {
      title: string;
      goal: string;
      impact: string;
      activities: string;
    };
    fr: {
      title: string;
      goal: string;
      impact: string;
      activities: string;
    };
  };
};

export type PartnerItem = {
  id: string;
  name: string;
  imageUrl: string;
  websiteUrl: string;
  displayOrder: number;
  active: boolean;
  translations: {
    en: { description: string };
    rw: { description: string };
    fr: { description: string };
  };
};

export type ImpactStoryItem = {
  id: string;
  name: string;
  imageUrl: string;
  videoUrl: string;
  displayOrder: number;
  active: boolean;
  translations: {
    en: {
      role: string;
      quote: string;
    };
    rw: {
      role: string;
      quote: string;
    };
    fr: {
      role: string;
      quote: string;
    };
  };
};