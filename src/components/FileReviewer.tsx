type FileReviewerProps = {
  id?: string
  title?: string
  src?: string
}

export default function FileReviewer({ ...props }: FileReviewerProps) {
  return (
    <div>
      <p>{props.id}</p>
      <div className='px-16'>
        <iframe
          id={props.src}
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${props.src}`}
          sandbox='allow-same-origin allow-scripts allow-popups allow-forms'
          referrerPolicy='strict-origin-when-cross-origin'
          className='h-[calc(100vh-100px)] w-full'
        />
      </div>
    </div>
  )
}
