'use client';

import { useState } from 'react';

interface ShareButtonProps {
  title: string;
  url: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyToClipboard();
        }
      }
    } else {
      handleCopyToClipboard();
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
      title="Share this page"
    >
      {copied ? '✓ Copied!' : '📤 Share'}
    </button>
  );
}
