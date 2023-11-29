import routes from '@/configs/route.config'
import { ApiResponse } from '@/types/api.type'
import { ApplicationStatusEnum, ApplicationDetail as IApplicationDetail } from '@/types/applications.type'
import { applicationStatusToString } from '@/utils/converters/application.converter'
import { faCheck, faEnvelope, faFileLines, faPhone, faUser, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UseMutationResult } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Button from './Button'

type ApplicationDetail = IApplicationDetail & {
  useUpdateApplication: UseMutationResult<ApiResponse<IApplicationDetail>, unknown, ApplicationStatusEnum, unknown>
}

export default function ApplicationDetail({ ...props }: ApplicationDetail) {
  const navigate = useNavigate()
  const [statusContent, statusClass] = applicationStatusToString(props.status)
  const [searchParams] = useSearchParams()
  const isShow = (searchParams.get('detail') || '') === props.id
  const show = searchParams.get('show') || ''

  const handleCloseModal = () => {
    navigate(`?${new URLSearchParams({ show: show })}`)
  }

  const handleUpdateApplication = (to: ApplicationStatusEnum) => {
    props.useUpdateApplication.mutate(to)
  }

  return (
    <>
      {isShow && (
        <dialog id={`application_detail_${props.id}`} className='modal' open>
          <div className='modal-box max-h-[calc(100vh-100px)] max-w-screen-lg bg-gray-100'>
            <h3 className='text-h3'>Chi tiết đơn ứng tuyển</h3>
            <div className='mt-4 flex justify-between text-sm'>
              <div>
                Trạng thái: <span className={`${statusClass} badge font-semibold`}>{statusContent}</span>
              </div>
              <div>Lần cuối cập nhật: {props.updated}</div>
            </div>
            <div className='divider my-2' />
            {props.status === ApplicationStatusEnum.Is_Considering && (
              <>
                <div className='flex items-center'>
                  Chuyển sang:
                  <div className='ml-2 flex gap-2'>
                    <Button
                      size='sm'
                      color='error'
                      onClick={() => {
                        handleUpdateApplication(ApplicationStatusEnum.Is_Rejected)
                      }}
                    >
                      Từ chối <FontAwesomeIcon icon={faXmark} />
                    </Button>
                    <Button
                      size='sm'
                      color='success'
                      onClick={() => {
                        handleUpdateApplication(ApplicationStatusEnum.Is_Approved)
                      }}
                    >
                      Đã liên hệ <FontAwesomeIcon icon={faCheck} />
                    </Button>
                  </div>
                </div>
                <div className='divider my-2'></div>
              </>
            )}
            <div className='text-gray-500'>Ứng tuyển vào {props.created}</div>
            <div></div>
            <div className='my-3 grid grid-cols-4 items-center gap-4 py-4'>
              <div className='relative col-span-3 flex flex-col gap-2 rounded-3xl bg-white p-4 shadow'>
                <div className='flex gap-2'>
                  <span className='flex items-center gap-1'>
                    <FontAwesomeIcon icon={faUser} className='w-4 text-sm' /> Họ và tên:
                  </span>
                  <span>{props.name}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='flex items-center gap-1'>
                    <FontAwesomeIcon icon={faEnvelope} className='w-4 text-sm' /> Email:
                  </span>
                  <a href={`mailto:${props.email}`} className='link-hover'>
                    {props.email}
                  </a>
                </div>
                <div className='flex gap-2'>
                  <span className='flex items-center gap-1'>
                    <FontAwesomeIcon icon={faPhone} className='w-4 text-sm' /> Số điện thoại:
                  </span>
                  <span>{props.name}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='flex items-center gap-1'>
                    <FontAwesomeIcon icon={faFileLines} className='w-4 text-sm' /> CV đã ứng tuyển:
                  </span>
                  <Link className='link-primary link' to={props.cv}>
                    Tải về
                  </Link>
                </div>
              </div>
              <Link
                to={routes.profile.replace(':id', props.candidateUserId)}
                className='flex h-full flex-col items-center justify-center gap-2 rounded-3xl bg-white p-4 shadow'
              >
                <figure className='relative h-16 w-16 overflow-hidden rounded-full'>
                  <img src={props.candidateAvatar} alt='' className='absolute inset-0 object-contain' />
                </figure>
                <div className='text-h3 whitespace-nowrap'>{props.candidateName}</div>
              </Link>
            </div>
            <div>
              <p className='mb-2'>Xem trước CV: </p>
              <div>
                <iframe
                  id={props.id}
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${props.cv}`}
                  sandbox='allow-same-origin allow-scripts allow-popups allow-forms'
                  referrerPolicy='strict-origin-when-cross-origin'
                  className='h-[calc(100vh-100px)] w-full'
                />
              </div>
            </div>
            <div onClick={handleCloseModal}>
              <button className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'>✕</button>
            </div>
          </div>
          <div className='modal-backdrop cursor-default bg-black/20' onClick={handleCloseModal}>
            <button>close</button>
          </div>
        </dialog>
      )}
    </>
  )
}
