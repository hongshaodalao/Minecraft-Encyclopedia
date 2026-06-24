import { useState } from 'react'
import { PixelBorder } from '../ui/PixelBorder'

interface PixelImageProps {
  imageId: string
  alt: string
  onClick?: () => void
  className?: string
}

export function PixelImage({ imageId, alt, onClick, className = '' }: PixelImageProps) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer ${className}`}
    >
      <PixelBorder>
        <div className="bg-white p-2">
          {!failed ? (
            <img
              src={`/svg/${imageId}.png`}
              alt={alt}
              className="w-full h-full object-contain"
              onError={() => setFailed(true)}
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 min-h-[200px]">
              <span className="text-6xl">?</span>
            </div>
          )}
        </div>
      </PixelBorder>
    </div>
  )
}
