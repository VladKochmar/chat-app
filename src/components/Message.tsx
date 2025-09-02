import { Pencil, Trash2 } from 'lucide-react'
import { useContext, useEffect, useRef } from 'react'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase'
import { ContextMenu } from './ContextMenu/ContextMenu'
import ContextMenuTrigger from './ContextMenu/ContextMenuTrigger'
import ContextMenuContent from './ContextMenu/ContextMenuContent'
import type { MessageType } from '@/types/MessageType'
import { ChatContext } from '@/contexts/ChatContext'
import { useAuth } from '@/hooks/useAuth'
import { useChatActions } from '@/contexts/ChatActionsContext'
import { resetChatInfo } from '@/utils/chatActions'

interface MessageProps {
  message: MessageType
}

export default function Message({ message }: MessageProps) {
  const { user } = useAuth()
  const { setText, setMessageId, originalMessage } = useChatActions()
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

  const handleEdit = (msg: MessageType) => {
    setText(msg.text)
    setMessageId(msg.id)
    originalMessage.current = msg.text
  }

  const handleDeleteMessage = async () => {
    if (data.chatId) {
      try {
        await deleteDoc(doc(db, 'chats', data.chatId, 'messages', message.id))
        if (user && data.user)
          await resetChatInfo(user.uid, data.user.uid, data.chatId)
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div
      ref={messageRef}
      className={`flex not-last:mb-4 ${isUserSender ? 'justify-end' : 'justify-start'}`}
    >
      <ContextMenu>
        <ContextMenuTrigger
          className={`max-w-3/4 rounded-sm bg-gray-700 px-2 py-1 ${isUserSender ? 'rounded-br-none bg-indigo-600/30' : 'rounded-bl-none'}`}
        >
          <span className="text-sm text-emerald-500">{senderName}</span>
          <p className="py-1">{message.text}</p>
          <span className="flex justify-end text-sm text-gray-400">
            {hours}:{minutes}
          </span>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {user?.uid === message.sender && (
            <button
              onClick={() => handleEdit(message)}
              className="flex cursor-pointer items-center justify-between px-2 py-1 transition-colors duration-300 not-last:border-b not-last:border-b-gray-200 hover:bg-gray-800"
            >
              Edit
              <Pencil size={20} />
            </button>
          )}
          <button
            onClick={handleDeleteMessage}
            className="flex cursor-pointer items-center justify-between px-2 py-1 text-red-500 transition-colors duration-300 not-last:border-b not-last:border-b-gray-200 hover:bg-gray-800"
          >
            Delete
            <Trash2 size={20} />
          </button>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
