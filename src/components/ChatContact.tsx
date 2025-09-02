import { BrushCleaning, Trash2 } from 'lucide-react'
import Contact from './Contact'
import { ContextMenu } from './ContextMenu/ContextMenu'
import ContextMenuTrigger from './ContextMenu/ContextMenuTrigger'
import ContextMenuContent from './ContextMenu/ContextMenuContent'
import type { User } from '@/types/User'
import {
  deleteChat,
  deleteMessagesInChunks,
  resetChatInfo,
} from '@/utils/chatActions'

interface ChatContactProps {
  currentUserId: string
  userInfo: Omit<User, 'email'>
  lastMessage?: string
}

export default function ChatContact({
  currentUserId,
  userInfo,
  lastMessage,
}: ChatContactProps) {
  const chatId =
    currentUserId > userInfo.uid
      ? currentUserId + userInfo.uid
      : userInfo.uid + currentUserId

  const handleResetChat = async () => {
    await deleteMessagesInChunks(chatId)
    await resetChatInfo(currentUserId, userInfo.uid, chatId)
  }

  const handleDeleteChat = async () => {
    await deleteMessagesInChunks(chatId)
    await deleteChat(currentUserId, userInfo.uid, chatId)
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Contact
          name={userInfo.displayName}
          photoURL={userInfo.photoURL}
          message={lastMessage}
          className="hover:bg-gray-800"
        />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <button
          onClick={handleResetChat}
          className="flex cursor-pointer items-center justify-between px-2 py-1 transition-colors duration-300 not-last:border-b not-last:border-b-gray-200 hover:bg-gray-800"
        >
          Reset chat <BrushCleaning size={20} />
        </button>
        <button
          onClick={handleDeleteChat}
          className="flex cursor-pointer items-center justify-between px-2 py-1 text-red-500 transition-colors duration-300 not-last:border-b not-last:border-b-gray-200 hover:bg-gray-800"
        >
          Delete chat <Trash2 size={20} />
        </button>
      </ContextMenuContent>
    </ContextMenu>
  )
}
