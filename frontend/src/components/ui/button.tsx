type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({
  children,
  onClick,
  className,
  disabled,
  variant = 'primary',
}: ButtonProps) {
  const primaryStyles = 'bg-primary text-background'
  const secondaryStyles = 'border border-primary text-primary'
  const baseStyles = 'px-4 py-2 rounded font-bold flex flex-row'
  const variantStyles = variant === 'primary' ? primaryStyles : secondaryStyles

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
