import { createFileRoute, redirect } from '@tanstack/react-router'
import Sidebar from '@/components/Sidebar'
import Chat from '@/components/Chat'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'Chat App',
      },
    ],
  }),
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/signin' })
    }
  },
  component: Home,
})

function Home() {
  return (
    <div className="flex h-[600px] w-full max-w-5xl overflow-hidden rounded-sm border border-gray-600">
      <Sidebar className="flex-1" />
      <Chat className="flex-2" />
    </div>
  )
}
