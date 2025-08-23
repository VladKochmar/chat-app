import { useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import Contact from './Contact'
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
          console.log('hi')
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

  return (
    <div className="flex-1 overflow-auto">
      {Object.entries(chats)
        .sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div key={chat[0]} onClick={() => handleClick(chat[1].userInfo)}>
            <Contact
              name={chat[1].userInfo.displayName}
              photoURL={chat[1].userInfo.photoURL}
              message={chat[1].lastMessage?.text}
              className="hover:bg-gray-800"
            />
          </div>
        ))}
    </div>
  )
}
