import React from 'react'

interface PixelTextProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-xl',
}

export function PixelText({ children, size = 'md', className = '' }: PixelTextProps) {
  return (
    <p className={`font-[\'Press_Start_2P\'] ${sizeClasses[size]} ${className}`}>
      {children}
    </p>
  )
}
