import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { MouseEvent, ReactNode, RefObject } from 'react'

interface DropdownMenuContextInterface {
  isOpen: boolean
  open: () => void
  close: (e: MouseEvent) => void
  menuRef: RefObject<HTMLDivElement | null>
}

const DropdownMenuContext = createContext<DropdownMenuContextInterface | null>(
  null,
)

export const useDropdownMenuContext = () => {
  const ctx = useContext(DropdownMenuContext)
  if (!ctx)
    throw new Error('useDropdownMenuContext must be used inside <DropdownMenu>')
  return ctx
}

export function DropdownMenu({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const open = () => {
    setIsOpen(true)
  }

  const close = (e: MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <DropdownMenuContext.Provider value={{ isOpen, open, close, menuRef }}>
        {children}
      </DropdownMenuContext.Provider>
    </div>
  )
}
