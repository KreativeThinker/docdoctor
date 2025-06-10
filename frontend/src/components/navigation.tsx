'use client'

import { usePathname } from 'next/navigation'
import { FileText, MessageSquare, Upload, Library } from 'lucide-react'
import NavLink from '@/components/ui/link'

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Library', icon: Library },
    { href: '/upload', label: 'Upload', icon: Upload },
    { href: '/chat', label: 'Chat', icon: MessageSquare },
  ]

  return (
    <nav className="bg-background border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="text-primary h-6 w-6" />
            <span className="text-primary text-xl font-bold">DocDoctor</span>
          </div>
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <NavLink key={item.href} href={item.href} active={isActive}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
