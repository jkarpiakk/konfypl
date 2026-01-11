import { useEffect } from "react";
import type { Event } from "@/lib/types";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
  ogType?: "website" | "article" | "event";
  keywords?: string[];
}

export function SEOHead({ 
  title, 
  description, 
  canonical, 
  noindex,
  ogImage,
  ogType = "website",
  keywords = []
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;
    
    const updateMeta = (selector: string, attr: string, value: string, attrName: string = "content") => {
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        const [attrType, attrValue] = attr.split('=');
        meta.setAttribute(attrType, attrValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute(attrName, value);
    };

    updateMeta('meta[name="description"]', 'name=description', description);
    
    if (keywords.length > 0) {
      updateMeta('meta[name="keywords"]', 'name=keywords', keywords.join(', '));
    }

    updateMeta('meta[property="og:title"]', 'property=og:title', title);
    updateMeta('meta[property="og:description"]', 'property=og:description', description);
    updateMeta('meta[property="og:type"]', 'property=og:type', ogType);
    updateMeta('meta[property="og:site_name"]', 'property=og:site_name', 'Konfy.pl');
    updateMeta('meta[property="og:locale"]', 'property=og:locale', 'pl_PL');
    
    if (ogImage) {
      updateMeta('meta[property="og:image"]', 'property=og:image', ogImage);
      updateMeta('meta[property="og:image:width"]', 'property=og:image:width', '1200');
      updateMeta('meta[property="og:image:height"]', 'property=og:image:height', '630');
    }

    if (canonical) {
      updateMeta('meta[property="og:url"]', 'property=og:url', `https://konfy.pl${canonical}`);
    }

    updateMeta('meta[name="twitter:card"]', 'name=twitter:card', 'summary_large_image');
    updateMeta('meta[name="twitter:title"]', 'name=twitter:title', title);
    updateMeta('meta[name="twitter:description"]', 'name=twitter:description', description);
    if (ogImage) {
      updateMeta('meta[name="twitter:image"]', 'name=twitter:image', ogImage);
    }

    let robots = document.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        document.head.appendChild(robots);
      }
      robots.setAttribute('content', 'noindex, follow');
    } else {
      if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        document.head.appendChild(robots);
      }
      robots.setAttribute('content', 'index, follow');
    }

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = `https://konfy.pl${canonical}`;
    }
  }, [title, description, canonical, noindex, ogImage, ogType, keywords]);

  return null;
}

interface EventSchemaProps {
  event: Event;
}

export function EventSchema({ event }: EventSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventAttendanceMode: event.isOnline 
      ? "https://schema.org/OnlineEventAttendanceMode" 
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: event.isOnline 
      ? { "@type": "VirtualLocation", url: event.sourceUrl || "https://konfy.pl" }
      : { "@type": "Place", name: event.location || "Polska", address: { "@type": "PostalAddress", addressCountry: "PL" } },
    organizer: event.organizer ? { "@type": "Organization", name: event.organizer } : undefined,
    offers: {
      "@type": "Offer",
      price: event.price === "free" ? "0" : undefined,
      priceCurrency: "PLN",
      availability: "https://schema.org/InStock",
      url: event.sourceUrl || `https://konfy.pl/wydarzenia/${event.id}`
    },
    url: `https://konfy.pl/wydarzenia/${event.id}`
  };

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} 
    />
  );
}

interface FAQSchemaProps {
  faqs: Array<{ question: string; answer: string }>;
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} 
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://konfy.pl${item.url}`
    }))
  };

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} 
    />
  );
}

interface EventListSchemaProps {
  events: Event[];
  listName: string;
}

export function EventListSchema({ events, listName }: EventListSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: events.length,
    itemListElement: events.slice(0, 20).map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: event.title,
        startDate: event.startDate,
        url: `https://konfy.pl/wydarzenia/${event.id}`
      }
    }))
  };

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} 
    />
  );
}
