"use client";

import { useEffect, useRef, useState } from "react";
import { LocateFixed, MapPin } from "lucide-react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import type { Locale } from "@/lib/i18n";

type LocationValue = {
  latitude: number | null;
  longitude: number | null;
};

type LocationPickerProps = {
  locale: Locale;
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  latitudeName?: string;
  longitudeName?: string;
  defaultCenter?: [number, number];
};

const kabulCenter: [number, number] = [34.526, 69.1777];

export function LocationPicker({
  locale,
  value,
  onChange,
  latitudeName,
  longitudeName,
  defaultCenter = kabulCenter
}: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const [locating, setLocating] = useState(false);
  const selectedCenter: [number, number] =
    typeof value.latitude === "number" && typeof value.longitude === "number"
      ? [value.latitude, value.longitude]
      : defaultCenter;

  const labels = {
    title: locale === "en" ? "Map pin" : locale === "ps" ? "د نقشې ځای" : "نشانۀ نقشه",
    hint:
      locale === "en"
        ? "Click the map or drag the pin to set the exact storefront location."
        : locale === "ps"
          ? "د پلورنځي دقیق ځای ټاکلو لپاره په نقشه کلیک وکړئ یا نښه کش کړئ."
          : "برای تعیین موقعیت دقیق فروشگاه، روی نقشه کلیک کنید یا نشانه را بکشید.",
    current: locale === "en" ? "Use current location" : locale === "ps" ? "اوسنی ځای وکاروئ" : "استفاده از موقعیت فعلی",
    lat: locale === "en" ? "Latitude" : locale === "ps" ? "عرض البلد" : "عرض جغرافیایی",
    lng: locale === "en" ? "Longitude" : locale === "ps" ? "طول البلد" : "طول جغرافیایی"
  };

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    async function mountMap() {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      mapRef.current?.remove();

      const map = L.map(containerRef.current, {
        attributionControl: true,
        scrollWheelZoom: false
      }).setView(selectedCenter, value.latitude && value.longitude ? 16 : 12);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const icon = L.divIcon({
        className: "paidaco-map-marker picker",
        html: '<span></span>',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      const marker = L.marker(selectedCenter, {
        draggable: true,
        icon
      }).addTo(map);

      marker.on("dragend", () => {
        const next = marker.getLatLng();
        onChange({ latitude: next.lat, longitude: next.lng });
      });

      map.on("click", (event) => {
        marker.setLatLng(event.latlng);
        onChange({ latitude: event.latlng.lat, longitude: event.latlng.lng });
      });

      mapRef.current = map;
      markerRef.current = marker;
      window.setTimeout(() => map.invalidateSize(), 0);
    }

    mountMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || typeof value.latitude !== "number" || typeof value.longitude !== "number") return;

    const next: [number, number] = [value.latitude, value.longitude];
    markerRef.current.setLatLng(next);
    mapRef.current.setView(next, Math.max(mapRef.current.getZoom(), 15));
  }, [value.latitude, value.longitude]);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        onChange({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const updateCoordinate = (key: keyof LocationValue, rawValue: string) => {
    const parsed = Number(rawValue);
    onChange({
      ...value,
      [key]: Number.isFinite(parsed) ? parsed : null
    });
  };

  return (
    <div className="location-picker">
      <div className="location-picker-head">
        <div>
          <strong>
            <MapPin size={16} />
            {labels.title}
          </strong>
          <span>{labels.hint}</span>
        </div>
        <button type="button" onClick={useCurrentLocation} disabled={locating}>
          <LocateFixed size={15} />
          {locating ? "..." : labels.current}
        </button>
      </div>
      <div ref={containerRef} className="location-picker-map" />
      <div className="coordinate-grid">
        <label>
          <span>{labels.lat}</span>
          <input
            name={latitudeName}
            inputMode="decimal"
            value={value.latitude ?? ""}
            onChange={(event) => updateCoordinate("latitude", event.target.value)}
            placeholder="34.5260"
          />
        </label>
        <label>
          <span>{labels.lng}</span>
          <input
            name={longitudeName}
            inputMode="decimal"
            value={value.longitude ?? ""}
            onChange={(event) => updateCoordinate("longitude", event.target.value)}
            placeholder="69.1777"
          />
        </label>
      </div>
    </div>
  );
}
