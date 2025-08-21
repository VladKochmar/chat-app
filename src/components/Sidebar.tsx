import ChatsList from './ChatsList'
import SearchBar from './SearchBar'
import SidebarHeader from './SidebarHeader'

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={`flex flex-col border-r border-gray-600 bg-gray-700 ${className}`}
    >
      <SidebarHeader />
      <SearchBar />
      <ChatsList />
    </aside>
  )
}
