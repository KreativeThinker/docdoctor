import Link from 'next/link'

type LinkProps = {
  children: React.ReactNode
  href: string
  className?: string
  target?: '_blank' | '_self'
  active?: boolean
}

export default function NavLink({
  children,
  href,
  className,
  target = '_self',
  active = false,
}: LinkProps) {
  const activeStyle = 'bg-primary text-background'
  const inactiveStyle = 'border border-primary text-primary'
  const baseStyles = 'px-4 py-2 rounded font-bold flex flex-row items-center gap-2'
  const style = active ? activeStyle : inactiveStyle
  return (
    <Link href={href} className={`${baseStyles} ${style} ${className}`} target={target}>
      {children}
    </Link>
  )
}
