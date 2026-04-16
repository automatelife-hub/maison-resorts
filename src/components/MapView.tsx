'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Hotel {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  price?: number;
}

interface MapViewProps {
  hotels: Hotel[];
  onHotelSelect?: (hotelId: string) => void;
}

export function MapView({ hotels, onHotelSelect }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/style.json', // Basic style, in prod use a luxury theme
      center: hotels.length > 0 ? [hotels[0].longitude, hotels[0].latitude] : [0, 0],
      zoom: hotels.length > 0 ? 12 : 1,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || hotels.length === 0) return;

    const map = mapRef.current;
    
    // Remove existing markers if any
    const currentMarkers = document.querySelectorAll('.maplibregl-marker');
    currentMarkers.forEach(m => m.remove());

    const bounds = new maplibregl.LngLatBounds();

    hotels.forEach((hotel) => {
      if (hotel.longitude && hotel.latitude) {
        const marker = new maplibregl.Marker({ color: '#1a1a1a' })
          .setLngLat([hotel.longitude, hotel.latitude])
          .setPopup(new maplibregl.Popup().setHTML(`<div style="padding: 10px; font-family: serif;"><strong>${hotel.name}</strong></div>`))
          .addTo(map);
        
        marker.getElement().addEventListener('click', () => {
          onHotelSelect?.(hotel.id);
        });

        bounds.extend([hotel.longitude, hotel.latitude]);
      }
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }
  }, [hotels, onHotelSelect]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-96 rounded-[2rem] shadow-2xl bg-gray-100 overflow-hidden border border-gray-100"
    />
  );
}
