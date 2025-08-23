import { useState } from 'react'
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
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)

  const handleClick = (newValue: boolean) => {
    if (window.innerWidth <= 768) {
      setIsSidebarVisible(newValue)
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        onSelectChat={() => handleClick(false)}
        className={`fixed top-0 left-0 h-full w-full transition-transform duration-300 md:relative md:min-w-80 md:flex-1 ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      />
      <Chat onBack={() => handleClick(true)} className="flex-1 md:flex-3" />
    </div>
  )
}
