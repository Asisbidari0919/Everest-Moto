import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { count } from "drizzle-orm";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

import * as schema from "./schema";
import {
  defaultBikes,
  defaultBlogPosts,
  defaultDestinations,
  defaultFeatures,
  defaultPackages,
  defaultSettings,
  defaultTestimonials,
  defaultTrekkingMenu,
} from "./seed-data";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDbPath() {
  return path.join(process.cwd(), "data", "everest.db");
}

function runMigrations(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS tour_packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      details TEXT NOT NULL,
      price TEXT NOT NULL,
      original_prices TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS destinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT 'Premium treks, lodges, permits and local expertise.',
      sort_order INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS bike_rentals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      price TEXT NOT NULL,
      features TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS trekking_regions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS trekking_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      region_id INTEGER NOT NULL REFERENCES trekking_regions(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS features (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      icon TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'Guest',
      sort_order INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      expires_at TEXT NOT NULL
    );
  `);
}

async function seedDatabase(db: ReturnType<typeof drizzle<typeof schema>>) {
  const [{ value: packageCount }] = await db.select({ value: count() }).from(schema.tourPackages);
  if (packageCount > 0) return;

  await db.insert(schema.tourPackages).values(
    defaultPackages.map((pkg, index) => ({
      title: pkg.title,
      details: pkg.details,
      price: pkg.price,
      originalPrices: pkg.originalPrices,
      sortOrder: index,
      active: true,
    })),
  );

  await db.insert(schema.destinations).values(
    defaultDestinations.map((destination, index) => ({
      name: destination.name,
      description: destination.description,
      sortOrder: index,
      active: true,
    })),
  );

  await db.insert(schema.bikeRentals).values(
    defaultBikes.map((bike, index) => ({
      title: bike.title,
      price: bike.price,
      features: bike.features,
      sortOrder: index,
      active: true,
    })),
  );

  for (const [regionIndex, region] of defaultTrekkingMenu.entries()) {
    const [inserted] = await db
      .insert(schema.trekkingRegions)
      .values({ name: region.region, sortOrder: regionIndex })
      .returning();

    await db.insert(schema.trekkingItems).values(
      region.items.map((item, itemIndex) => ({
        regionId: inserted.id,
        name: item,
        sortOrder: itemIndex,
      })),
    );
  }

  await db.insert(schema.features).values(
    defaultFeatures.map((feature, index) => ({
      icon: feature.icon,
      title: feature.title,
      description: feature.description,
      sortOrder: index,
      active: true,
    })),
  );

  await db.insert(schema.testimonials).values(
    defaultTestimonials.map((testimonial, index) => ({
      quote: testimonial.quote,
      author: testimonial.author,
      sortOrder: index,
      active: true,
    })),
  );

  await db.insert(schema.blogPosts).values(
    defaultBlogPosts.map((post, index) => ({
      title: post.title,
      summary: post.summary,
      sortOrder: index,
      active: true,
    })),
  );

  await db
    .insert(schema.siteSettings)
    .values(Object.entries(defaultSettings).map(([key, value]) => ({ key, value })));
}

export async function getDb() {
  if (dbInstance) return dbInstance;

  const dataDir = path.join(process.cwd(), "data");
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

  const sqlite = new Database(getDbPath());
  sqlite.pragma("journal_mode = WAL");
  runMigrations(sqlite);

  dbInstance = drizzle(sqlite, { schema });
  await seedDatabase(dbInstance);
  return dbInstance;
}

export { schema };
