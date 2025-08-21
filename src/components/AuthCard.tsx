import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-96 rounded-sm border border-gray-600 bg-gray-800 px-4 py-5">
      <div className="flex justify-center gap-x-4 not-last:mb-4">
        <Link
          to="/signup"
          activeProps={{ className: 'text-green-400' }}
          className="cursor-pointer text-xl font-medium transition-colors duration-300 hover:text-green-500"
        >
          Sign Up
        </Link>
        <Link
          to="/signin"
          activeProps={{ className: 'text-green-400' }}
          className="cursor-pointer text-xl font-medium transition-colors duration-300 hover:text-green-500"
        >
          Sign In
        </Link>
      </div>
      {children}
    </div>
  )
}
