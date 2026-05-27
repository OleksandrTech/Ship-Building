"use client";

import { useEffect, useRef } from "react";

type MapSectionProps = {
  address: string;
  lat?: number;
  lng?: number;
};

export default function MapSection({ address, lat, lng }: MapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    if (typeof window === "undefined") return;

    // Coordinates: default to Rotterdam area if not provided
    const coords: [number, number] = lat && lng ? [lat, lng] : [51.9225, 4.47917];

    import("leaflet").then((L) => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Fix default icon paths for Next.js
      // @ts-expect-error leaflet internal
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: coords,
        zoom: 12,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Custom red pulse marker
      const redIcon = L.divIcon({
        className: "",
        html: `
          <div style="position:relative;width:36px;height:36px;">
            <div style="
              position:absolute;inset:0;
              border-radius:50%;
              background:rgba(220,38,38,0.25);
              animation:pulse-ring 1.8s ease-out infinite;
            "></div>
            <div style="
              position:absolute;top:50%;left:50%;
              width:16px;height:16px;
              transform:translate(-50%,-50%);
              border-radius:50%;
              background:#dc2626;
              border:2.5px solid #fff;
              box-shadow:0 2px 8px rgba(0,0,0,0.4);
            "></div>
          </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
      });

      const marker = L.marker(coords, { icon: redIcon }).addTo(map);
      if (address) {
        marker.bindPopup(`<span style="font-size:13px;font-weight:500">${address}</span>`).openPopup();
      }

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, address]);

  return (
    <>
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(0.4); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .leaflet-container { background: #1a1a1a; }
      `}</style>
      <section className="relative w-full" style={{ height: "380px" }}>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <div ref={mapRef} className="w-full h-full" />
      </section>
    </>
  );
}