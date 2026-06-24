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
  const [clicking, setClicking] = useState(false)

  const handleClick = () => {
    if (onClick) {
      setClicking(true)
      setTimeout(() => setClicking(false), 200)
      onClick()
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer ${className}`}
    >
      <PixelBorder>
        <div className={`bg-gradient-to-b from-[#E3F2FD] to-[#BBDEFB] p-3 transition-transform duration-200 ${clicking ? 'scale-95' : ''}`}>
          {!failed ? (
            <img
              src={`/svg/${imageId}.png`}
              alt={alt}
              className="w-full h-full object-contain max-h-[300px]"
              onError={() => setFailed(true)}
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 min-h-[200px]">
              <span className="text-6xl">❓</span>
            </div>
          )}
        </div>
      </PixelBorder>
    </div>
  )
}
