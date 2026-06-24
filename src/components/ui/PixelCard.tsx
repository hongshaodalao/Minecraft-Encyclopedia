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
      className={`cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${className}`}
    >
      <PixelBorder>
        <div className="p-4 bg-white">
          {children}
        </div>
      </PixelBorder>
    </div>
  )
}
