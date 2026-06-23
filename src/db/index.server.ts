import { drizzle } from "drizzle-orm/postgres-js";
import { count } from "drizzle-orm";
import postgres from "postgres";

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
let pgClient: postgres.Sql | null = null;

async function runMigrations(sql: postgres.Sql) {
  // Create tables using raw SQL - each statement separately
  const statements = [
    `CREATE TABLE IF NOT EXISTS tour_packages (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      details TEXT NOT NULL,
      price TEXT NOT NULL,
      original_prices TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT true
    )`,

    `CREATE TABLE IF NOT EXISTS destinations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT 'Premium treks, lodges, permits and local expertise.',
      sort_order INTEGER NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT true
    )`,

    `CREATE TABLE IF NOT EXISTS bike_rentals (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      price TEXT NOT NULL,
      features TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT true
    )`,

    `CREATE TABLE IF NOT EXISTS trekking_regions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    )`,

    `CREATE TABLE IF NOT EXISTS trekking_items (
      id SERIAL PRIMARY KEY,
      region_id INTEGER NOT NULL REFERENCES trekking_regions(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    )`,

    `CREATE TABLE IF NOT EXISTS features (
      id SERIAL PRIMARY KEY,
      icon TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT true
    )`,

    `CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      quote TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'Guest',
      sort_order INTEGER NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT true
    )`,

    `CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      content TEXT,
      image_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )`,

    `CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`,

    `CREATE TABLE IF NOT EXISTS contact_inquiries (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      read BOOLEAN NOT NULL DEFAULT false
    )`,

    `CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      expires_at TIMESTAMP NOT NULL
    )`,
  ];

  for (const statement of statements) {
    try {
      await sql.unsafe(statement);
    } catch (error) {
      console.error(`Error executing migration: ${error}`);
    }
  }
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

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Create postgres client
  pgClient = postgres(dbUrl, { 
    connect_timeout: 10,
    idle_timeout: 30,
  });

  // Run migrations
  await runMigrations(pgClient);

  // Create drizzle instance
  dbInstance = drizzle(pgClient, { schema });
  
  // Seed database if needed
  await seedDatabase(dbInstance);
  
  return dbInstance;
}

export async function closeDb() {
  if (pgClient) {
    await pgClient.end();
    pgClient = null;
    dbInstance = null;
  }
}

export { schema };
