interface VibeTagProps {
  label: string;
  onSelect?: (vibe: string) => void;
  isActive?: boolean;
}

export function VibeTag({ label, onSelect, isActive = false }: VibeTagProps) {
  const colors = {
    luxury: 'bg-accent text-luxury',
    boutique: 'bg-blue-100 text-blue-800',
    modern: 'bg-purple-100 text-purple-800',
    romantic: 'bg-pink-100 text-pink-800',
    adventure: 'bg-green-100 text-green-800',
    beach: 'bg-cyan-100 text-cyan-800',
    urban: 'bg-gray-100 text-gray-800',
  };

  const colorKey = Object.keys(colors).find((k) => label.toLowerCase().includes(k)) || 'urban';
  const bgColor = isActive ? 'ring-2 ring-offset-2 ring-accent' : '';

  return (
    <button
      onClick={() => onSelect?.(label)}
      className={`px-4 py-2 rounded-full font-medium transition-all ${colors[colorKey as keyof typeof colors]} ${bgColor}`}
    >
      {label}
    </button>
  );
}
