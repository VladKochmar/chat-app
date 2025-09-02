import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../../firebase'

export async function deleteMessagesInChunks(chatId: string, batchSize = 500) {
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages')

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      const snapshot = await getDocs(messagesRef)

      if (snapshot.empty) break

      const batch = writeBatch(db)

      snapshot.docs.slice(0, batchSize).forEach((messageDoc) => {
        batch.delete(messageDoc.ref)
      })

      await batch.commit()
    }
  } catch (error) {
    console.error(error)
  }
}

export async function resetChatInfo(
  senderId: string,
  receiverId: string,
  chatId: string,
) {
  try {
    const senderRef = doc(db, 'userChats', senderId)
    const receiverRef = doc(db, 'userChats', receiverId)

    await updateDoc(senderRef, {
      [chatId + '.lastMessage']: deleteField(),
      [chatId + '.date']: serverTimestamp(),
    })

    await updateDoc(receiverRef, {
      [chatId + '.lastMessage']: deleteField(),
      [chatId + '.date']: serverTimestamp(),
    })
  } catch (error) {
    console.error(error)
  }
}

export async function deleteChat(
  senderId: string,
  receiverId: string,
  chatId: string,
) {
  try {
    const chatRef = doc(db, 'chats', chatId)
    const senderRef = doc(db, 'userChats', senderId)
    const receiverRef = doc(db, 'userChats', receiverId)

    await deleteDoc(chatRef)

    await updateDoc(senderRef, {
      [chatId]: deleteField(),
    })

    await updateDoc(receiverRef, {
      [chatId]: deleteField(),
    })
  } catch (error) {
    console.error(error)
  }
}
