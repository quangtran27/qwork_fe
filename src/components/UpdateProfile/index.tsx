import { useAppSelector } from '@/hook/useAppSelector'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { useNavigate } from 'react-router-dom'
import UpdateCandidateProfile from './UpdateCandidateProfile'
import UpdateRecruiterProfile from './UpdateRecruiterProfile'

export default function UpdateProfile() {
  const navigate = useNavigate()
  const profile = useAppSelector(selectProfile)

  const handleCloseModal = () => {
    navigate('')
  }

  return (
    <dialog id='update-profile-modal' className='modal' open>
      <div className='modal-box max-w-screen-md p-4 lg:w-[722px] lg:p-6'>
        <h3 className='text-h3'>Cập nhật thông tin cá nhân</h3>
        {profile.type === 'candidate' ? (
          <UpdateCandidateProfile handleCloseModal={handleCloseModal} />
        ) : (
          <UpdateRecruiterProfile handleCloseModal={handleCloseModal} />
        )}
        <button className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2' onClick={handleCloseModal}>
          ✕
        </button>
      </div>
      <div className='modal-backdrop bg-black/20' onClick={handleCloseModal} />
    </dialog>
  )
}
