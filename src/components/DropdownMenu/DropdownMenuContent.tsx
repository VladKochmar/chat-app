import { useDropdownMenuContext } from './DropdownMenu'
import type { ReactNode } from 'react'

export default function DropdownMenuContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const { isOpen, menuRef, close } = useDropdownMenuContext()

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      onClick={close}
      className={`absolute top-0 right-0 flex translate-y-1/2 flex-col overflow-hidden rounded-sm border border-gray-200 bg-gray-700 ${className}`}
    >
      {children}
    </div>
  )
}
