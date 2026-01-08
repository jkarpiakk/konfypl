import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbSchema } from "./SEOHead";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems = [{ name: "Strona główna", url: "/" }, ...items];

  return (
    <>
      <BreadcrumbSchema items={allItems} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-[#64748B] py-3">
        {allItems.map((item, index) => (
          <span key={item.url} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="w-4 h-4" />}
            {index === allItems.length - 1 ? (
              <span className="text-[#0F172A] font-medium">{item.name}</span>
            ) : (
              <Link href={item.url} className="hover:text-[#2ED3B7] transition-colors flex items-center gap-1">
                {index === 0 && <Home className="w-4 h-4" />}
                {item.name}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
