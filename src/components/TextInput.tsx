import clsx from 'clsx'
import { InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react'

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean
  errorMessage?: string
  insideClass?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

type Ref = HTMLInputElement

const TextInput = forwardRef<Ref, TextInputProps>(
  ({ className, error = false, errorMessage, iconLeft, iconRight, insideClass, ...attributes }, ref) => {
    const id = useId()

    const wrapperMergedClass = clsx('relative', className)

    const mergedClass = clsx(
      insideClass,
      'input bg-base-200 placeholder:font-medium w-full rounded-full',
      iconLeft && 'pl-10',
      iconRight && 'pr-10',
    )

    return (
      <div className={wrapperMergedClass}>
        {iconLeft && <div className='absolute inset-y-0 left-0 flex items-center pl-4'>{iconLeft}</div>}
        <input id={id} className={mergedClass} {...attributes} ref={ref} />
        {iconRight && <div className='absolute inset-y-0 right-0 flex items-center pr-4'>{iconRight}</div>}
        {error && <div className='px-4 py-1 text-error'>{errorMessage}</div>}
      </div>
    )
  },
)

TextInput.displayName = 'TextInput'
export default TextInput
