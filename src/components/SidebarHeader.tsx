import { LogOut } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'

import { useContext } from 'react'
import Avatar from './Avatar'
import { useAuth } from '@/hooks/useAuth'
import { ChatContext } from '@/contexts/ChatContext'

export default function SidebarHeader() {
  const router = useRouter()
  const { user, signout } = useAuth()
  const { dispatch } = useContext(ChatContext)

  const username = user?.displayName || 'user'

  const handleSignout = async () => {
    await signout()
    dispatch({ type: 'RESET_USER' })
    await router.invalidate()
  }

  return (
    <div className="flex items-center gap-x-4 px-3 pt-4 pb-2">
      <Avatar photoURL={user?.photoURL} name={username} />
      <h2 className="flex-1 text-xl font-medium">{username}</h2>
      <button className="cursor-pointer" onClick={handleSignout}>
        <LogOut size={20} />
      </button>
    </div>
  )
}
