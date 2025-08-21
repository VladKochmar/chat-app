import type { User } from './User'

export interface UserChats {
  [id: string]: {
    date: number
    userInfo: Omit<User, 'email'>
    lastMessage: { text: string } | undefined
  }
}
