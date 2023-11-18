import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

type TooltipTextProps = {
  content: string
  className?: string
  description: string
  ellipsis?: boolean
  maxLines?: number
}

export default function TooltipText({ content, className, description, ellipsis = false, maxLines }: TooltipTextProps) {
  return (
    <Tippy content={description} delay={[400, 0]}>
      <span className={`${ellipsis ? `line-clamp-${maxLines || 1} overflow-hidden text-ellipsis` : ''} ${className}`}>
        {content}
      </span>
    </Tippy>
  )
}
