import { useState, useRef, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import * as fabric from "fabric";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Share2,
  Sparkles,
  RefreshCw,
  Type,
  Palette,
  Calendar,
  MapPin,
  Copy,
  Check,
  Image,
  Facebook,
  Instagram,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Event } from "@/lib/types";
import { SPECIALIZATION_LABELS } from "@/lib/constants";
import type { Specialization } from "@/lib/types";

interface SocialGraphicEditorModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

type SocialFormat = "facebook" | "instagram" | "stories";

const FORMAT_SIZES: Record<SocialFormat, { width: number; height: number; label: string }> = {
  facebook: { width: 1200, height: 630, label: "Facebook Post (1200x630)" },
  instagram: { width: 1080, height: 1080, label: "Instagram Post (1080x1080)" },
  stories: { width: 1080, height: 1920, label: "Instagram Stories (1080x1920)" },
};

const BACKGROUNDS = [
  { id: "gradient-mint", label: "Gradient Miętowy", type: "gradient", colors: ["#2ED3B7", "#0EA5E9"] },
  { id: "gradient-dark", label: "Gradient Ciemny", type: "gradient", colors: ["#0F172A", "#1E293B"] },
  { id: "gradient-medical", label: "Gradient Medyczny", type: "gradient", colors: ["#2ED3B7", "#0F172A"] },
  { id: "solid-mint", label: "Miętowy", type: "solid", color: "#2ED3B7" },
  { id: "solid-dark", label: "Ciemny", type: "solid", color: "#0F172A" },
  { id: "solid-light", label: "Jasny", type: "solid", color: "#F8FAFC" },
  { id: "pattern-waves", label: "Fale", type: "pattern", baseColor: "#2ED3B7" },
  { id: "pattern-dots", label: "Kropki", type: "pattern", baseColor: "#0F172A" },
];

const FONTS = [
  { id: "Manrope", label: "Manrope" },
  { id: "Inter", label: "Inter" },
  { id: "Poppins", label: "Poppins" },
];

