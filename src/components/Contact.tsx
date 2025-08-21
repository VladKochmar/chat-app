import Avatar from './Avatar'
import { truncate } from '@/utils/truncate'

interface ContactProps {
  name: string
  photoURL: string | null
  message?: string
  className?: string
}

export default function Contact({
  name,
  photoURL,
  message,
  className,
}: ContactProps) {
  return (
    <>
      <div
        className={`flex cursor-pointer items-center gap-x-4 p-2 transition-colors duration-300 hover:bg-gray-700 ${className}`}
      >
        <div className="basis-10 self-start">
          <Avatar photoURL={photoURL} name={name} />
        </div>
        <div>
          <span>{name}</span>
          {message && (
            <p className="pt-0.5 text-sm text-gray-400">
              {truncate(message, 32)}
            </p>
          )}
        </div>
      </div>
    </>
  )
}
