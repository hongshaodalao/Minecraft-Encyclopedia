import React from 'react'
import { PixelBorder } from './PixelBorder'

interface PixelCardProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function PixelCard({ children, onClick, className = '' }: PixelCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer hover:translate-y-[-2px] transition-transform duration-100 ${className}`}
    >
      <PixelBorder>
        <div className="p-4 bg-white">
          {children}
        </div>
      </PixelBorder>
    </div>
  )
}
