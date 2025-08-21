import { useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import Message from './Message'
import type { MessageType } from '@/types/MessageType'
import { ChatContext } from '@/contexts/ChatContext'

export default function Messages() {
  const [messages, setMessages] = useState<Array<MessageType>>([])
  const { data } = useContext(ChatContext)

  useEffect(() => {
    if (data.chatId) {
      const unsubscribe = onSnapshot(
        doc(db, 'chats', data.chatId),
        (document) => {
          document.exists() &&
            setMessages(document.data().messages as Array<MessageType>)
        },
      )

      return () => unsubscribe()
    }
  }, [data.chatId])

  return (
    <div className="flex-1 overflow-auto p-4">
      {!messages.length && (
        <p className="flex h-full flex-row items-center justify-center text-center text-xl">
          Write your first message to {data.user?.displayName}!
        </p>
      )}
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  )
}
