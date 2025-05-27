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
  const primaryStyles = 'bg-blue-500 hover:bg-blue-600 text-white'
  const secondaryStyles = 'border border-gray-500 hover:bg-gray-600 text-white'
  const baseStyles = 'px-4 py-2 rounded'
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
