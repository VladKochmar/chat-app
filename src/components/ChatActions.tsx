import { SendHorizontal } from 'lucide-react'
import { useContext, useState } from 'react'
import { v4 as uuid } from 'uuid'
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '@/hooks/useAuth'
import { ChatContext } from '@/contexts/ChatContext'

export default function ChatActions() {
  const [text, setText] = useState('')

  const { user } = useAuth()
  const { data } = useContext(ChatContext)

  const isDisabled = !text

  const handleSend = async () => {
    if (data.chatId && data.user && user && text) {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          sender: user.uid,
          date: Timestamp.now(),
        }),
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

  return (
    <div className="flex gap-x-4 bg-gray-700 px-3 py-4">
      <input
        type="text"
        placeholder="Message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.code === 'Enter' && handleSend()}
        className="flex-1 outline-none placeholder:text-gray-400"
      />
      {/* <input
        type="file"
        id="file-input"
        onChange={(e) =>
          e.target.files ? setImage(e.target.files[0]) : setImage(null)
        }
        className="hidden"
      />
      <label
        htmlFor="file-input"
        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-sm bg-indigo-600 transition-colors duration-300 hover:bg-indigo-700"
      >
        <Paperclip size={20} />
      </label> */}
      <button
        disabled={isDisabled}
        onClick={handleSend}
        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-sm bg-indigo-600 transition-colors duration-300 hover:bg-indigo-700 disabled:bg-indigo-600/30"
      >
        <SendHorizontal size={20} />
      </button>
    </div>
  )
}
