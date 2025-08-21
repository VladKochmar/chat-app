interface AvatarProps {
  photoURL?: string | null
  name?: string
}

export default function Avatar({ photoURL, name }: AvatarProps) {
  if (photoURL) {
    return <img src={photoURL} alt={name} className="size-10 rounded-full" />
  }

  return (
    <div className="flex size-10 items-center justify-center rounded-full bg-indigo-600 font-medium uppercase">
      {name ? name[0] : 'u'}
    </div>
  )
}
