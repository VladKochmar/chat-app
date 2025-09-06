import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

export default function ScrollButton({
  boxRef,
}: {
  boxRef: RefObject<HTMLDivElement | null>
}) {
  const [showButton, setShowButton] = useState(true)

  useEffect(() => {
    const box = boxRef.current

    const handleScroll = () => {
      if (!box) return
      const isBottom = box.scrollTop + box.clientHeight >= box.scrollHeight - 10
      setShowButton(isBottom)
    }

    box?.addEventListener('scroll', handleScroll)
    return () => box?.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToBottom = () => {
    if (boxRef.current) {
      boxRef.current.scrollTo({
        top: boxRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }

  if (showButton) return null

  return (
    <button
      onClick={scrollToBottom}
      aria-label="Go to bottom"
      className="absolute right-4 bottom-4 z-10 inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-gray-600 bg-emerald-500/40 transition-colors duration-300 hover:bg-emerald-500/60 md:right-8"
    >
      <ChevronDown />
    </button>
  )
}
