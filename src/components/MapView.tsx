'use client';

import { useEffect, useRef } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || hotels.length === 0) return;

    // Placeholder for maplibre-gl integration
    const bounds = hotels.reduce(
      (acc, hotel) => ({
        north: Math.max(acc.north, hotel.latitude),
        south: Math.min(acc.south, hotel.latitude),
        east: Math.max(acc.east, hotel.longitude),
        west: Math.min(acc.west, hotel.longitude),
      }),
      {
        north: hotels[0].latitude,
        south: hotels[0].latitude,
        east: hotels[0].longitude,
        west: hotels[0].longitude,
      }
    );

    containerRef.current.innerHTML = `
      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600">
        <div>
          <p className="text-lg font-semibold mb-2">Map View</p>
          <p className="text-sm">${hotels.length} hotels found</p>
        </div>
      </div>
    `;
  }, [hotels]);

  return (
    <div
      ref={containerRef}
      className="w-full h-96 rounded-lg shadow-md bg-gray-100"
    />
  );
}
