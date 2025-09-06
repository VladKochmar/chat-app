import type { Timestamp } from 'firebase/firestore'

interface TimeIndicatorProps {
  time: Timestamp
  className?: string
}

export default function TimeIndicator({ time, className }: TimeIndicatorProps) {
  const date = time.toDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return (
    <time
      dateTime={date.toString()}
      className={`flex justify-end ${className}`}
    >
      {hours}:{minutes}
    </time>
  )
}
