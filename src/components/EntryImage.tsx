import { useState } from 'react';

interface EntryImageProps {
  imageId: string;
  alt: string;
  onClick?: () => void;
  className?: string;
}

export function EntryImage({ imageId, alt, onClick, className = '' }: EntryImageProps) {
  const [failed, setFailed] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleClick = () => {
    if (onClick) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      onClick();
    }
  };

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center cursor-pointer ${shaking ? 'animate-shake' : ''} ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={alt}
    >
      {!failed ? (
        <img
          src={`/svg/${imageId}.png`}
          alt={alt}
          className="w-full h-full object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-2xl">
          <span className="text-6xl">❓</span>
        </div>
      )}
    </div>
  );
}
