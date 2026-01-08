import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-lg mx-auto px-4 py-16">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2" data-testid="text-404-title">
              Strona nie znaleziona
            </h1>
            <p className="text-muted-foreground mb-6">
              Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona.
            </p>
            <Link href="/">
              <Button className="gap-2" data-testid="button-go-home">
                <Home className="w-4 h-4" />
                Wróć do strony głównej
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
