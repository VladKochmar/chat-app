import type { Timestamp } from 'firebase/firestore'
import type { User } from './User'

export interface UserChats {
  [id: string]: {
    date: Timestamp
    userInfo: Omit<User, 'email'>
    lastMessage: { text: string } | undefined
  }
}
