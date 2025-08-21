import type { Timestamp } from 'firebase/firestore'

export interface MessageType {
  id: string
  sender: string
  text: string
  date: Timestamp
}
