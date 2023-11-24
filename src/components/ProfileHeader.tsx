import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth, selectProfile } from '@/redux/reducers/auth-slice'
import { ProfileType, UpdateProfileAction } from '@/types/profile.type'
import { faCamera, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Button from './Button'
import Container from './Container'
import TooltipText from './TooltipText'
import UpdateAvatar from './UpdateAvatar'
import UpdateBackground from './UpdateBackground'
import UpdatePassword from './UpdatePassword'
import UpdateProfile from './UpdateProfile'

export default function ProfileHeader() {
  const navigate = useNavigate()
  const auth = useAppSelector(selectAuth)
  const profile = useAppSelector(selectProfile)
  const isLoggedUser = useAppSelector(selectAuth).id === profile.userId
  const avatarRef = useRef<HTMLDialogElement>(null)
  const updateAvatarRef = useRef<HTMLDialogElement>(null)

  const [searchParams] = useSearchParams()
  const action = searchParams.get('action') || ''

  const handleUpdateBackground = () => {
    searchParams.set('action', UpdateProfileAction.updateBackground)
    navigate({ search: searchParams.toString() })
  }

  const changeUrlAction = (action: string) => {
    searchParams.set('action', action)
    navigate({ search: searchParams.toString() })
  }

  return (
    <div className='mt-header'>
      <div
        className='relative h-48 bg-cover bg-no-repeat lg:h-80'
        style={{
          backgroundImage: `url('${profile.background ? profile.background : '/images/login-background.jpg'}')`,
        }}
      >
        {profile.type === ProfileType.recruiter && auth.id === profile.userId && (
          <div className='absolute inset-0'>
            <div className='mx-auto flex h-full w-full max-w-screen-xl items-start justify-end lg:items-end'>
              <Button
                className='mt-4 bg-black/40 text-white lg:mb-6 lg:mt-0'
                color='default'
                variant='outline'
                onClick={handleUpdateBackground}
              >
                <FontAwesomeIcon className='text-lg' icon={faCamera} />
                Cập nhật ảnh bìa
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className='bg-white'>
        <Container>
          <div className='relative -mb-20 flex w-full -translate-y-24 flex-col items-center gap-4 lg:-mb-0 lg:h-36 lg:-translate-y-0 lg:flex-row lg:gap-8'>
            <Link
              to={`?action=${UpdateProfileAction.updateAvatar}`}
              className='relative h-[168px] w-[168px] cursor-pointer rounded-full border-4 border-white bg-white shadow-lg lg:-translate-y-8'
            >
              <img
                className='absolute h-full w-full rounded-full object-contain transition-all hover:brightness-75'
                src={!!profile.avatar ? profile.avatar : '/images/default.png'}
                alt={profile.name}
                onClick={() => {
                  avatarRef.current?.showModal()
                }}
              />
              {auth.id === profile.userId && (
                <div className='right absolute bottom-0 right-0 z-10 flex justify-center'>
                  <Button
                    className='btn-circle btn-sm'
                    color='default'
                    onClick={() => {
                      updateAvatarRef.current?.showModal()
                    }}
                  >
                    <FontAwesomeIcon className='text-lg' icon={faCamera} />
                  </Button>
                </div>
              )}
            </Link>
            <div className='flex flex-1 flex-col items-center gap-2 lg:items-start'>
              <TooltipText className='text-h1' content={profile.name} description={profile.name} ellipsis />
              <span className={`badge ${profile.type === 'candidate' && 'badge-secondary'} badge-primary p-3`}>
                {profile.type === 'candidate' ? 'Ứng cử viên' : 'Nhà tuyển dụng'}
              </span>
              {profile.type === 'candidate' && <span className='badge badge-warning p-3'>{profile.position}</span>}
            </div>
            {isLoggedUser && (
              <div className='flex h-full flex-col items-center gap-2 bg-white lg:flex-row lg:gap-4'>
                <Button
                  variant='outline'
                  className='w-full lg:w-[unset]'
                  onClick={() => {
                    changeUrlAction(UpdateProfileAction.updateProfile)
                  }}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                  Cập nhật hồ sơ
                </Button>
              </div>
            )}
          </div>
        </Container>
      </div>
      {action === UpdateProfileAction.updateProfile && <UpdateProfile />}
      {action === UpdateProfileAction.updatePassword && <UpdatePassword />}
      {action === UpdateProfileAction.updateAvatar && <UpdateAvatar />}
      {action === UpdateProfileAction.updateBackground && <UpdateBackground />}
    </div>
  )
}
