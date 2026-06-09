import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { SPECIALIZATION_LABELS } from "@shared/schema";
import fs from "fs";
import path from "path";

const BASE_URL = "https://konfy.pl";
const TTL_MS = 10 * 60 * 1000;
const isProd = process.env.NODE_ENV === "production";
const BOT_ONLY = process.env.PRERENDER_BOTS_ONLY === "true";
const BOT_RE = /googlebot|bingbot|duckduckbot|yandexbot|slurp/i;

const cache = new Map<string, { html: string; ts: number }>();

export const SPECIALIZATION_SLUGS: Record<string, string> = {
  general_surgery: "chirurgia-ogolna",
  orthopedics: "ortopedia",
  gynecology: "ginekologia",
  urology: "urologia",
  neurosurgery: "neurochirurgia",
  vascular_surgery: "chirurgia-naczyniowa",
  cardiac_surgery: "kardiochirurgia",
  pediatric_surgery: "chirurgia-dziecieca",
  plastic_surgery: "chirurgia-plastyczna",
  maxillofacial_surgery: "chirurgia-szczekowo-twarzowa",
  ophthalmology: "okulistyka",
  otolaryngology: "laryngologia",
  thoracic_surgery: "torakochirurgia",
  internal_medicine: "interna",
  pediatrics: "pediatria",
  family_medicine: "medycyna-rodzinna",
  cardiology: "kardiologia",
  neurology: "neurologia",
  gastroenterology: "gastroenterologia",
  pulmonology: "pulmonologia",
  endocrinology: "endokrynologia",
  nephrology: "nefrologia",
  rheumatology: "reumatologia",
  hematology: "hematologia",
  oncology: "onkologia",
  diabetology: "diabetologia",
  geriatrics: "geriatria",
  emergency_medicine: "medycyna-ratunkowa",
  anesthesiology: "anestezjologia",
  psychiatry: "psychiatria",
  child_psychiatry: "psychiatria-dziecieca",
  sexology: "seksuologia",
  radiology: "radiologia",
  laboratory_medicine: "diagnostyka-laboratoryjna",
  pathology: "patomorfologia",
  nuclear_medicine: "medycyna-nuklearna",
  dermatology: "dermatologia",
  allergology: "alergologia",
  infectious_diseases: "choroby-zakazne",
  occupational_medicine: "medycyna-pracy",
  sports_medicine: "medycyna-sportowa",
  palliative_medicine: "medycyna-paliatywna",
  rehabilitation: "rehabilitacja",
  interdisciplinary: "interdyscyplinarne",
};

const SLUG_TO_SPEC: Record<string, string> = Object.fromEntries(
  Object.entries(SPECIALIZATION_SLUGS).map(([k, v]) => [v, k])
);

