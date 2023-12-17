import { Profile } from '@/types/profile.type'
import { Link } from 'react-router-dom'
import Card from './Card'
import routes from '@/configs/route.config'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import TooltipText from './TooltipText'

export default function Candidate({ ...props }: Profile) {
  let editorState = EditorState.createEmpty()
  try {
    editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(props.description)))
  } catch {}

  return (
    <Card>
      <Link to={routes.profile.replace(':id', props.userId)}>
        <div className='flex gap-4'>
          <div>
            <img
              src={props.avatar ? props.avatar : 'images/default.png'}
              className='h-14 w-14 overflow-hidden rounded-full border object-contain shadow-sm'
              alt=''
            />
          </div>
          <div className='flex-1'>
            <TooltipText
              className='line-clamp-1 overflow-hidden text-ellipsis text-lg font-semibold'
              content={props.name}
              description={props.name}
              ellipsis={true}
            />
            <p className='line-clamp-2 overflow-hidden text-ellipsis'>
              {convertToRaw(editorState.getCurrentContent())
                .blocks.map((block) => (!block.text.trim() && '\n') || block.text)
                .join('\n')}
            </p>
          </div>
        </div>
      </Link>
    </Card>
  )
}
