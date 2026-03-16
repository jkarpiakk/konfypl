import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Clock, PenLine } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SEOFooter } from "@/components/SEOFooter";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SPECIALIZATION_LABELS } from "@/lib/constants";
import type { Specialization } from "@/lib/types";

interface BlogPostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  specialization: string | null;
  tags: string[];
  authorName: string;
  readingTimeMinutes: number;
  publishedAt: string | null;
}

export default function BlogIndex() {
  const { data: posts = [], isLoading } = useQuery<BlogPostSummary[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEOHead
        title="Blog Medyczny | Konferencje i Szkolenia | Konfy.pl"
        description="Artykuły o konferencjach medycznych, punktach edukacyjnych i rozwoju zawodowym lekarzy w Polsce."
        canonical="/blog"
      />
      <BreadcrumbSchema items={[
        { name: "Konfy.pl", url: "/" },
        { name: "Blog", url: "/blog" },
      ]} />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#0F172A] mb-8" data-testid="text-blog-title">
          Blog — wiedza dla lekarzy
        </h1>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1,2,3,4,5,6].map(i => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card className="bg-white border-[#E2E8F0]">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <PenLine className="w-10 h-10 text-[#94A3B8] mb-4" />
              <p className="text-[#64748B]">Brak artykułów</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <Card key={post.id} className="bg-white border-[#E2E8F0] rounded-2xl overflow-hidden hover:shadow-md transition-shadow" data-testid={`card-blog-${post.id}`}>
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full aspect-video object-cover"
                  />
                )}
                <CardContent className="p-5">
                  {post.specialization && (
                    <Badge className="bg-[#E6FAF7] text-[#0F766E] border-[#99F6E4] text-xs mb-3">
                      {SPECIALIZATION_LABELS[post.specialization as Specialization] || post.specialization}
                    </Badge>
                  )}
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="font-heading font-semibold text-lg text-[#0F172A] line-clamp-2 hover:text-[#2ED3B7] transition-colors cursor-pointer" data-testid={`text-blog-title-${post.id}`}>
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-[#64748B] line-clamp-3 mt-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[#94A3B8] mt-4">
                    {post.publishedAt && (
                      <span>{format(new Date(post.publishedAt), "d MMM yyyy", { locale: pl })}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTimeMinutes} min czytania
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="text-[#2ED3B7] text-sm font-medium mt-3 inline-block hover:underline" data-testid={`link-read-more-${post.id}`}>
                    Czytaj dalej →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <SEOFooter />
    </div>
  );
}
