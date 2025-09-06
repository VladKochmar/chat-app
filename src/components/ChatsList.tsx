import { useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import ChatContact from './ChatContact'
import type { User } from '@/types/User'
import type { UserChats } from '@/types/UserChats'
import { useAuth } from '@/hooks/useAuth'
import { ChatContext } from '@/contexts/ChatContext'

interface ChatsListProps {
  onSelectChat: () => void
}

export default function ChatsList({ onSelectChat }: ChatsListProps) {
  const { user } = useAuth()
  const { dispatch } = useContext(ChatContext)
  const [chats, setChats] = useState<UserChats>({})

  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = onSnapshot(
        doc(db, 'userChats', user.uid),
        (document) => {
          setChats(document.data() as UserChats)
        },
      )

      return () => unsubscribe()
    }
  }, [user?.uid])

  const handleClick = (selectedUser: Omit<User, 'email'>) => {
    dispatch({ type: 'SELECT_USER', payload: selectedUser })
    onSelectChat()
  }

  const resetUser = () => {
    dispatch({ type: 'RESET_USER' })
  }

  if (!user) return null

  return (
    <div className="flex-1 overflow-auto">
      {Object.entries(chats)
        .sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div key={chat[0]} onClick={() => handleClick(chat[1].userInfo)}>
            <ChatContact
              currentUserId={user.uid}
              userInfo={chat[1].userInfo}
              lastMessage={chat[1].lastMessage?.text}
              resetUser={resetUser}
            />
          </div>
        ))}
    </div>
  )
}
