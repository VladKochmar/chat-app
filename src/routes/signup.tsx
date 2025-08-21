import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useState } from 'react'
import type { SyntheticEvent } from 'react'

import Input from '@/components/Input'
import Button from '@/components/Button'
import AuthCard from '@/components/AuthCard'
import { useAuth } from '@/hooks/useAuth'

interface ErrorsState {
  email?: string
  password?: string
  displayName?: string
  server?: string
}

export const Route = createFileRoute('/signup')({
  head: () => ({
    meta: [
      {
        title: 'Sign Up',
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { register } = useAuth()
  const navigate = useNavigate({ from: '/signup' })
  const [errors, setErrors] = useState<ErrorsState>({})

  const validate = (email: string, password: string, displayName: string) => {
    const newErrors: ErrorsState = {}
    if (!displayName) newErrors.displayName = 'Name is required'
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
      displayName: { value: string }
    }

    const email = target.email.value
    const password = target.password.value
    const displayName = target.displayName.value

    const validationErrors = validate(email, password, displayName)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      await register(email, password, displayName)
      navigate({ to: '/' })
    } catch (error) {
      console.error(error)
      setErrors({ server: 'Some server error' })
    }
  }

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        <Input label="Name" name="displayName" error={errors.displayName} />
        <Input label="Email" type="email" name="email" error={errors.email} />
        <Input
          label="Password"
          type="password"
          name="password"
          error={errors.password}
        />
        <Button>Sign In</Button>
        {errors.server && (
          <p className="text-sm text-red-500">{errors.server}</p>
        )}
      </form>
    </AuthCard>
  )
}
