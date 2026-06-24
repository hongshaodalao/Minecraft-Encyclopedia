import React from 'react'

interface PixelBorderProps {
  children: React.ReactNode
  className?: string
}

export function PixelBorder({ children, className = '' }: PixelBorderProps) {
  return (
    <div className={`border-4 border-[#3E2723] shadow-[4px_4px_0px_0px_rgba(62,39,35,1)] ${className}`}>
      {children}
    </div>
  )
}
