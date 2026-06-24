interface PixelBorderProps {
  children: React.ReactNode
  className?: string
}

export function PixelBorder({ children, className = '' }: PixelBorderProps) {
  return (
    <div className={`border-4 border-[#3E2723] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] ${className}`}>
      {children}
    </div>
  )
}
