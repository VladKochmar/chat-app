import { flushSync } from 'react-dom'
import { createContext, useCallback, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase'

import type { ReactNode } from 'react'
import type { AuthProvider, User } from 'firebase/auth'

export interface AuthContextInterface {
  user: User | null
  isAuthenticated: boolean
  isInitialLoading: boolean
  signout: () => Promise<void>
  signin: (provider: AuthProvider) => Promise<void>
  signinWithEmail: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>
}

export const AuthContext = createContext<AuthContextInterface | null>(null)

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser)
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true)
  const isAuthenticated = !!currentUser

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('user', user)
      flushSync(() => {
        setCurrentUser(user)
        setIsInitialLoading(false)
      })
    })

    return () => unsubscribe()
  }, [])

  const signout = useCallback(async () => {
    await signOut(auth)
  }, [])

  const signin = useCallback(async (provider: AuthProvider) => {
    const result = await signInWithPopup(auth, provider)

    const userResponse = await getDoc(doc(db, 'users', result.user.uid))

    if (!userResponse.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      })

      await setDoc(doc(db, 'userChats', result.user.uid), {})
    }

    flushSync(() => {
      setCurrentUser(result.user)
      setIsInitialLoading(false)
    })
  }, [])

  const signinWithEmail = useCallback(
    async (email: string, password: string) => {
      const result = await signInWithEmailAndPassword(auth, email, password)

      flushSync(() => {
        setCurrentUser(result.user)
        setIsInitialLoading(false)
      })
    },
    [],
  )

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      const result = await createUserWithEmailAndPassword(auth, email, password)

      await updateProfile(result.user, { displayName })

      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email,
        displayName,
        photoURL: null,
      })

      await setDoc(doc(db, 'userChats', result.user.uid), {})

      flushSync(() => {
        setCurrentUser(result.user)
        setIsInitialLoading(false)
      })
    },
    [],
  )

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isInitialLoading,
        isAuthenticated,
        register,
        signin,
        signout,
        signinWithEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
