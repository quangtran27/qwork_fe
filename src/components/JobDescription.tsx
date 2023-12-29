import { Job } from '@/types/jobs.type'
import { Editor, EditorState, convertFromRaw } from 'draft-js'
import Card from './Card'

type JobDescriptionProps = Job

export default function JobDescription({ description }: JobDescriptionProps) {
  const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(description)))

  return (
    <Card>
      <h3 className='text-h3 my-2'>Thông tin chi tiết tuyển dụng</h3>
      <div className='prose w-full max-w-full text-base'>
        <Editor editorState={editorState} readOnly onChange={() => {}} />
      </div>
    </Card>
  )
}
