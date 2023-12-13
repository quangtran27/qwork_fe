import { useAppSelector } from '@/hook/useAppSelector'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { RefObject, forwardRef } from 'react'
import UpdateCandidateProfile from './UpdateCandidateProfile'
import UpdateRecruiterProfile from './UpdateRecruiterProfile'

const UpdateProfile = forwardRef<HTMLDialogElement>(({}, ref) => {
  const profile = useAppSelector(selectProfile)

  return (
    <dialog id='update-profile-modal' className='modal' ref={ref}>
      <div className='modal-box max-w-screen-md p-4 lg:w-[922px] lg:p-6'>
        <h3 className='text-h3'>Cập nhật thông tin hồ sơ</h3>
        {profile.type === 'candidate' ? (
          <UpdateCandidateProfile parentRef={ref as RefObject<HTMLDialogElement>} />
        ) : (
          <UpdateRecruiterProfile parentRef={ref as RefObject<HTMLDialogElement>} />
        )}
        <form method='dialog'>
          <button className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'>✕</button>
        </form>
      </div>
      <form method='dialog' className='modal-backdrop bg-black/20'>
        <button>close</button>
      </form>
    </dialog>
  )
})

UpdateProfile.displayName = 'UpdateProfile'
export default UpdateProfile
