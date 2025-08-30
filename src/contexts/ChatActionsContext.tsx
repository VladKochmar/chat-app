import { createContext, useContext, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'

interface ChatActionsContextInterface {
  text: string
  setText: (newText: string) => void
  messageId: string
  setMessageId: (id: string) => void
  originalMessage: RefObject<string>
}

export const ChatActionsContext =
  createContext<ChatActionsContextInterface | null>(null)

export const useChatActions = () => {
  const context = useContext(ChatActionsContext)

  if (!context)
    throw new Error(
      'useChatActions must be used inside ChatActionsContext.Provider',
    )

  return context
}

export function ChatActionsProvider({ children }: { children: ReactNode }) {
  const [text, setText] = useState('')
  const [messageId, setMessageId] = useState('')
  const originalMessage = useRef<string>('')

  return (
    <ChatActionsContext.Provider
      value={{ text, setText, messageId, setMessageId, originalMessage }}
    >
      {children}
    </ChatActionsContext.Provider>
  )
}
