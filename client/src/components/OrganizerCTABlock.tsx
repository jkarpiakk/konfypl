import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Megaphone, ArrowRight } from "lucide-react";

export function OrganizerCTABlock() {
  return (
    <div className="bg-gradient-to-r from-[#2ED3B7]/10 to-[#2ED3B7]/5 rounded-xl p-4 mb-6 border border-[#2ED3B7]/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2ED3B7]/20 flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5 text-[#2ED3B7]" />
          </div>
          <div>
            <p className="font-semibold text-[#0F172A]">
              Jestes organizatorem?
            </p>
            <p className="text-sm text-[#64748B]">
              Promuj swoje wydarzenie i dotrzyj do tysiecy lekarzy
            </p>
          </div>
        </div>
        <Link href="/promuj">
          <Button
            size="sm"
            className="gap-2 rounded-full bg-[#2ED3B7] text-[#0F172A] hover:bg-[#25B9A1] shrink-0"
            data-testid="button-organizer-cta"
          >
            Promuj wydarzenie
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
