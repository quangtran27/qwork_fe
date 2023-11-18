import Button from './Button'

type HashtagsProps = {
  tags?: string[]
}

export default function Hashtags({ tags = [] }: HashtagsProps) {
  return (
    <div className='rounded-3xl bg-white p-4 shadow'>
      <h3 className='mb-3 text-xl font-bold'>Từ khoá</h3>
      <div className='flex gap-2'>
        {tags.map((tag, index) => (
          <Button key={index} color='default' size='sm' variant='outline'>
            #{tag}
          </Button>
        ))}
      </div>
    </div>
  )
}
