import { useAppSelector } from '@/hook/useAppSelector'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { dateTimeConverter } from '@/utils/converters/datetime.converter'
import { faCalendarDays, faChildren, faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function CandidateDescription() {
  const profile = useAppSelector(selectProfile)
  const birthDay = dateTimeConverter.dateStringToDate(profile.birthDay || '2000-01-01').join('-')
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-4 rounded-3xl bg-white p-4 text-lg shadow lg:text-base'>
        <h3 className='text-h3'>Thông tin liên hệ</h3>
        <div className='flex flex-col gap-2'>
          <div className='text-h4 flex items-center gap-2 text-primary'>
            <FontAwesomeIcon icon={faCalendarDays} />
            Ngày sinh:
          </div>
          <div>{birthDay}</div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-h4 flex items-center gap-2 text-primary'>
            <FontAwesomeIcon icon={faChildren} />
            Giới tính:
          </div>
          <div>{profile.gender === 'male' ? 'Nam' : 'Nữ'}</div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-h4 flex items-center gap-2 text-primary'>
            <FontAwesomeIcon icon={faLocationDot} />
            Địa chỉ:
          </div>
          <div> {profile.address}</div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-h4 flex items-center gap-2 text-primary'>
            <FontAwesomeIcon icon={faPhone} />
            Số điện thoại:
          </div>
          <div> {profile.phone}</div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-h4 flex items-center gap-2 text-primary'>
            <FontAwesomeIcon icon={faEnvelope} />
            Email:
          </div>
          <div> {profile.email}</div>
        </div>
      </div>
    </div>
  )
}