function esc(val: unknown): string {
  return String(val ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function getTemplate(): Promise<string> {
  if (isProd) {
    const p = path.resolve(__dirname, "public", "index.html");
    return fs.promises.readFile(p, "utf-8");
  }
  const p = path.resolve(__dirname, "..", "client", "index.html");
  return fs.promises.readFile(p, "utf-8");
}

function buildHead(type: string, data: any, canonPath: string): string {
  const canonical = `${BASE_URL}${canonPath}`;
  const ogImage = `${BASE_URL}/favicon.svg`;

  let title = "Konfy.pl - Wszystkie Wydarzenia Medyczne w Polsce";
  let desc =
    "Agregator konferencji, kongresów, webinarów i szkoleń medycznych dla lekarzy w Polsce.";
  let ogType = "website";
  let jsonLdObj: any = null;

  if (type === "event" && data?.event) {
    const ev = data.event;
    title = `${ev.title} | Konfy.pl`;
    desc = ev.description
      ? ev.description.slice(0, 160)
      : `Konferencja medyczna: ${ev.title}`;
    ogType = "article";

    const location =
      ev.isOnline
        ? { "@type": "VirtualLocation", url: canonical }
        : {
            "@type": "Place",
            name: ev.location || ev.city || "Polska",
            address: {
              "@type": "PostalAddress",
              addressLocality: ev.city || "",
              addressRegion: ev.voivodeship || "",
              addressCountry: "PL",
            },
          };

    const offers =
      ev.price === "free"
        ? { "@type": "Offer", price: "0", priceCurrency: "PLN" }
        : ev.price === "paid"
        ? { "@type": "Offer", priceCurrency: "PLN" }
        : undefined;

    jsonLdObj = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: ev.title,
      startDate: ev.startDate,
      endDate: ev.endDate || ev.startDate,
      eventAttendanceMode: ev.isOnline
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
      location,
      organizer: ev.organizer
        ? { "@type": "Organization", name: ev.organizer }
        : undefined,
      description: ev.description || "",
      offers,
      url: canonical,
    };
  }

  if (type === "blog-post" && data?.post) {
    const post = data.post;
    title = `${post.title} | Konfy.pl Blog`;
    desc = post.excerpt ? post.excerpt.slice(0, 160) : post.title;
    ogType = "article";
    jsonLdObj = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || "",
      datePublished:
        post.publishedAt?.toISOString() || post.createdAt?.toISOString(),
      author: { "@type": "Person", name: post.authorName || "Konfy.pl" },
      image: post.coverImage || ogImage,
      url: canonical,
    };
  }

  if (type === "specialization" && data?.specLabel) {
    const { specLabel, events: specEvents } = data;
    title = `Konferencje – ${specLabel} | Konfy.pl`;
    desc = `Konferencje, kongresy i szkolenia medyczne z dziedziny ${specLabel}. Aktualne wydarzenia na Konfy.pl.`;
    const itemList = (specEvents as any[]).slice(0, 30).map((ev, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: ev.title,
        startDate: ev.startDate,
        url: `${BASE_URL}/wydarzenia/${ev.id}`,
      },
    }));
    jsonLdObj = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description: desc,
      url: canonical,
      mainEntity: { "@type": "ItemList", itemListElement: itemList },
    };
  }

  if (type === "events-list") {
    title = "Wszystkie wydarzenia medyczne w Polsce | Konfy.pl";
    desc =
      "Pełna lista konferencji, kongresów, webinarów i szkoleń medycznych dla lekarzy w Polsce.";
  }

  if (type === "blog-list") {
    title = "Blog medyczny | Konfy.pl";
    desc =
      "Artykuły i aktualności ze świata medycyny. Wiedza dla lekarzy na Konfy.pl.";
  }

  if (type === "home") {
    jsonLdObj = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Konfy.pl",
        url: BASE_URL,
        description:
          "Agregator konferencji i szkoleń medycznych dla lekarzy w Polsce",
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Konfy.pl",
        url: BASE_URL,
        logo: `${BASE_URL}/favicon.svg`,
      },
    ];
  }

  let head = `<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${esc(canonical)}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:type" content="${ogType}" />
<meta property="og:url" content="${esc(canonical)}" />
<meta property="og:image" content="${esc(ogImage)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(desc)}" />`;

  if (jsonLdObj) {
    head += `\n<script type="application/ld+json">${JSON.stringify(jsonLdObj)}</script>`;
  }

  return head;
}

