import {
  BrushCleaning,
  ChevronLeft,
  EllipsisVertical,
  Search,
  Trash2,
} from 'lucide-react'
import { useContext } from 'react'
import { DropdownMenu } from './DropdownMenu/DropdownMenu'
import DropdownMenuTrigger from './DropdownMenu/DropdownMenuTrigger'
import DropdownMenuContent from './DropdownMenu/DropdownMenuContent'
import { ChatContext } from '@/contexts/ChatContext'
import {
  deleteChat,
  deleteMessagesInChunks,
  resetChatInfo,
} from '@/utils/chatActions'
import { useAuth } from '@/hooks/useAuth'

interface ChatHeader {
  onBack: () => void
}

export default function ChatHeader({ onBack }: ChatHeader) {
  const { user } = useAuth()
  const { data, dispatch } = useContext(ChatContext)

  if (!user || !data.user) return null

  const chatId =
    user.uid > data.user.uid
      ? user.uid + data.user.uid
      : data.user.uid + user.uid

  const handleBack = () => {
    dispatch({ type: 'RESET_USER' })
    onBack()
  }

  const handleResetChat = async () => {
    if (data.user) {
      await deleteMessagesInChunks(chatId)
      await resetChatInfo(user.uid, data.user.uid, chatId)
    }
  }

  const handleDeleteChat = async () => {
    if (data.user) {
      await deleteMessagesInChunks(chatId)
      await deleteChat(user.uid, data.user.uid, chatId)
      handleBack()
    }
  }

  return (
    <header className="flex items-center justify-between bg-gray-700 px-3 py-4">
      <button
        onClick={handleBack}
        className="inline-flex items-center md:hidden"
      >
        <ChevronLeft /> Back
      </button>
      <span className="text-xl font-medium">{data.user.displayName}</span>
      <div className="inline-flex items-center gap-x-4">
        <button className="cursor-pointer">
          <Search size={20} />
        </button>
        <DropdownMenu className="h-5">
          <DropdownMenuTrigger>
            <EllipsisVertical size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-36">
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
