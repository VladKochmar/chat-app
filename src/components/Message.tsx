import { useContext, useEffect, useRef } from 'react'
import type { MessageType } from '@/types/MessageType'
import { ChatContext } from '@/contexts/ChatContext'
import { useAuth } from '@/hooks/useAuth'

export default function Message({ message }: { message: MessageType }) {
  const { user } = useAuth()
  const { data } = useContext(ChatContext)
  const messageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message])

  const isUserSender = message.sender === user?.uid

  const senderName = isUserSender ? user.displayName : data.user?.displayName

  const date = new Date(message.date.toDate())
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return (
    <div
      ref={messageRef}
      className={`flex not-last:mb-4 ${isUserSender ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-3/4 rounded-sm bg-gray-700 px-2 py-1 ${isUserSender ? 'rounded-br-none bg-indigo-600/30' : 'rounded-bl-none'}`}
      >
        <span className="text-sm text-emerald-500">{senderName}</span>
        <p className="py-1">{message.text}</p>
        <span className="flex justify-end text-sm text-gray-400">
          {hours}:{minutes}
        </span>
      </div>
    </div>
  )
}
