import type { ReactNode } from 'react'

export default function Button({ children }: { children: ReactNode }) {
  return (
    <button className="cursor-pointer rounded-sm bg-green-400 py-2 text-white transition-colors duration-300 hover:bg-green-500">
      {children}
    </button>
  )
}
