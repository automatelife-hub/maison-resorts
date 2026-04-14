'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { FEATURED_DESTINATIONS } from '@/data/destinations';

export function InteractiveMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json', // Basic style, can be replaced with custom luxury style
      center: [15, 45], // Central Europe
      zoom: 3,
    });

    map.current.addControl(new maplibregl.NavigationControl());

    FEATURED_DESTINATIONS.forEach((dest) => {
      // Create a luxury-themed marker
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundColor = '#d4af37'; // Accent gold
      el.style.border = '2px solid #1a1a1a'; // Luxury dark
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.5)';

      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 10px; font-family: sans-serif;">
          <img src="${dest.image}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; mb: 8px;" />
          <h3 style="margin: 8px 0 4px; font-weight: bold; color: #1a1a1a;">${dest.name}</h3>
          <p style="margin: 0; font-size: 12px; color: #666;">${dest.vibe}</p>
          <a href="/explore" style="display: inline-block; margin-top: 8px; font-size: 12px; color: #d4af37; text-decoration: none; font-weight: bold;">EXPLORE →</a>
        </div>
      `);

      new maplibregl.Marker(el)
        .setLngLat([dest.longitude, dest.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100 max-w-xs">
        <h3 className="font-bold text-luxury mb-1 italic font-serif">Discovery Map</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Navigate through our curated 2026 European niche spots. 
          Each pin represents a sanctuary of conscious authenticity.
        </p>
      </div>
    </div>
  );
}
