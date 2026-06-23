import { integer, pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const tourPackages = pgTable("tour_packages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  details: text("details").notNull(),
  price: text("price").notNull(),
  originalPrices: text("original_prices"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const destinations = pgTable("destinations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  description: text("description").notNull().default("Premium treks, lodges, permits and local expertise."),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const bikeRentals = pgTable("bike_rentals", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  price: text("price").notNull(),
  features: text("features").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const trekkingRegions = pgTable("trekking_regions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const trekkingItems = pgTable("trekking_items", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  regionId: integer("region_id")
    .notNull()
    .references(() => trekkingRegions.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const features = pgTable("features", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  icon: text("icon").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const testimonials = pgTable("testimonials", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  quote: text("quote").notNull(),
  author: text("author").notNull().default("Guest"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const blogPosts = pgTable("blog_posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const contactInquiries = pgTable("contact_inquiries", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  read: boolean("read").notNull().default(false),
});

export const adminSessions = pgTable("admin_sessions", {
  token: text("token").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
});