export function SocialGraphicEditorModal({
  event,
  open,
  onClose,
}: SocialGraphicEditorModalProps) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  
  const [format, setFormat] = useState<SocialFormat>("facebook");
  const [selectedBackground, setSelectedBackground] = useState(BACKGROUNDS[0].id);
  const [selectedFont, setSelectedFont] = useState("Manrope");
  const [titleSize, setTitleSize] = useState([48]);
  const [dateSize, setDateSize] = useState([24]);
  const [customTitle, setCustomTitle] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [postText, setPostText] = useState("");
  const [shortText, setShortText] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showPromotion, setShowPromotion] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  
  const [logoX, setLogoX] = useState([5]);
  const [logoY, setLogoY] = useState([5]);
  const [titleX, setTitleX] = useState([5]);
  const [titleY, setTitleY] = useState([25]);
  const [infoX, setInfoX] = useState([5]);
  const [infoY, setInfoY] = useState([72]);
  const [ctaX, setCtaX] = useState([5]);
  const [ctaY, setCtaY] = useState([88]);
  const [ctaText, setCtaText] = useState("Zapisz się →");

  const generateCopyMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const response = await apiRequest("POST", `/api/events/${eventId}/social-copy`);
      const data = await response.json();
      return data;
    },
    onSuccess: (data: any) => {
      setPostText(data.postText || "");
      setShortText(data.shortText || "");
      setHashtags(data.hashtags || []);
      toast({
        title: "Wygenerowano treść!",
        description: "Tekst posta i hashtagi zostały wygenerowane przez AI.",
      });
    },
    onError: () => {
      toast({
        title: "Błąd",
        description: "Nie udało się wygenerować treści.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (event) {
      const eventDate = event.startDate
        ? new Date(event.startDate).toLocaleDateString("pl-PL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "";
      setCustomTitle(event.title);
      setCustomDate(eventDate);
      setCustomLocation(
        event.isOnline ? "Online" : event.location || (event as any).city || ""
      );
    }
  }, [event]);

  const getScaleFactor = useCallback(() => {
    const containerWidth = 500;
    const { width } = FORMAT_SIZES[format];
    return containerWidth / width;
  }, [format]);

  const initCanvas = useCallback(() => {
    if (!canvasRef.current || !event) return;

    if (fabricRef.current) {
      fabricRef.current.dispose();
    }

    const { width, height } = FORMAT_SIZES[format];
    const scale = getScaleFactor();
    
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: width * scale,
      height: height * scale,
      backgroundColor: "#F8FAFC",
    });
    fabricRef.current = canvas;

    renderCanvas();
  }, [format, event, getScaleFactor]);

  const renderCanvas = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || !event) return;

    canvas.clear();
    const { width, height } = FORMAT_SIZES[format];
    const scale = getScaleFactor();

    const bg = BACKGROUNDS.find((b) => b.id === selectedBackground);
    if (bg) {
      if (bg.type === "gradient" && bg.colors) {
        const gradient = new fabric.Gradient({
          type: "linear",
          coords: { x1: 0, y1: 0, x2: width * scale, y2: height * scale },
          colorStops: [
            { offset: 0, color: bg.colors[0] },
            { offset: 1, color: bg.colors[1] },
          ],
        });
        canvas.backgroundColor = gradient as any;
      } else if (bg.type === "solid" && bg.color) {
        canvas.backgroundColor = bg.color;
      } else if (bg.type === "pattern" && bg.baseColor) {
        canvas.backgroundColor = bg.baseColor;
        for (let i = 0; i < 10; i++) {
          const circle = new fabric.Circle({
            radius: 20 * scale,
            fill: "rgba(255,255,255,0.1)",
            left: Math.random() * width * scale,
            top: Math.random() * height * scale,
            selectable: false,
          });
          canvas.add(circle);
        }
      }
    }

    const isDark = ["gradient-dark", "gradient-medical", "solid-dark", "pattern-dots"].includes(selectedBackground);
    const textColor = isDark ? "#FFFFFF" : "#0F172A";
    const secondaryColor = isDark ? "rgba(255,255,255,0.8)" : "#64748B";

    const padding = 60 * scale;
    const titleFontSize = titleSize[0] * scale;
    const dateFontSize = dateSize[0] * scale;

    if (format === "stories") {
      const logo = new fabric.Text("konfy.pl", {
        left: padding,
        top: padding,
        fontSize: 24 * scale,
        fontFamily: selectedFont,
        fontWeight: "600",
        fill: textColor,
        originX: "left",
        originY: "top",
        selectable: false,
      });
      canvas.add(logo);

      const title = new fabric.Textbox(customTitle || event.title, {
        left: padding,
        top: height * scale * 0.3,
        width: (width - 120) * scale,
        fontSize: titleFontSize,
        fontFamily: selectedFont,
        fontWeight: "700",
        fill: textColor,
        lineHeight: 1.2,
        originX: "left",
        originY: "top",
        selectable: false,
      });
      canvas.add(title);

      const dateText = new fabric.Text(customDate, {
        left: padding,
        top: height * scale * 0.52,
        fontSize: dateFontSize,
        fontFamily: selectedFont,
        fill: secondaryColor,
        originX: "left",
        originY: "top",
        selectable: false,
      });
      canvas.add(dateText);

      const locationText = new fabric.Text(`Miejsce: ${customLocation}`, {
        left: padding,
        top: height * scale * 0.52 + dateFontSize + 12 * scale,
        fontSize: dateFontSize,
        fontFamily: selectedFont,
        fill: secondaryColor,
        originX: "left",
        originY: "top",
        selectable: false,
      });
      canvas.add(locationText);

      if (showPromotion && event.promotionTier && event.promotionTier !== "none") {
        const badgeText = event.promotionTier === "max" ? "MAX" : event.promotionTier === "pro" ? "PRO" : "PROMOWANE";
        const badge = new fabric.Text(badgeText, {
          left: width * scale - padding,
          top: padding,
          fontSize: 18 * scale,
          fontFamily: selectedFont,
          fontWeight: "600",
          fill: event.promotionTier === "max" ? "#FF8C00" : event.promotionTier === "pro" ? "#0EA5E9" : "#2ED3B7",
          originX: "right",
          originY: "top",
          selectable: false,
        });
        canvas.add(badge);
      }

      const cta = new fabric.Rect({
        left: padding,
        top: height * scale - padding - 60 * scale,
        width: (width - 120) * scale,
        height: 50 * scale,
        fill: "#2ED3B7",
        rx: 25 * scale,
        ry: 25 * scale,
        selectable: false,
      });
      canvas.add(cta);

      const ctaText = new fabric.Text("Zapisz się już dziś! →", {
        left: width * scale / 2,
        top: height * scale - padding - 45 * scale,
        fontSize: 18 * scale,
        fontFamily: selectedFont,
        fontWeight: "600",
        fill: "#0F172A",
        originX: "center",
        originY: "top",
        selectable: false,
      });
      canvas.add(ctaText);

    } else {
      if (showLogo) {
        const logoGroup = new fabric.Group([], {
          left: (logoX[0] / 100) * width * scale,
          top: (logoY[0] / 100) * height * scale,
          originX: "left",
          originY: "top",
          selectable: false,
        });

        const konfyText = new fabric.Text("konfy", {
          left: 0,
          top: 0,
          fontSize: 28 * scale,
          fontFamily: selectedFont,
          fontWeight: "600",
          fill: textColor,
          originX: "left",
          originY: "top",
        });

        const plText = new fabric.Text(".pl", {
          left: konfyText.width || 0,
          top: 0,
          fontSize: 28 * scale,
          fontFamily: selectedFont,
          fontWeight: "600",
          fill: "#2ED3B7",
          originX: "left",
          originY: "top",
        });

        logoGroup.add(konfyText, plText);
        canvas.add(logoGroup);
      }

      const specs = event.specializations
        .slice(0, 2)
        .map((s) => SPECIALIZATION_LABELS[s as Specialization] || s)
        .join(" • ");

      if (specs) {
        const specsText = new fabric.Text(specs.toUpperCase(), {
          left: (logoX[0] / 100) * width * scale,
          top: (logoY[0] / 100) * height * scale + 40 * scale,
          fontSize: 14 * scale,
          fontFamily: selectedFont,
          fontWeight: "500",
          fill: "#2ED3B7",
          originX: "left",
          originY: "top",
          selectable: false,
        });
        canvas.add(specsText);
      }

      const maxTitleWidth = width * scale - (titleX[0] / 100) * width * scale - padding;
      const title = new fabric.Textbox(customTitle || event.title, {
        left: (titleX[0] / 100) * width * scale,
        top: (titleY[0] / 100) * height * scale,
        width: maxTitleWidth,
        fontSize: titleFontSize,
        fontFamily: selectedFont,
        fontWeight: "700",
        fill: textColor,
        lineHeight: 1.2,
        originX: "left",
        originY: "top",
        selectable: false,
      });
      canvas.add(title);

      const lineSpacing = 8 * scale;
      
      const dateText = new fabric.Text(customDate, {
        left: (infoX[0] / 100) * width * scale,
        top: (infoY[0] / 100) * height * scale,
        fontSize: dateFontSize,
        fontFamily: selectedFont,
        fill: secondaryColor,
        originX: "left",
        originY: "top",
        selectable: false,
      });
      canvas.add(dateText);

      const locationText = new fabric.Text(`Miejsce: ${customLocation}`, {
        left: (infoX[0] / 100) * width * scale,
        top: (infoY[0] / 100) * height * scale + dateFontSize + lineSpacing,
        fontSize: dateFontSize,
        fontFamily: selectedFont,
        fill: secondaryColor,
        originX: "left",
        originY: "top",
        selectable: false,
      });
      canvas.add(locationText);

      if (showPromotion && event.promotionTier && event.promotionTier !== "none") {
        const tierColors: Record<string, string> = {
          basic: "#2ED3B7",
          pro: "#0EA5E9",
          max: "#FF8C00",
        };
        const tierLabels: Record<string, string> = {
          basic: "PROMOWANE",
          pro: "PRO",
          max: "MAX",
        };
        const badge = new fabric.Text(tierLabels[event.promotionTier] || "", {
          left: width * scale - padding,
          top: padding,
          fontSize: 16 * scale,
          fontFamily: selectedFont,
          fontWeight: "700",
          fill: tierColors[event.promotionTier] || "#2ED3B7",
          originX: "right",
          originY: "top",
          selectable: false,
        });
        canvas.add(badge);
      }

      const ctaLeftPos = (ctaX[0] / 100) * width * scale;
      const ctaTopPos = (ctaY[0] / 100) * height * scale;
      const cta = new fabric.Rect({
        left: ctaLeftPos,
        top: ctaTopPos,
        width: 200 * scale,
        height: 45 * scale,
        fill: "#2ED3B7",
        rx: 22 * scale,
        ry: 22 * scale,
        selectable: false,
      });
      canvas.add(cta);

      const ctaLabel = new fabric.Text(ctaText, {
        left: ctaLeftPos + 100 * scale,
        top: ctaTopPos + 13 * scale,
        fontSize: 16 * scale,
        fontFamily: selectedFont,
        fontWeight: "600",
        fill: "#0F172A",
        originX: "center",
        originY: "top",
        selectable: false,
      });
      canvas.add(ctaLabel);
    }

    canvas.renderAll();
  }, [event, format, selectedBackground, selectedFont, titleSize, dateSize, customTitle, customDate, customLocation, showPromotion, showLogo, logoX, logoY, titleX, titleY, infoX, infoY, ctaX, ctaY, ctaText, getScaleFactor]);

  useEffect(() => {
    if (open && event) {
      setTimeout(() => {
        initCanvas();
      }, 100);
    }
    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, [open, event, initCanvas]);

  useEffect(() => {
    if (fabricRef.current) {
      renderCanvas();
    }
  }, [renderCanvas]);

  const handleDownload = () => {
    if (!fabricRef.current || !event) return;

    const { width, height } = FORMAT_SIZES[format];
    const exportScale = 2;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = width * exportScale;
    exportCanvas.height = height * exportScale;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    const originalCanvas = fabricRef.current.toCanvasElement(exportScale / getScaleFactor());
    ctx.drawImage(originalCanvas, 0, 0);

    const link = document.createElement("a");
    link.download = `${event.title.substring(0, 30).replace(/[^a-zA-Z0-9]/g, "_")}_${format}.jpg`;
    link.href = exportCanvas.toDataURL("image/jpeg", 0.95);
    link.click();

    toast({
      title: "Pobrano!",
      description: `Grafika ${FORMAT_SIZES[format].label} została pobrana.`,
    });
  };

  const handleShare = async () => {
    if (!fabricRef.current || !event) return;

    try {
      const { width, height } = FORMAT_SIZES[format];
      const exportScale = 2;
      const originalCanvas = fabricRef.current.toCanvasElement(exportScale / getScaleFactor());

      const blob = await new Promise<Blob>((resolve) => {
        originalCanvas.toBlob((b: Blob | null) => resolve(b!), "image/jpeg", 0.95);
      });

      if (navigator.share && typeof navigator.canShare === 'function') {
        const file = new File([blob], `${event.title.substring(0, 30)}.jpg`, { type: "image/jpeg" });
        await navigator.share({
          title: event.title,
          text: postText || shortText,
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        toast({
          title: "Otwarto w nowej karcie",
          description: "Możesz teraz zapisać i udostępnić grafikę.",
        });
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const copyToClipboard = (text: string, type: "text" | "hashtags") => {
    navigator.clipboard.writeText(text);
    if (type === "hashtags") {
      setCopiedHashtags(true);
      setTimeout(() => setCopiedHashtags(false), 2000);
    } else {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
    toast({
      title: "Skopiowano!",
      description: type === "hashtags" ? "Hashtagi skopiowane do schowka" : "Tekst skopiowany do schowka",
    });
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="w-5 h-5 text-[#2ED3B7]" />
            Generator grafik do social media
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Tabs value={format} onValueChange={(v) => setFormat(v as SocialFormat)}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="facebook" className="gap-2" data-testid="tab-facebook">
                  <Facebook className="w-4 h-4" />
                  Facebook
                </TabsTrigger>
                <TabsTrigger value="instagram" className="gap-2" data-testid="tab-instagram">
                  <Instagram className="w-4 h-4" />
                  IG Post
                </TabsTrigger>
                <TabsTrigger value="stories" className="gap-2" data-testid="tab-stories">
                  <Instagram className="w-4 h-4" />
                  Stories
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="border rounded-lg p-4 bg-muted/30 flex justify-center">
              <canvas ref={canvasRef} className="rounded shadow-lg" />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleDownload} className="flex-1 gap-2" data-testid="button-download">
                <Download className="w-4 h-4" />
                Pobierz JPG
              </Button>
              <Button onClick={handleShare} variant="outline" className="flex-1 gap-2" data-testid="button-share">
                <Share2 className="w-4 h-4" />
                Udostępnij
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-muted-foreground" />
                <Label>Tło</Label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBackground(bg.id)}
                    className={`h-12 rounded-md border-2 transition-all ${
                      selectedBackground === bg.id ? "border-[#2ED3B7] ring-2 ring-[#2ED3B7]/30" : "border-border"
                    }`}
                    style={{
                      background: bg.type === "gradient" && bg.colors
                        ? `linear-gradient(135deg, ${bg.colors[0]}, ${bg.colors[1]})`
                        : bg.type === "solid" && bg.color
                        ? bg.color
                        : bg.baseColor,
                    }}
                    title={bg.label}
                    data-testid={`button-bg-${bg.id}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-muted-foreground" />
                <Label>Tekst wydarzenia</Label>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Tytuł</Label>
                  <Input
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Tytuł wydarzenia"
                    data-testid="input-title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Data</Label>
                    <Input
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      placeholder="Data"
                      data-testid="input-date"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Lokalizacja</Label>
                    <Input
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      placeholder="Lokalizacja"
                      data-testid="input-location"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Czcionka</Label>
                    <Select value={selectedFont} onValueChange={setSelectedFont}>
                      <SelectTrigger data-testid="select-font">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONTS.map((font) => (
                          <SelectItem key={font.id} value={font.id}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Rozmiar tytułu: {titleSize[0]}px</Label>
                    <Slider
                      value={titleSize}
                      onValueChange={setTitleSize}
                      min={32}
                      max={72}
                      step={2}
                      className="mt-2"
                      data-testid="slider-title-size"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <Label>Pozycja elementów (%)</Label>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="showLogo"
                    checked={showLogo}
                    onChange={(e) => setShowLogo(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="showLogo" className="text-sm cursor-pointer">Pokaż logo konfy.pl</Label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Logo X: {logoX[0]}%</Label>
                    <Slider
                      value={logoX}
                      onValueChange={setLogoX}
                      min={0}
                      max={80}
                      step={1}
                      className="mt-1"
                      data-testid="slider-logo-x"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Logo Y: {logoY[0]}%</Label>
                    <Slider
                      value={logoY}
                      onValueChange={setLogoY}
                      min={0}
                      max={50}
                      step={1}
                      className="mt-1"
                      data-testid="slider-logo-y"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Tytuł X: {titleX[0]}%</Label>
                    <Slider
                      value={titleX}
                      onValueChange={setTitleX}
                      min={0}
                      max={50}
                      step={1}
                      className="mt-1"
                      data-testid="slider-title-x"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Tytuł Y: {titleY[0]}%</Label>
                    <Slider
                      value={titleY}
                      onValueChange={setTitleY}
                      min={10}
                      max={70}
                      step={1}
                      className="mt-1"
                      data-testid="slider-title-y"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Data/Miejsce X: {infoX[0]}%</Label>
                    <Slider
                      value={infoX}
                      onValueChange={setInfoX}
                      min={0}
                      max={50}
                      step={1}
                      className="mt-1"
                      data-testid="slider-info-x"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Data/Miejsce Y: {infoY[0]}%</Label>
                    <Slider
                      value={infoY}
                      onValueChange={setInfoY}
                      min={50}
                      max={95}
                      step={1}
                      className="mt-1"
                      data-testid="slider-info-y"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t">
                  <Label className="text-sm font-medium">Przycisk CTA</Label>
                  <div>
                    <Label className="text-xs text-muted-foreground">Tekst przycisku</Label>
                    <Input
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="mt-1"
                      data-testid="input-cta-text"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">CTA X: {ctaX[0]}%</Label>
                      <Slider
                        value={ctaX}
                        onValueChange={setCtaX}
                        min={0}
                        max={60}
                        step={1}
                        className="mt-1"
                        data-testid="slider-cta-x"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">CTA Y: {ctaY[0]}%</Label>
                      <Slider
                        value={ctaY}
                        onValueChange={setCtaY}
                        min={50}
                        max={95}
                        step={1}
                        className="mt-1"
                        data-testid="slider-cta-y"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2ED3B7]" />
                  <Label>Treść posta (AI)</Label>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateCopyMutation.mutate(event.id)}
                  disabled={generateCopyMutation.isPending}
                  className="gap-2"
                  data-testid="button-generate-ai"
                >
                  {generateCopyMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Generuj AI
                </Button>
              </div>

              {generateCopyMutation.isPending ? (
                <div className="space-y-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs text-muted-foreground">Tekst posta</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(postText, "text")}
                        className="h-6 px-2 gap-1"
                        data-testid="button-copy-text"
                      >
                        {copiedText ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedText ? "Skopiowano" : "Kopiuj"}
                      </Button>
                    </div>
                    <Textarea
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      placeholder="Wygeneruj tekst za pomocą AI lub wpisz własny..."
                      rows={3}
                      data-testid="textarea-post-text"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs text-muted-foreground">Hashtagi</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(hashtags.join(" "), "hashtags")}
                        className="h-6 px-2 gap-1"
                        disabled={hashtags.length === 0}
                        data-testid="button-copy-hashtags"
                      >
                        {copiedHashtags ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedHashtags ? "Skopiowano" : "Kopiuj"}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {hashtags.length > 0 ? (
                        hashtags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Kliknij "Generuj AI" aby wygenerować hashtagi
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
