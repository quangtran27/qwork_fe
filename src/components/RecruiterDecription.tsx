import { Profile } from '@/types/profile.type'
import { faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

export default function RecruiterDescription({ address, description, phone }: Profile) {
  const [showDescription, setShowDescription] = useState(false)

  return (
    <div className='flex flex-col gap-6 lg:col-span-3'>
      <div className='rounded-2xl border bg-white p-4 shadow-sm'>
        <h3 className='text-h3 text-center lg:text-left'>Giới thiệu công ty</h3>
        <p className={!showDescription ? 'line-clamp-5 overflow-hidden text-ellipsis' : ''}>{description}</p>
        <p
          className='cursor-pointer py-1 text-center text-primary'
          onClick={() => {
            setShowDescription((prev) => !prev)
          }}
        >
          {showDescription ? 'Ẩn bớt' : '...Xem thêm'}
        </p>
      </div>
      <div className='flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm'>
        <h3 className='text-h3 text-center lg:text-left'>Thông tin liên hệ</h3>
        <div className='flex flex-col gap-2'>
          <div className='text-h4 flex items-center gap-2 text-primary'>
            <FontAwesomeIcon icon={faLocationDot} />
            Địa chỉ công ty:
          </div>
          <div>
            {address.includes('\n') ? (
              <ul>
                {address.split('\n').map((line) => (
                  <li className='mb-1'>{line}</li>
                ))}
              </ul>
            ) : (
              address
            )}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-h4 flex items-center gap-2 text-primary'>
            <FontAwesomeIcon icon={faPhone} />
            Số điện thoại:
          </div>
          <div> {phone}</div>
        </div>
      </div>
    </div>
  )
}
