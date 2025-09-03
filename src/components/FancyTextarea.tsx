import { useEffect, useRef } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'

interface FancyTextareaProps {
  value: string
  onKeyDown: (e: KeyboardEvent) => void
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

export default function FancyTextarea({
  value,
  onChange,
  onKeyDown,
}: FancyTextareaProps) {
  const mirrorRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (mirrorRef.current && textareaRef.current) {
      textareaRef.current.style.height = mirrorRef.current.offsetHeight + 'px'
    }
  }, [value])

  return (
    <div className="relative max-h-40 w-full overflow-y-auto">
      <div
        ref={mirrorRef}
        className="min-h-[1.5rem] break-words whitespace-pre-wrap"
      >
        {value ? (
          value + '\u200b'
        ) : (
          <span className="text-gray-400">Message...</span>
        )}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Message..."
        className="absolute inset-0 h-full w-full resize-none bg-transparent text-transparent placeholder-transparent caret-gray-50 outline-none"
        rows={1}
      ></textarea>
    </div>
  )
}
