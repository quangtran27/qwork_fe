type LoadingProps = {
  content?: JSX.Element | string
}

export default function Loading({ content = '' }: LoadingProps) {
  return (
    <div className='flex items-center justify-center text-gray-500'>
      {content}
      <div className='flex justify-center p-2'>
        <span className='loading loading-dots' />
      </div>
    </div>
  )
}
