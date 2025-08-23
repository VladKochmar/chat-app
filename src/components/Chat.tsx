import { useContext } from 'react'
import ChatActions from './ChatActions'
import ChatHeader from './ChatHeader'
import Messages from './Messages'
import { ChatContext } from '@/contexts/ChatContext'

interface ChatProps {
  className?: string
  onBack: () => void
}

export default function Chat({ className, onBack }: ChatProps) {
  const { data } = useContext(ChatContext)

  return (
    <div className={`flex flex-col bg-gray-800 ${className}`}>
      <ChatHeader onBack={onBack} />
      {data.chatId ? (
        <>
          <Messages />
          <ChatActions />
        </>
      ) : (
        <p className="flex h-full flex-row items-center justify-center text-center md:text-xl">
          Select a chat room to start chatting
        </p>
      )}
    </div>
  )
}
