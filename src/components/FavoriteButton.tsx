'use client';

import { useState } from 'react';

interface FavoriteButtonProps {
  hotelId: string;
  hotelName: string;
  onToggle?: (isFavorite: boolean) => void;
}

export function FavoriteButton({ hotelId, hotelName, onToggle }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggle = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    onToggle?.(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
}
