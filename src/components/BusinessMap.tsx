"use client";

import { useEffect, useRef } from "react";
import { MapPinned, Navigation } from "lucide-react";
import type { Map as LeafletMap } from "leaflet";
import type { Locale } from "@/lib/i18n";

type BusinessMapProps = {
  latitude: number | null;
  longitude: number | null;
  name: string;
  address: string;
  locale: Locale;
};

export function BusinessMap({ latitude, longitude, name, address, locale }: BusinessMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const hasPin = typeof latitude === "number" && typeof longitude === "number";

  useEffect(() => {
    if (!hasPin || !containerRef.current) return;

    let cancelled = false;
    const lat = latitude;
    const lng = longitude;
    if (typeof lat !== "number" || typeof lng !== "number") return;

    async function mountMap() {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      mapRef.current?.remove();

      const map = L.map(containerRef.current, {
        attributionControl: true,
        scrollWheelZoom: false
      }).setView([lat, lng], 16);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const icon = L.divIcon({
        className: "paidaco-map-marker",
        html: '<span></span>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });

      L.marker([lat, lng], { icon }).addTo(map).bindPopup(`<strong>${escapeHtml(name)}</strong><br>${escapeHtml(address)}`);

      mapRef.current = map;
      window.setTimeout(() => map.invalidateSize(), 0);
    }

    mountMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [address, hasPin, latitude, longitude, name]);

  if (!hasPin) {
    return (
      <div className="map-empty-state">
        <MapPinned size={24} />
        <strong>{locale === "en" ? "Map pin not added yet" : locale === "ps" ? "د نقشې ځای لا نه دی اضافه شوی" : "نشانۀ نقشه هنوز اضافه نشده"}</strong>
        <span>{address}</span>
      </div>
    );
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <div className="business-map-card">
      <div ref={containerRef} className="business-map-canvas" aria-label={name} />
      <div className="map-actions">
        <span>
          {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </span>
        <a href={directionsUrl} target="_blank" rel="noreferrer">
          <Navigation size={15} />
          {locale === "en" ? "Directions" : locale === "ps" ? "لارښوونې" : "مسیر"}
        </a>
      </div>
    </div>
  );
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character] ?? character;
  });
}