function buildBody(type: string, data: any): string {
  if (type === "event" && data?.event) {
    const ev = data.event;
    const related: any[] = data.related || [];
    const specs: string[] = ev.specializations || [];

    let body = `<article><h1>${esc(ev.title)}</h1>`;
    if (ev.startDate)
      body += `<p><strong>Data:</strong> ${esc(ev.startDate)}${ev.endDate && ev.endDate !== ev.startDate ? ` – ${esc(ev.endDate)}` : ""}</p>`;
    if (ev.isOnline)
      body += `<p><strong>Forma:</strong> Online / webinar</p>`;
    else if (ev.city)
      body += `<p><strong>Miasto:</strong> ${esc(ev.city)}${ev.voivodeship ? `, ${esc(ev.voivodeship)}` : ""}</p>`;
    if (ev.location) body += `<p><strong>Miejsce:</strong> ${esc(ev.location)}</p>`;
    if (ev.organizer)
      body += `<p><strong>Organizator:</strong> ${esc(ev.organizer)}</p>`;
    if (ev.hasEducationalPoints)
      body += `<p><strong>Punkty edukacyjne:</strong> ${esc(String(ev.educationalPoints || "Tak"))}</p>`;
    const priceLabel =
      ev.price === "free" ? "Bezpłatne" : ev.price === "paid" ? "Płatne" : "Do ustalenia";
    body += `<p><strong>Cena:</strong> ${priceLabel}</p>`;
    if (ev.description)
      body += `<p>${esc(ev.description.slice(0, 600))}</p>`;

    for (const spec of specs) {
      const slug = SPECIALIZATION_SLUGS[spec];
      const label =
        SPECIALIZATION_LABELS[spec as keyof typeof SPECIALIZATION_LABELS] || spec;
      if (slug)
        body += `<p><a href="/specjalizacja/${slug}">Zobacz więcej wydarzeń: ${esc(label)}</a></p>`;
    }

    if (related.length > 0) {
      body += `<h2>Inne wydarzenia</h2><ul>`;
      for (const r of related.slice(0, 5))
        body += `<li><a href="/wydarzenia/${r.id}">${esc(r.title)}</a></li>`;
      body += `</ul>`;
    }

    body += `</article>`;
    return body;
  }

  if (type === "specialization" && data?.specLabel) {
    const { specLabel, events: specEvents, blogPosts: posts } = data;
    let body = `<main><h1>Konferencje medyczne – ${esc(specLabel)}</h1>`;
    body += `<p>Aktualne konferencje, kongresy i szkolenia medyczne z dziedziny ${esc(specLabel)} w Polsce.</p>`;

    if ((specEvents as any[]).length > 0) {
      body += `<h2>Nadchodzące wydarzenia (${(specEvents as any[]).length})</h2><ul>`;
      for (const ev of specEvents as any[])
        body += `<li><a href="/wydarzenia/${ev.id}">${esc(ev.title)}</a>${ev.startDate ? ` – ${esc(ev.startDate)}` : ""}${ev.city ? `, ${esc(ev.city)}` : ""}</li>`;
      body += `</ul>`;
    } else {
      body += `<p>Brak nadchodzących wydarzeń w tej specjalizacji.</p>`;
    }

    if (posts && (posts as any[]).length > 0) {
      body += `<h2>Artykuły powiązane</h2><ul>`;
      for (const p of (posts as any[]).slice(0, 5))
        body += `<li><a href="/blog/${esc(p.slug)}">${esc(p.title)}</a></li>`;
      body += `</ul>`;
    }

    body += `<p><a href="/wydarzenia">Wszystkie wydarzenia medyczne</a> | <a href="/">Strona główna Konfy.pl</a></p>`;
    body += `</main>`;
    return body;
  }

  if (type === "events-list" && data) {
    const { events: evList, page, totalPages } = data;
    let body = `<main><h1>Wszystkie wydarzenia medyczne w Polsce</h1>`;
    body += `<p>Konferencje, kongresy, webinary i szkolenia medyczne dla lekarzy. Strona ${page} z ${totalPages}.</p>`;
    if ((evList as any[]).length > 0) {
      body += `<ul>`;
      for (const ev of evList as any[])
        body += `<li><a href="/wydarzenia/${ev.id}">${esc(ev.title)}</a>${ev.startDate ? ` – ${esc(ev.startDate)}` : ""}${ev.city ? `, ${esc(ev.city)}` : ""}</li>`;
      body += `</ul>`;
    }
    const nav: string[] = [];
    if (page > 1) nav.push(`<a href="/wydarzenia?page=${page - 1}">← Poprzednia strona</a>`);
    if (page < totalPages) nav.push(`<a href="/wydarzenia?page=${page + 1}">Następna strona →</a>`);
    if (nav.length > 0) body += `<p>${nav.join(" | ")}</p>`;
    body += `</main>`;
    return body;
  }

  if (type === "blog-post" && data?.post) {
    const post = data.post;
    let body = `<article><h1>${esc(post.title)}</h1>`;
    if (post.authorName) body += `<p><em>Autor: ${esc(post.authorName)}</em></p>`;
    if (post.excerpt) body += `<p>${esc(post.excerpt)}</p>`;
    body += `<p><a href="/blog">← Powrót do bloga</a> | <a href="/">Strona główna</a></p>`;
    body += `</article>`;
    return body;
  }

  if (type === "blog-list" && data?.posts) {
    const posts: any[] = data.posts;
    let body = `<main><h1>Blog Konfy.pl – Aktualności medyczne</h1>`;
    body += `<p>Artykuły i aktualności ze świata medycyny dla lekarzy.</p>`;
    if (posts.length > 0) {
      body += `<ul>`;
      for (const p of posts)
        body += `<li><a href="/blog/${esc(p.slug)}">${esc(p.title)}</a></li>`;
      body += `</ul>`;
    }
    body += `<p><a href="/">Strona główna Konfy.pl</a></p>`;
    body += `</main>`;
    return body;
  }

  if (type === "home") {
    let body = `<main>`;
    body += `<h1>Konfy.pl – Konferencje i szkolenia medyczne w Polsce</h1>`;
    body += `<p>Agregator konferencji, kongresów, webinarów i szkoleń medycznych dla lekarzy w Polsce. Filtruj po specjalizacji, mieście i terminie.</p>`;
    body += `<p><a href="/wydarzenia">Wszystkie wydarzenia medyczne</a> | <a href="/blog">Blog medyczny</a></p>`;
    body += `<h2>Specjalizacje medyczne</h2><ul>`;
    for (const [spec, slug] of Object.entries(SPECIALIZATION_SLUGS)) {
      const label =
        SPECIALIZATION_LABELS[spec as keyof typeof SPECIALIZATION_LABELS] || spec;
      body += `<li><a href="/specjalizacja/${slug}">${esc(label)}</a></li>`;
    }
    body += `</ul></main>`;
    return body;
  }

  return "";
}

