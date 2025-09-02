import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { MouseEvent, ReactNode, RefObject } from 'react'
import { calcPosition } from '@/utils/calcPosition'

interface ContextMenuContextInterface {
  isOpen: boolean
  position: { x: number; y: number }
  open: (x: number, y: number) => void
  close: (e: MouseEvent) => void
  menuRef: RefObject<HTMLDivElement | null>
}

const ContextMenuContext = createContext<ContextMenuContextInterface | null>(
  null,
)

export const useContextMenu = () => {
  const ctx = useContext(ContextMenuContext)
  if (!ctx) throw new Error('useContextMenu must be used inside <ContextMenu>')
  return ctx
}

export function ContextMenu({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
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

  const open = (x: number, y: number) => {
    const { posX, posY } = calcPosition(x, y)
    setPosition({ x: posX, y: posY })
    setIsOpen(true)
  }

  const close = (e: MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
  }

  return (
    <ContextMenuContext.Provider
      value={{ isOpen, position, open, close, menuRef }}
    >
      {children}
    </ContextMenuContext.Provider>
  )
}
