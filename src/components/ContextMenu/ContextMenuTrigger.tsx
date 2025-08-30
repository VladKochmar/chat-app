import { useRef } from 'react'
import { useContextMenu } from './ContextMenu'
import type { MouseEvent, ReactNode, TouchEvent } from 'react'

export default function ContextMenuTrigger({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const { open } = useContextMenu()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    open(e.clientX, e.clientY)
  }

  const handleTouchStart = (e: TouchEvent) => {
    timerRef.current = setTimeout(() => {
      const touch = e.touches[0]
      open(touch.clientX, touch.clientY)
    }, 500)
  }

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
      className={`select-none ${className}`}
    >
      {children}
    </div>
  )
}
