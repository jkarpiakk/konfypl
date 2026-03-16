import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { ArrowLeft, Clock, User } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SEOFooter } from "@/components/SEOFooter";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SPECIALIZATION_LABELS } from "@/lib/constants";
import { SPECIALIZATION_SLUGS } from "@/lib/seo-data";
import type { Specialization } from "@/lib/types";

interface BlogPostData {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  coverImage: string | null;
  specialization: string | null;
  tags: string[];
  authorName: string;
  readingTimeMinutes: number;
  publishedAt: string | null;
  updatedAt: string | null;
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";

  const { data: post, isLoading, error } = useQuery<BlogPostData>({
    queryKey: ["/api/blog", slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navigation />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-64 mb-8" />
          <Skeleton className="h-96 w-full rounded-xl mb-8" />
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-4 w-full" />)}
          </div>
        </main>
      </div>
    );
  }

  if (!post || error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navigation />
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="font-heading text-2xl font-bold text-[#0F172A] mb-4">Artykuł nie znaleziony</h1>
          <p className="text-[#64748B] mb-6">Ten artykuł nie istnieje lub nie został jeszcze opublikowany.</p>
          <Link href="/blog">
            <Button className="bg-[#2ED3B7] text-[#0F172A] hover:bg-[#25B9A1] rounded-full">
              ← Wróć do bloga
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  const specSlug = post.specialization ? SPECIALIZATION_SLUGS[post.specialization as Specialization] : null;
  const specLabel = post.specialization ? SPECIALIZATION_LABELS[post.specialization as Specialization] : null;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "author": { "@type": "Person", "name": post.authorName },
    "publisher": { "@type": "Organization", "name": "Konfy.pl", "url": "https://konfy.pl" },
    "url": `https://konfy.pl/blog/${post.slug}`,
    "image": post.coverImage || undefined,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEOHead
        title={post.metaTitle ?? post.title}
        description={post.metaDescription ?? post.excerpt}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        ogImage={post.coverImage || undefined}
      />
      <BreadcrumbSchema items={[
        { name: "Konfy.pl", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: post.title, url: `/blog/${post.slug}` },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-1 text-[#2ED3B7] hover:underline text-sm mb-6" data-testid="link-back-to-blog">
          <ArrowLeft className="w-4 h-4" />
          Wróć do bloga
        </Link>

        {post.specialization && specLabel && (
          <Badge className="bg-[#E6FAF7] text-[#0F766E] border-[#99F6E4] text-xs mb-3">
            {specLabel}
          </Badge>
        )}

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#0F172A]" data-testid="text-article-title">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748B] mt-3">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {post.authorName}
          </span>
          {post.publishedAt && (
            <span>{format(new Date(post.publishedAt), "d MMMM yyyy", { locale: pl })}</span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.readingTimeMinutes} min czytania
          </span>
        </div>

        <Separator className="my-6" />

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full max-h-96 object-cover rounded-xl mb-8"
          />
        )}

        <div
          className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-[#0F172A] prose-a:text-[#2ED3B7] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#0F172A]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.specialization && specSlug && specLabel && (
          <div className="mt-12 p-6 bg-[#E6FAF7] rounded-xl">
            <p className="font-semibold text-[#0F172A] mb-2">
              Szukasz konferencji z tej dziedziny?
            </p>
            <Link href={`/${specSlug}`}>
              <Button className="bg-[#2ED3B7] text-[#0F172A] hover:bg-[#25B9A1] rounded-full">
                Zobacz konferencje — {specLabel}
              </Button>
            </Link>
          </div>
        )}
      </main>

      <SEOFooter />
    </div>
  );
}
