import { useEffect, useState } from "react";

import heroImage from "../../assets/hero-adventure.jpeg";
import aboutImage from "../../assets/about-group.jpeg";
import trekImage from "../../assets/trek-glacier.jpeg";
import packageImage from "../../assets/package-road.jpeg";
import bikeImage from "../../assets/bike-fleet.jpeg";
import sceneryImage from "../../assets/scenery-plateau.jpeg";
import newTourImage from "../../assets/WhatsApp Image 2026-06-10 at 4.09.42 PM.jpeg";
import { apiRequest } from "@/lib/api";
import type { SiteContent, TourPackage } from "@/types/content";

const galleryImages = [newTourImage, heroImage, aboutImage, trekImage, packageImage, sceneryImage, bikeImage];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PackagePrice({ price, originalPrices }: Pick<TourPackage, "price" | "originalPrices">) {
  return (
    <span className="inline-flex flex-wrap items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
      {originalPrices?.map((originalPrice) => (
        <span key={originalPrice} className="text-xs font-semibold text-muted-foreground line-through">
          {originalPrice}
        </span>
      ))}
      <span>{price}</span>
    </span>
  );
}

function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-accent">{eyebrow}</p>
      <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-5xl">{title}</h2>
      {copy && <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">{copy}</p>}
    </div>
  );
}

