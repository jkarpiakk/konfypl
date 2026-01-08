import { format } from "date-fns";
import type { Event } from "./types";

export function generateICSContent(event: Event): string {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "yyyyMMdd");
  };

  const escapeText = (text: string) => {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  };

  const uid = `event-${event.id}@medevents.pl`;
  const dtstamp = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");
  const dtstart = formatDate(event.startDate);
  const dtend = event.endDate ? formatDate(event.endDate) : dtstart;

  const location = event.isOnline ? "Online" : (event.location || "");
  const description = event.description ? escapeText(event.description) : "";

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MedEvents.pl//Medical Events//PL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${dtstart}`,
    `DTEND;VALUE=DATE:${dtend}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${escapeText(location)}`,
    event.sourceUrl ? `URL:${event.sourceUrl}` : "",
    "END:VEVENT",
    "END:VCALENDAR"
  ].filter(Boolean).join("\r\n");

  return icsContent;
}

export function downloadICSFile(event: Event): void {
  const icsContent = generateICSContent(event);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(event: Event): string {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "yyyyMMdd");
  };

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatDate(event.startDate)}/${formatDate(event.endDate || event.startDate)}`,
    details: event.description || "",
    location: event.isOnline ? "Online" : (event.location || ""),
  });

  if (event.sourceUrl) {
    params.set("details", `${event.description || ""}\n\nWięcej informacji: ${event.sourceUrl}`);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getOutlookCalendarUrl(event: Event): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: event.startDate,
    enddt: event.endDate || event.startDate,
    body: event.description || "",
    location: event.isOnline ? "Online" : (event.location || ""),
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
