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
        bg-gradient-to-b from-[#FFD700] to-[#FFA000]
        hover:from-[#FFE082] hover:to-[#FFD54F]
        active:from-[#FF8F00] active:to-[#FF6F00]
        transition-all duration-100
        disabled:opacity-50 disabled:cursor-not-allowed
        transform hover:scale-105 active:scale-95
        ${className}
      `}
    >
      <PixelBorder>
        <div className="px-4 py-3 font-['Press_Start_2P'] text-[#3E2723] text-shadow-md">
          {children}
        </div>
      </PixelBorder>
    </button>
  )
}
