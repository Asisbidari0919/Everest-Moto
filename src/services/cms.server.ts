import { asc, count, desc, eq, lt } from "drizzle-orm";

import { getDb, schema } from "@/db/index.server";
import type { ContactInquiry, SiteContent, SiteSettings } from "@/types/content";

function parseOriginalPrices(value: string | null) {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as string[];
  } catch {
    return undefined;
  }
}

async function getSettingsMap(db: Awaited<ReturnType<typeof getDb>>) {
  const rows = await db.select().from(schema.siteSettings);
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

function mapSettings(settings: Record<string, string>): SiteSettings {
  return {
    companyName: settings.company_name ?? "Everest Moto Tours & Travels",
    heroEyebrow: settings.hero_eyebrow ?? "Luxury Nepal Adventures",
    heroTitle: settings.hero_title ?? "Explore Nepal Beyond Limits",
    heroSubtitle: settings.hero_subtitle ?? "Luxury Treks, Bike Adventures, Helicopter Tours & Lifetime Memories",
    aboutTitle: settings.about_title ?? "About Everest Moto Tours & Travels",
    aboutDescription:
      settings.about_description ??
      "Trusted travel company specializing in trekking, luxury adventures, bike rentals, Nepal tours, helicopter returns, jungle safari, cultural journeys and customized holidays.",
    phone: settings.phone ?? "+977 980-000-0000",
    email: settings.email ?? "hello@everestmototours.com",
    address: settings.address ?? "Thamel, Kathmandu, Nepal",
    whatsapp: settings.whatsapp ?? "9779800000000",
    statYears: settings.stat_years ?? "30+",
    statTravelers: settings.stat_travelers ?? "5000+",
    statPackages: settings.stat_packages ?? "100+",
    statSupport: settings.stat_support ?? "24/7",
  };
}

export async function loadSiteContent(): Promise<SiteContent> {
  const db = await getDb();

  const [packages, destinations, bikes, regions, regionItems, features, testimonials, blogPosts, settingsMap] =
    await Promise.all([
      db
        .select()
        .from(schema.tourPackages)
        .where(eq(schema.tourPackages.active, true))
        .orderBy(asc(schema.tourPackages.sortOrder)),
      db
        .select()
        .from(schema.destinations)
        .where(eq(schema.destinations.active, true))
        .orderBy(asc(schema.destinations.sortOrder)),
      db
        .select()
        .from(schema.bikeRentals)
        .where(eq(schema.bikeRentals.active, true))
        .orderBy(asc(schema.bikeRentals.sortOrder)),
      db.select().from(schema.trekkingRegions).orderBy(asc(schema.trekkingRegions.sortOrder)),
      db.select().from(schema.trekkingItems).orderBy(asc(schema.trekkingItems.sortOrder)),
      db
        .select()
        .from(schema.features)
        .where(eq(schema.features.active, true))
        .orderBy(asc(schema.features.sortOrder)),
      db
        .select()
        .from(schema.testimonials)
        .where(eq(schema.testimonials.active, true))
        .orderBy(asc(schema.testimonials.sortOrder)),
      db
        .select()
        .from(schema.blogPosts)
        .where(eq(schema.blogPosts.active, true))
        .orderBy(asc(schema.blogPosts.sortOrder)),
      getSettingsMap(db),
    ]);

  const trekkingMenu = regions.map((region) => ({
    region: region.name,
    items: regionItems.filter((item) => item.regionId === region.id).map((item) => item.name),
  }));

  return {
    packages: packages.map((pkg) => ({
      id: pkg.id,
      title: pkg.title,
      details: pkg.details,
      price: pkg.price,
      originalPrices: parseOriginalPrices(pkg.originalPrices),
      sortOrder: pkg.sortOrder,
      active: pkg.active,
    })),
    destinations: destinations.map((destination) => ({
      id: destination.id,
      name: destination.name,
      description: destination.description,
      sortOrder: destination.sortOrder,
      active: destination.active,
    })),
    bikes: bikes.map((bike) => ({
      id: bike.id,
      title: bike.title,
      price: bike.price,
      features: bike.features,
      sortOrder: bike.sortOrder,
      active: bike.active,
    })),
    trekkingMenu,
    features: features.map((feature) => ({
      id: feature.id,
      icon: feature.icon,
      title: feature.title,
      description: feature.description,
    })),
    testimonials: testimonials.map((testimonial) => ({
      id: testimonial.id,
      quote: testimonial.quote,
      author: testimonial.author,
    })),
    blogPosts: blogPosts.map((post) => ({
      id: post.id,
      title: post.title,
      summary: post.summary,
    })),
    settings: mapSettings(settingsMap),
  };
}

export async function clearExpiredSessions() {
  const db = await getDb();
  await db.delete(schema.adminSessions).where(lt(schema.adminSessions.expiresAt, new Date().toISOString()));
}

export async function createAdminSession(token: string, expiresAt: string) {
  const db = await getDb();
  await clearExpiredSessions();
  await db.insert(schema.adminSessions).values({ token, expiresAt });
}

export async function deleteAdminSession(token: string) {
  const db = await getDb();
  await db.delete(schema.adminSessions).where(eq(schema.adminSessions.token, token));
}

export async function verifySessionToken(token: string) {
  const db = await getDb();
  await clearExpiredSessions();
  const [session] = await db
    .select()
    .from(schema.adminSessions)
    .where(eq(schema.adminSessions.token, token))
    .limit(1);
  return Boolean(session);
}

export async function getAdminStats() {
  const db = await getDb();
  const [packages, destinations, bikes, inquiries, unread] = await Promise.all([
    db.select({ value: count() }).from(schema.tourPackages),
    db.select({ value: count() }).from(schema.destinations),
    db.select({ value: count() }).from(schema.bikeRentals),
    db.select({ value: count() }).from(schema.contactInquiries),
    db.select({ value: count() }).from(schema.contactInquiries).where(eq(schema.contactInquiries.read, false)),
  ]);

  return {
    packages: packages[0]?.value ?? 0,
    destinations: destinations[0]?.value ?? 0,
    bikes: bikes[0]?.value ?? 0,
    inquiries: inquiries[0]?.value ?? 0,
    unreadInquiries: unread[0]?.value ?? 0,
  };
}

export async function listPackages() {
  const db = await getDb();
  const rows = await db.select().from(schema.tourPackages).orderBy(asc(schema.tourPackages.sortOrder));
  return rows.map((row) => ({
    ...row,
    originalPrices: row.originalPrices ? (JSON.parse(row.originalPrices) as string[]) : [],
  }));
}

export async function savePackage(data: {
  id?: number;
  title: string;
  details: string;
  price: string;
  originalPrices?: string[];
  sortOrder?: number;
  active?: boolean;
}) {
  const db = await getDb();
  const payload = {
    title: data.title,
    details: data.details,
    price: data.price,
    originalPrices: data.originalPrices?.length ? JSON.stringify(data.originalPrices) : null,
    sortOrder: data.sortOrder ?? 0,
    active: data.active ?? true,
  };

  if (data.id) {
    await db.update(schema.tourPackages).set(payload).where(eq(schema.tourPackages.id, data.id));
    return { success: true, id: data.id };
  }

  const [created] = await db.insert(schema.tourPackages).values(payload).returning();
  return { success: true, id: created.id };
}

export async function deletePackage(id: number) {
  const db = await getDb();
  await db.delete(schema.tourPackages).where(eq(schema.tourPackages.id, id));
  return { success: true };
}

export async function listDestinations() {
  const db = await getDb();
  return db.select().from(schema.destinations).orderBy(asc(schema.destinations.sortOrder));
}

export async function saveDestination(data: {
  id?: number;
  name: string;
  description: string;
  sortOrder?: number;
  active?: boolean;
}) {
  const db = await getDb();
  const payload = {
    name: data.name,
    description: data.description,
    sortOrder: data.sortOrder ?? 0,
    active: data.active ?? true,
  };

  if (data.id) {
    await db.update(schema.destinations).set(payload).where(eq(schema.destinations.id, data.id));
    return { success: true, id: data.id };
  }

  const [created] = await db.insert(schema.destinations).values(payload).returning();
  return { success: true, id: created.id };
}

export async function deleteDestination(id: number) {
  const db = await getDb();
  await db.delete(schema.destinations).where(eq(schema.destinations.id, id));
  return { success: true };
}

export async function listBikes() {
  const db = await getDb();
  return db.select().from(schema.bikeRentals).orderBy(asc(schema.bikeRentals.sortOrder));
}

export async function saveBike(data: {
  id?: number;
  title: string;
  price: string;
  features: string;
  sortOrder?: number;
  active?: boolean;
}) {
  const db = await getDb();
  const payload = {
    title: data.title,
    price: data.price,
    features: data.features,
    sortOrder: data.sortOrder ?? 0,
    active: data.active ?? true,
  };

  if (data.id) {
    await db.update(schema.bikeRentals).set(payload).where(eq(schema.bikeRentals.id, data.id));
    return { success: true, id: data.id };
  }

  const [created] = await db.insert(schema.bikeRentals).values(payload).returning();
  return { success: true, id: created.id };
}

export async function deleteBike(id: number) {
  const db = await getDb();
  await db.delete(schema.bikeRentals).where(eq(schema.bikeRentals.id, id));
  return { success: true };
}

export async function listInquiries() {
  const db = await getDb();
  const rows = await db.select().from(schema.contactInquiries).orderBy(desc(schema.contactInquiries.createdAt));
  return rows as ContactInquiry[];
}

export async function markInquiryRead(id: number) {
  const db = await getDb();
  await db.update(schema.contactInquiries).set({ read: true }).where(eq(schema.contactInquiries.id, id));
  return { success: true };
}

export async function getSettings() {
  const db = await getDb();
  const rows = await db.select().from(schema.siteSettings);
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export async function saveSettings(data: Record<string, string>) {
  const db = await getDb();
  for (const [key, value] of Object.entries(data)) {
    await db
      .insert(schema.siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value } });
  }
  return { success: true };
}

export async function submitContactInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const db = await getDb();
  await db.insert(schema.contactInquiries).values({
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    message: data.message,
    createdAt: new Date().toISOString(),
    read: false,
  });
  return { success: true };
}
