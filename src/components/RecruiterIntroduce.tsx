import Card from '@/components/Card'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Editor, EditorState, convertFromRaw } from 'draft-js'

export default function RecruiterIntroduce() {
  const profile = useAppSelector(selectProfile)

  let editorState = EditorState.createEmpty()
  try {
    editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(profile.description)))
  } catch {}
  return (
    <div className='grid w-full grid-cols-1 gap-4 p-4 lg:grid-cols-3 lg:px-0'>
      <div className='lg:col-span-2'>
        <Card>
          <h3 className='text-h3 mb-3 text-center lg:text-left'>Giới thiệu</h3>
          <div className='text-justify text-lg lg:text-base'>
            {profile.description ? (
              <div className='prose w-full max-w-full text-base'>
                <Editor editorState={editorState} readOnly onChange={() => {}} />
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center text-gray-500'>
                <img className='h-48 w-48' src='/images/none-result.webp' />
                <span className='text-sm'>Chưa có thông tin nhà tuyển dụng</span>
              </div>
            )}
          </div>
        </Card>
      </div>
      <div>
        <Card>
          <h3 className='text-h3 mb-3'>Thông tin liên hệ</h3>
          <div className='space-y-4'>
            <div className='flex flex-col gap-2'>
              <div className='text-h4 flex items-center gap-2 text-primary'>
                <FontAwesomeIcon icon={faLocationDot} />
                Địa chỉ:
              </div>
              <div className='ml-3'>{profile.address}</div>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='text-h4 flex items-center gap-2 text-primary'>
                <FontAwesomeIcon icon={faPhone} />
                Số điện thoại:
              </div>
              <div className='ml-3'>{profile.phone}</div>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='text-h4 flex items-center gap-2 text-primary'>
                <FontAwesomeIcon icon={faEnvelope} />
                Email:
              </div>
              <div className='ml-3'>{profile.email}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
