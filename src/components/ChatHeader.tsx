import { EllipsisVertical, Search } from 'lucide-react'
import { useContext } from 'react'
import { ChatContext } from '@/contexts/ChatContext'

export default function ChatHeader() {
  const { data } = useContext(ChatContext)

  return (
    <header className="flex items-center justify-between bg-gray-700 px-3 py-4">
      <span className="text-xl font-medium">{data.user?.displayName}</span>
      <div className="inline-flex items-center gap-x-4">
        <button className="cursor-pointer">
          <Search size={20} />
        </button>
        <button className="cursor-pointer">
          <EllipsisVertical size={20} />
        </button>
      </div>
    </header>
  )
}