async function handlePrerender(
  req: Request,
  res: Response,
  next: NextFunction,
  type: string,
  dataFn: () => Promise<any>
): Promise<void> {
  try {
    const cacheKey = req.originalUrl;

    if (isProd) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.ts < TTL_MS) {
        res.status(200).set("Content-Type", "text/html").send(cached.html);
        return;
      }
    }

    let data: any;
    try {
      data = await dataFn();
    } catch (err) {
      console.error(`[prerender] data fetch error for ${cacheKey}:`, err);
      return next();
    }

    if (data == null) return next();

    let template: string;
    try {
      template = await getTemplate();
    } catch (err) {
      console.error("[prerender] failed to read template:", err);
      return next();
    }

    if (!template.includes("<!--SSR_HEAD-->")) return next();

    const shouldInjectBody =
      !BOT_ONLY || BOT_RE.test(req.headers["user-agent"] || "");

    const head = buildHead(type, data, req.path);
    const body = shouldInjectBody ? buildBody(type, data) : "";

    const html = template
      .replace("<!--SSR_HEAD-->", head)
      .replace("<!--SSR_BODY-->", body);

    if (isProd) {
      cache.set(cacheKey, { html, ts: Date.now() });
    }

    res.status(200).set("Content-Type", "text/html").send(html);
  } catch (err) {
    console.error(`[prerender] unexpected error for ${req.originalUrl}:`, err);
    next();
  }
}

export function registerPrerenderRoutes(app: Express): void {
  const PAGE_SIZE = 100;

  app.get("/", (req, res, next) => {
    handlePrerender(req, res, next, "home", async () => ({}));
  });

  app.get("/wydarzenia", (req, res, next) => {
    const page = Math.max(1, parseInt(String(req.query.page || "1")) || 1);
    handlePrerender(req, res, next, "events-list", async () => {
      const all = await storage.getEvents({ status: "published" });
      const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
      const start = (page - 1) * PAGE_SIZE;
      return { events: all.slice(start, start + PAGE_SIZE), page, totalPages };
    });
  });

  app.get("/wydarzenia/:id", (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return next();
    handlePrerender(req, res, next, "event", async () => {
      const event = await storage.getEvent(id);
      if (!event || event.status !== "published") return null;
      const firstSpec = event.specializations?.[0];
      const related = firstSpec
        ? (
            await storage.getEvents({
              status: "published",
              specialization: firstSpec,
            })
          )
            .filter((e) => e.id !== id)
            .slice(0, 5)
        : [];
      return { event, related };
    });
  });

  app.get("/specjalizacja/:slug", (req, res, next) => {
    const specKey = SLUG_TO_SPEC[req.params.slug];
    if (!specKey) return next();
    handlePrerender(req, res, next, "specialization", async () => {
      const specLabel =
        SPECIALIZATION_LABELS[specKey as keyof typeof SPECIALIZATION_LABELS] ||
        specKey;
      const events = await storage.getEvents({
        status: "published",
        specialization: specKey,
        upcoming: true,
      });
      const allBlogPosts = await storage.getBlogPosts("published");
      return { specKey, specLabel, events, blogPosts: allBlogPosts.slice(0, 5) };
    });
  });

  app.get("/blog", (req, res, next) => {
    handlePrerender(req, res, next, "blog-list", async () => {
      const posts = await storage.getBlogPosts("published");
      return { posts };
    });
  });

  app.get("/blog/:slug", (req, res, next) => {
    handlePrerender(req, res, next, "blog-post", async () => {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      return post || null;
    });
  });
}
