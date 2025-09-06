import { useContext, useEffect, useRef, useState } from 'react'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import Message from './Message'
import ScrollButton from './ScrollButton'
import type { MessageType } from '@/types/MessageType'
import { ChatContext } from '@/contexts/ChatContext'

export default function Messages() {
  const { data } = useContext(ChatContext)
  const boxRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Array<MessageType>>([])

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
    <div className="relative flex flex-1 flex-col overflow-y-hidden">
      <div ref={boxRef} className="flex-1 overflow-y-auto p-4">
        {!messages.length && (
          <p className="flex h-full flex-row items-center justify-center text-center text-xl">
            Write your first message to {data.user?.displayName}!
          </p>
        )}
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <ScrollButton boxRef={boxRef} />
    </div>
  )
}
