import { ReactEventHandler } from 'react'

export const handleImageError: ReactEventHandler<HTMLImageElement> = (e) => {
  const target = e.target as HTMLImageElement
  target.src = '/images/error_image.png'
}
