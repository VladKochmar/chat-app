import { useContextMenu } from './ContextMenu'
import type { ReactNode } from 'react'

export default function ContextMenuContent({
  children,
}: {
  children: ReactNode
}) {
  const { isOpen, position, menuRef, close } = useContextMenu()

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      onClick={close}
      style={{ top: position.y, left: position.x }}
      className="fixed z-10 flex w-full max-w-40 flex-col overflow-hidden rounded-sm border border-gray-200 bg-gray-700"
    >
      {children}
    </div>
  )
}
