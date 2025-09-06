import { createContext, useReducer } from 'react'
import type { ActionDispatch, ReactNode } from 'react'
import type { User } from '@/types/User'
import { useAuth } from '@/hooks/useAuth'

interface ChatState {
  user: Omit<User, 'email'> | null
  chatId: string | null
}

type ChatAction =
  | { type: 'SELECT_USER'; payload: Omit<User, 'email'> }
  | { type: 'RESET_USER' }

interface ChatContextInterface {
  data: ChatState
  dispatch: ActionDispatch<[action: ChatAction]>
}

const INIT_STATE: ChatState = { user: null, chatId: null }

export const ChatContext = createContext<ChatContextInterface>({
  data: INIT_STATE,
  dispatch: () => {
    throw new Error('dispatch called outside of ChatContextProvider')
  },
})

export function ChatContextProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const chatReducer = (state: ChatState, action: ChatAction) => {
    switch (action.type) {
      case 'SELECT_USER': {
        if (user) {
          return {
            user: action.payload,
            chatId:
              user.uid > action.payload.uid
                ? user.uid + action.payload.uid
                : action.payload.uid + user.uid,
          }
        }
        return state
      }
      case 'RESET_USER': {
        return {
          user: null,
          chatId: null,
        }
      }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(chatReducer, INIT_STATE)

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  )
}
