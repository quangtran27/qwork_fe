import CandidateDescription from '@/components/CandidateDescription'
import Card from '@/components/Card'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { Editor, EditorState, convertFromRaw } from 'draft-js'

export default function CandidateIntroduce() {
  const profile = useAppSelector(selectProfile)
  let editorState = EditorState.createEmpty()
  try {
    editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(profile.description)))
  } catch {}

  return (
    <div className='grid w-full grid-cols-1 gap-4 p-4 lg:grid-cols-2 lg:px-0'>
      <div>
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
                <span className='text-sm'>Chưa có thông tin ứng cử viên</span>
              </div>
            )}
          </div>
        </Card>
      </div>
      <CandidateDescription />
    </div>
  )
}
