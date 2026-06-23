export type TourPackage = {
  id: number;
  title: string;
  details: string;
  price: string;
  originalPrices?: string[];
  sortOrder: number;
  active: boolean;
};

export type Destination = {
  id: number;
  name: string;
  description: string;
  sortOrder: number;
  active: boolean;
};

export type BikeRental = {
  id: number;
  title: string;
  price: string;
  features: string;
  sortOrder: number;
  active: boolean;
};

export type TrekkingMenuGroup = {
  region: string;
  items: string[];
};

export type Feature = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

export type Testimonial = {
  id: number;
  quote: string;
  author: string;
};

export type BlogPost = {
  id: number;
  title: string;
  summary: string;
};

export type SiteSettings = {
  companyName: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  statYears: string;
  statTravelers: string;
  statPackages: string;
  statSupport: string;
};

export type SiteContent = {
  packages: TourPackage[];
  destinations: Destination[];
  bikes: BikeRental[];
  trekkingMenu: TrekkingMenuGroup[];
  features: Feature[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  settings: SiteSettings;
};

export type ContactInquiry = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
  read: boolean;
};
