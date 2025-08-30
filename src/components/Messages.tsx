import { useContext, useEffect, useState } from 'react'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import Message from './Message'
import type { MessageType } from '@/types/MessageType'
import { ChatContext } from '@/contexts/ChatContext'

export default function Messages() {
  const [messages, setMessages] = useState<Array<MessageType>>([])
  const { data } = useContext(ChatContext)

  useEffect(() => {
    if (data.chatId) {
      const messagesRef = collection(doc(db, 'chats', data.chatId), 'messages')
      const q = query(messagesRef, orderBy('date', 'asc'))

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newMessages: Array<MessageType> = []
        querySnapshot.forEach((document) => {
          newMessages.push({
            id: document.id,
            ...document.data(),
          } as MessageType)
        })

        setMessages(newMessages)
      })

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