function MegaMenu({
  type,
  packages,
  trekkingMenu,
}: {
  type: "trekking" | "packages";
  packages: TourPackage[];
  trekkingMenu: SiteContent["trekkingMenu"];
}) {
  if (type === "packages") {
    return (
      <div className="mega-panel right-0 w-[min(900px,calc(100vw-2rem))]">
        <div className="grid gap-4 md:grid-cols-2">
          {packages.map((pkg) => (
            <a key={pkg.title} href="#packages" className="group rounded-2xl border border-border bg-card/80 p-4 transition hover:-translate-y-1 hover:shadow-luxury">
              <p className="font-semibold text-card-foreground group-hover:text-primary">{pkg.title}</p>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm text-muted-foreground">
                <span>{pkg.details}</span>
                <PackagePrice price={pkg.price} originalPrices={pkg.originalPrices} />
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mega-panel left-1/2 w-[min(1180px,calc(100vw-2rem))] -translate-x-1/2">
      <div className="grid gap-6 lg:grid-cols-4">
        {trekkingMenu.map((group) => (
          <div key={group.region}>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-primary">{group.region}</h3>
            <ul className="space-y-2">
              {group.items.map((item) => (
                <li key={item}>
                  <a href="#packages" className="text-sm text-muted-foreground transition hover:text-accent">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function Header({
  companyName,
  packages,
  trekkingMenu,
}: {
  companyName: string;
  packages: TourPackage[];
  trekkingMenu: SiteContent["trekkingMenu"];
}) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${solid ? "site-header-solid" : ""}`}>
      <a href="#home" className="flex items-center gap-3" aria-label="Everest Moto Tours & Travels home">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-gold">EM</span>
        <span className="hidden text-sm font-black uppercase leading-tight tracking-[0.18em] text-nav-foreground sm:block">
          {companyName.split(" ").slice(0, 2).join(" ")}<br />{companyName.split(" ").slice(2).join(" ") || "Tours & Travels"}
        </span>
      </a>
      <nav className="hidden items-center gap-6 text-sm font-semibold text-nav-foreground xl:flex" aria-label="Primary navigation">
        <a href="#home">Home</a>
        <a href="#about">About Us</a>
        <a href="#destinations">Destination</a>
        <div className="group relative py-8">
          <a href="#packages">Trekking in Nepal</a>
          <MegaMenu type="trekking" packages={packages} trekkingMenu={trekkingMenu} />
        </div>
        <div className="group relative py-8">
          <a href="#packages">Tour Packages</a>
          <MegaMenu type="packages" packages={packages} trekkingMenu={trekkingMenu} />
        </div>
        <a href="#bike">Bike Tour & Rental</a>
        <a href="#blog">Blog</a>
        <a href="#contact">Contact Us</a>
      </nav>
      <a href="#contact" className="btn-primary hidden sm:inline-flex">Book Now</a>
      <a href="#contact" className="btn-icon xl:hidden" aria-label="Open booking contact"><ArrowIcon /></a>
    </header>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    try {
      await apiRequest("/api/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ name: "", email: "", phone: "", message: "" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {[
        ["Name", "name", "text"],
        ["Email", "email", "email"],
        ["Phone", "phone", "tel"],
      ].map(([label, key, type]) => (
        <label key={key}>
          <span>{label}</span>
          <input
            type={type}
            placeholder={label}
            value={form[key as keyof typeof form]}
            onChange={(event) => setForm({ ...form, [key]: event.target.value })}
            required={key !== "phone"}
          />
        </label>
      ))}
      <label>
        <span>Message</span>
        <textarea
          placeholder="Tell us your destination, dates and travel style"
          rows={6}
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          required
        />
      </label>
      <button type="submit" className="btn-primary w-full justify-center" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Inquiry"} <ArrowIcon />
      </button>
      {status === "success" && <p className="text-sm text-accent">Thank you! Your inquiry has been sent.</p>}
      {status === "error" && <p className="text-sm text-destructive">Could not send inquiry. Please try again.</p>}
    </form>
  );
}

export function EverestHome({ content }: { content: SiteContent }) {
  const { packages, destinations, bikes, trekkingMenu, features, testimonials, blogPosts, settings } = content;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header companyName={settings.companyName} packages={packages} trekkingMenu={trekkingMenu} />
      <main>
        <section id="home" className="hero-section">
          <img src={heroImage} alt="Motorcycle tour group on an adventure ride in the Himalayas" className="absolute inset-0 h-full w-full object-cover" width={1600} height={960} />
          <div className="hero-overlay" />
          <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pb-36 pt-28 sm:px-8 lg:px-10">
            <p className="mb-5 max-w-fit rounded-full border border-hero-foreground/25 bg-hero-foreground/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-hero-foreground backdrop-blur-md">
              {settings.heroEyebrow}
            </p>
            <h1 className="max-w-5xl font-serif text-5xl font-semibold leading-[0.95] text-hero-foreground sm:text-7xl lg:text-8xl">
              {settings.heroTitle}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-hero-muted sm:text-2xl">
              {settings.heroSubtitle}
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a href="#packages" className="btn-primary">Explore Packages <ArrowIcon /></a>
              <a href="#contact" className="btn-secondary">Contact Us</a>
            </div>
          </div>
          <form className="search-panel" aria-label="Travel package search">
            {[
              ["Destination", "Everest Region"],
              ["Duration", "12-18 Days"],
              ["Budget", "$1,000 - $3,000"],
            ].map(([label, value]) => (
              <label key={label} className="flex flex-col gap-1 border-border/70 px-5 py-4 md:border-r">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
                <select className="bg-transparent text-base font-semibold text-foreground outline-none">
                  <option>{value}</option>
                </select>
              </label>
            ))}
            <button type="button" className="m-3 rounded-2xl bg-primary px-7 py-4 font-bold text-primary-foreground transition hover:-translate-y-1 hover:shadow-gold">Search</button>
          </form>
        </section>

        <section id="about" className="section-padding">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.92fr_1fr] lg:px-10">
            <div className="image-frame signature-tilt">
              <img src={aboutImage} alt="Motorcycle group posing in front of Himalayan rock formations" loading="lazy" width={1200} height={900} className="h-full min-h-[420px] w-full object-cover" />
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-accent">About Us</p>
              <h2 className="font-serif text-4xl font-semibold text-foreground sm:text-5xl">{settings.aboutTitle}</h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {settings.aboutDescription}
              </p>
              <div className="mt-9 grid grid-cols-2 gap-4">
                {[
                  [settings.statYears, "Years Experience"],
                  [settings.statTravelers, "Happy Travelers"],
                  [settings.statPackages, "Tour Packages"],
                  [settings.statSupport, "Support"],
                ].map(([num, label]) => (
                  <div key={label} className="stat-card">
                    <strong>{num}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="destinations" className="section-padding bg-secondary/45">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeader eyebrow="Destinations" title="Iconic Himalayan regions, curated with care" copy="From classic Everest viewpoints to hidden Dolpo valleys, each route is designed for comfort, safety, and deep local connection." />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {destinations.map((destination, index) => (
                <article key={destination.id} className="destination-card group">
                  <img src={galleryImages[index % galleryImages.length]} alt={`${destination.name} motorcycle adventure landscape`} loading="lazy" width={1200} height={900} className="h-72 w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-hero-foreground">
                    <h3 className="font-serif text-2xl font-semibold">{destination.name}</h3>
                    <p className="mt-2 text-sm text-hero-muted">{destination.description}</p>
                    <button className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-gold">Explore <ArrowIcon /></button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="section-padding bg-secondary/10">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeader
              eyebrow="Gallery"
              title="Ride moments from our recent Nepal adventures"
              copy="A collection of real tour photos captured by riders on the road."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {galleryImages.map((src, index) => (
                <div key={index} className="overflow-hidden rounded-[2rem] bg-card">
                  <img
                    src={src}
                    alt={`Adventure ride photo ${index + 1}`}
                    loading="lazy"
                    width={1200}
                    height={900}
                    className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="packages" className="section-padding">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeader eyebrow="Tour Package Pricing" title="Motorcycle tours across Nepal's most iconic routes" />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {packages.map((pkg, index) => (
                <article key={pkg.id} className="package-card group">
                  <div className="overflow-hidden rounded-t-[inherit]">
                    <img src={galleryImages[(index + 2) % galleryImages.length]} alt={`${pkg.title} motorcycle tour package in Nepal`} loading="lazy" width={1200} height={900} className="h-56 w-full object-cover transition duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <PackagePrice price={pkg.price} originalPrices={pkg.originalPrices} />
                      <span className="text-sm font-semibold text-gold">★★★★★</span>
                    </div>
                    <h3 className="min-h-20 text-lg font-bold leading-snug text-card-foreground">{pkg.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground">{pkg.details} · Private departures · Expert guide</p>
                    <a href="#contact" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-bold text-primary-foreground transition hover:-translate-y-1 hover:shadow-gold">Book Now <ArrowIcon /></a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="bike" className="section-padding bg-charcoal text-charcoal-foreground">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-gold">Bike Tour & Rental</p>
              <h2 className="font-serif text-4xl font-semibold sm:text-5xl">Premium motorcycles for Himalayan roads</h2>
              <p className="mt-6 text-lg leading-8 text-charcoal-muted">Choose a daily rental, supported ride, or fully guided off-road expedition across Nepal’s most dramatic landscapes.</p>
              <img src={bikeImage} alt="Honda CRF dual-sport motorcycles ready for rental in Nepal" loading="lazy" width={1200} height={900} className="mt-8 rounded-[2rem] shadow-luxury" />
            </div>
            <div className="grid content-center gap-4">
              {bikes.map((bike) => (
                <article key={bike.id} className="bike-card">
                  <div>
                    <h3 className="text-xl font-bold">{bike.title}</h3>
                    <p className="mt-2 text-charcoal-muted">{bike.features}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-2xl text-gold">{bike.price}</p>
                    <a href="#contact" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-charcoal-foreground">Book Rental <ArrowIcon /></a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeader eyebrow="Why Choose Us" title="Trust, comfort and adventure in perfect balance" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.id} className="feature-card">
                  <span>{feature.icon}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-secondary/45">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeader eyebrow="Testimonials" title="Travelers who trusted the altitude with us" />
            <div className="testimonial-track">
              {testimonials.map((testimonial) => (
                <figure key={testimonial.id} className="testimonial-card">
                  <blockquote>“{testimonial.quote}”</blockquote>
                  <figcaption>★★★★★ · {testimonial.author}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="blog" className="section-padding">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeader eyebrow="Blog" title="Field notes from Nepal" />
            <div className="grid gap-6 md:grid-cols-3">
              {blogPosts.map((post, index) => (
                <article key={post.id} className="blog-card group">
                  <img src={galleryImages[index % galleryImages.length]} alt={`${post.title} article preview`} loading="lazy" width={1200} height={900} className="h-64 w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="p-6">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Guide</p>
                    <h3 className="mt-3 font-serif text-2xl font-semibold">{post.title}</h3>
                    <p className="mt-3 text-muted-foreground">{post.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section-padding bg-secondary/45">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-accent">Contact Us</p>
              <h2 className="font-serif text-4xl font-semibold sm:text-5xl">Plan your private Nepal journey</h2>
              <div className="mt-8 space-y-4 text-muted-foreground">
                <p><strong className="text-foreground">{settings.companyName}</strong></p>
                <p>Phone: {settings.phone}</p>
                <p>Email: {settings.email}</p>
                <p>Address: {settings.address}</p>
              </div>
              <a href={`https://wa.me/${settings.whatsapp}`} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-accent px-6 py-4 font-bold text-accent-foreground shadow-gold transition hover:-translate-y-1">WhatsApp <ArrowIcon /></a>
              <div className="mt-8 grid h-64 place-items-center rounded-[2rem] border border-border bg-card shadow-soft">
                <span className="font-serif text-2xl text-muted-foreground">Kathmandu Map</span>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <footer className="bg-charcoal px-5 py-14 text-charcoal-foreground sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-3xl">{settings.companyName}</h2>
            <p className="mt-4 text-charcoal-muted">Luxury treks, cultural tours, bike rentals and tailored Himalayan adventures.</p>
          </div>
          {["Company", "Quick Links", "Top Treks", "Bike Rentals"].map((column) => (
            <div key={column}>
              <h3 className="font-bold text-gold">{column}</h3>
              <ul className="mt-4 space-y-2 text-sm text-charcoal-muted">
                <li>About</li><li>Packages</li><li>Contact</li><li>Book Now</li>
              </ul>
            </div>
          ))}
          <div>
            <h3 className="font-bold text-gold">Newsletter</h3>
            <div className="mt-4 flex rounded-2xl bg-charcoal-light p-1">
              <input aria-label="Email for newsletter" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" placeholder="Email" />
              <button className="rounded-xl bg-accent px-3 text-sm font-bold text-accent-foreground">Join</button>
            </div>
            <p className="mt-4 text-sm text-charcoal-muted">Instagram · Facebook · YouTube</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
