import { Pencil, SendHorizontal, X } from 'lucide-react'
import { useContext } from 'react'
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../firebase'
import FancyTextarea from './FancyTextarea'
import type { KeyboardEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ChatContext } from '@/contexts/ChatContext'
import { useChatActions } from '@/contexts/ChatActionsContext'
import { truncate } from '@/utils/truncate'

export default function ChatActions() {
  const { user } = useAuth()
  const { data } = useContext(ChatContext)
  const { text, setText, messageId, setMessageId, originalMessage } =
    useChatActions()

  const isDisabled = !text
  const isEdit = !!messageId

  const handleEdit = async () => {
    if (data.chatId && text && isEdit) {
      const chatRef = doc(db, 'chats', data.chatId)
      const messageRef = doc(chatRef, 'messages', messageId)

      await updateDoc(messageRef, {
        text,
      })

      setMessageId('')
      setText('')
      originalMessage.current = ''
    }
  }

  const handleSend = async () => {
    if (data.chatId && data.user && user && text) {
      const chatRef = doc(db, 'chats', data.chatId)
      const messagesRef = collection(chatRef, 'messages')

      await addDoc(messagesRef, {
        text,
        sender: user.uid,
        date: Timestamp.now(),
      })

      await updateDoc(doc(db, 'userChats', user.uid), {
        [data.chatId + '.lastMessage']: { text },
        [data.chatId + '.date']: serverTimestamp(),
      })

      await updateDoc(doc(db, 'userChats', data.user.uid), {
        [data.chatId + '.lastMessage']: { text },
        [data.chatId + '.date']: serverTimestamp(),
      })

      setText('')
    }
  }

  const handleEnter = async (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      if (e.shiftKey) return

      e.preventDefault()
      isEdit ? await handleEdit() : await handleSend()
    }
  }

  const handleClear = () => {
    originalMessage.current = ''
    setMessageId('')
    setText('')
  }

  return (
    <div className="bg-gray-700 px-3 py-4">
      {isEdit && (
        <div className="flex items-center justify-between gap-x-4 border-b border-b-gray-600 not-last:pb-2">
          <div className="flex gap-x-2">
            <span className="text-emerald-500">Editing:</span>
            <p>{truncate(originalMessage.current, 60)}</p>
          </div>
          <button
            onClick={handleClear}
            className="inline-flex size-8 min-w-8 cursor-pointer items-center justify-center rounded-sm bg-emerald-500/30 transition-colors duration-300 hover:bg-emerald-600/70"
          >
            <X size={20} />
          </button>
        </div>
      )}
      <div className="flex gap-x-4 not-first:pt-2">
        <FancyTextarea
          value={text}
          onKeyDown={handleEnter}
          onChange={(e) => setText(e.target.value)}
        />
        {isEdit ? (
          <button
            disabled={isDisabled}
            onClick={handleEdit}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-sm bg-indigo-600 transition-colors duration-300 hover:bg-indigo-700 disabled:bg-indigo-600/30"
          >
            <Pencil size={20} />
          </button>
        ) : (
          <button
            disabled={isDisabled}
            onClick={handleSend}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-sm bg-indigo-600 transition-colors duration-300 hover:bg-indigo-700 disabled:bg-indigo-600/30"
          >
            <SendHorizontal size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
