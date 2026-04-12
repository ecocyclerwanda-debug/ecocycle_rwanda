export type Page =
  | 'home'
  | 'about'
  | 'services'
  | 'products'
  | 'projects'
  | 'impact'
  | 'partners'
  | 'news'
  | 'donate'
  | 'contact'
  | 'admin'
  | 'service-farming'
  | 'service-climate'
  | 'service-circular'
  | 'service-export'
  | 'service-empowerment';

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

export type ProductItem = {
  id: string;
  imageUrl: string;
  displayOrder: number;
  active: boolean;
  translations: {
    en: {
      name: string;
      description: string;
      category: string;
    };
    rw: {
      name: string;
      description: string;
      category: string;
    };
    fr: {
      name: string;
      description: string;
      category: string;
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