import { useDropdownMenuContext } from './DropdownMenu'
import type { ReactNode } from 'react'

export default function DropdownMenuTrigger({
  children,
}: {
  children: ReactNode
}) {
  const { open } = useDropdownMenuContext()

  return (
    <button onClick={open} className="cursor-pointer">
      {children}
    </button>
  )
}
