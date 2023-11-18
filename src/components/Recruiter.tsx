import { Profile } from '@/types/profile.type'
import { handleImageError } from '@/utils/handlers/error-image.handler'
import { Link } from 'react-router-dom'
import TooltipText from './TooltipText'

export default function Recruiter({ userId, name, avatar, background, description }: Profile) {
  return (
    <Link
      to={`/profile/${userId}`}
      className='flex flex-col items-center rounded-2xl border bg-white shadow-sm transition-all'
    >
      <div
        className='flex w-full items-end justify-center rounded-t-xl bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: `url('${background}')` }}
      >
        <figure className='relative h-24 w-24 translate-y-8 overflow-hidden rounded-full border bg-white'>
          <img
            src={`${avatar}`}
            alt={name}
            className='absolute h-full w-full object-contain'
            onError={handleImageError}
          />
        </figure>
      </div>
      <div className='w-full border-t p-4 pt-10'>
        <TooltipText
          className='mb-3 line-clamp-1 overflow-hidden text-ellipsis text-center text-lg font-semibold uppercase'
          content={name}
          description={name}
          ellipsis={true}
        />
        <p className='line-clamp-2 overflow-hidden text-ellipsis text-center'>{description}</p>
      </div>
    </Link>
  )
}
