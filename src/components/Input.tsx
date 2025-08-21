import type { HTMLInputTypeAttribute } from 'react'

interface InputProps {
  label: string
  name?: string
  type?: HTMLInputTypeAttribute
  error?: string
}

export default function Input({ label, type, name, error }: InputProps) {
  return (
    <label className="flex flex-col gap-y-1">
      {label}
      <input
        name={name}
        type={type ? type : 'text'}
        className={`rounded-sm border border-gray-400 p-2 ${error && 'border-red-500'}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </label>
  )
}
