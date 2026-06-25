import { useState } from 'react'
import { imagePath } from '../../utils/assetPath'

interface PixelImageProps {
  imageId: string
  category: string
  alt: string
  onClick?: () => void
  className?: string
}

export function PixelImage({ imageId, category, alt, onClick, className = '' }: PixelImageProps) {
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
      <div className={`transition-transform duration-200 ${clicking ? 'scale-95' : ''}`}>
        {!failed ? (
          <img
            src={imagePath(category, imageId)}
            alt={alt}
            className="w-full h-full object-contain max-h-[280px] rounded-xl"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#EFEBE9] rounded-xl min-h-[200px]">
            <span className="text-5xl">❓</span>
          </div>
        )}
      </div>
    </div>
  )
}
