import React from 'react'
import { PixelBorder } from './PixelBorder'

interface PixelButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function PixelButton({ children, onClick, className = '', disabled = false }: PixelButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        min-w-[80px] min-h-[80px]
        bg-[#FFD700] hover:bg-yellow-400 active:bg-yellow-600
        transition-colors duration-100
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <PixelBorder>
        <div className="px-4 py-3 font-[\'Press_Start_2P\'] text-[#3E2723]">
          {children}
        </div>
      </PixelBorder>
    </button>
  )
}
