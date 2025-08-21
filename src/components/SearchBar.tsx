import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../../firebase'

import Contact from './Contact'

import type { User } from '@/types/User'
import { useAuth } from '@/hooks/useAuth'

export default function SearchBar() {
  const { user } = useAuth()
  const [username, setUsername] = useState('')
  const [users, setUsers] = useState<Array<User>>([])

  const isDisabled = !username || users.length <= 0

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (username) {
        const q = query(
          collection(db, 'users'),
          where('displayName', '>=', username),
          where('displayName', '<=', username + '\uf8ff'),
          limit(10),
        )

        const result: Array<User> = []
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          result.push(doc.data() as User)
        })

        setUsers(result)
      } else {
        setUsers([])
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [username])

  const handleClick = async (selectedUser: User) => {
    if (!user) return

    const chatId =
      user.uid > selectedUser.uid
        ? user.uid + selectedUser.uid
        : selectedUser.uid + user.uid

    try {
      const result = await getDoc(doc(db, 'chats', chatId))

      if (!result.exists()) {
        await setDoc(doc(db, 'chats', chatId), { messages: [] })

        await updateDoc(doc(db, 'userChats', user.uid), {
          [chatId + '.userInfo']: {
            uid: selectedUser.uid,
            displayName: selectedUser.displayName,
            photoURL: selectedUser.photoURL,
          },
          [chatId + '.date']: serverTimestamp(),
        })

        await updateDoc(doc(db, 'userChats', selectedUser.uid), {
          [chatId + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [chatId + '.date']: serverTimestamp(),
        })

        setUsername('')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="px-3 py-2">
      <div className="relative flex">
        <input
          type="text"
          placeholder="Find your friend"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="flex-1 rounded-l-sm bg-gray-800 p-2 outline-none placeholder:text-gray-400"
        />
        <button
          disabled={isDisabled}
          onClick={() => handleClick(users[0])}
          className="cursor-pointer rounded-r-sm bg-indigo-600 px-3 py-2 transition-colors duration-300 hover:bg-indigo-700 disabled:bg-indigo-400/70"
        >
          <Search size={20} />
        </button>
        {!!username.length && (
          <div className="absolute top-full left-0 w-full rounded-b-sm border border-gray-600 bg-gray-800">
            {users.length === 0 && (
              <p className="p-2">No users found for the query "{username}"</p>
            )}
            {users.map((searchedUser) => (
              <div
                key={searchedUser.uid}
                onClick={() => handleClick(searchedUser)}
              >
                <Contact
                  name={searchedUser.displayName}
                  photoURL={searchedUser.photoURL}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
