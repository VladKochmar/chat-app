import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { GoogleAuthProvider } from 'firebase/auth'

import { useState } from 'react'
import type { SyntheticEvent } from 'react'

import Input from '@/components/Input'
import Button from '@/components/Button'
import AuthCard from '@/components/AuthCard'
import { useAuth } from '@/hooks/useAuth'

const googleAuthProvider = new GoogleAuthProvider()

interface ErrorsState {
  email?: string
  password?: string
  server?: string
}

export const Route = createFileRoute('/signin')({
  head: () => ({
    meta: [
      {
        title: 'Sign In',
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { signin, signinWithEmail } = useAuth()
  const navigate = useNavigate({ from: '/signin' })
  const [errors, setErrors] = useState<ErrorsState>({})

  const validate = (email: string, password: string) => {
    const newErrors: ErrorsState = {}
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email'
    if (password.length < 8)
      newErrors.password = 'Password too short (min 8 symbols)'
    return newErrors
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      email: { value: string }
      password: { value: string }
    }

    const email = target.email.value
    const password = target.password.value

    const validationErrors = validate(email, password)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      await signinWithEmail(email, password)
      navigate({ to: '/' })
    } catch (error) {
      console.error(error)
      setErrors({ server: 'Some server error' })
    }
  }

  const signInWithGoogle = async () => {
    try {
      await signin(googleAuthProvider)
      navigate({ to: '/' })
    } catch (error) {
      console.error(error)
      setErrors({ server: 'Some server error' })
    }
  }

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        <Input label="Email" type="email" name="email" error={errors.email} />
        <Input
          label="Password"
          type="password"
          name="password"
          error={errors.password}
        />
        <Button>Sign In</Button>
      </form>
      <div className="flex items-center gap-x-3 py-4 before:h-[1px] before:w-full before:bg-gray-400 after:h-[1px] after:w-full after:bg-gray-400">
        or
      </div>
      <button
        onClick={signInWithGoogle}
        className="w-full cursor-pointer rounded-sm bg-gray-400/30 p-2"
      >
        Sign In With Google
      </button>
      {errors.server && <p className="text-sm text-red-500">{errors.server}</p>}
    </AuthCard>
  )
}
