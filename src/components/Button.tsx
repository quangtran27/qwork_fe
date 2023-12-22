import { ElementColor, ElementSize, ElementVariant } from '@/types/element.type'
import clsx from 'clsx'
import { ButtonHTMLAttributes, ReactNode } from 'react'

const getColorClass = (color: ElementColor) => {
  return {
    default: 'btn-default',
    neutral: 'btn-neutral',
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    info: 'btn-info',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error',
    ghost: 'btn-ghost',
  }[color]
}
const getSizeClass = (size: ElementSize) => {
  return {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  }[size]
}
const getVariantClass = (variant: ElementVariant) => {
  return {
    contain: 'btn-contain',
    outline: 'btn-outline',
  }[variant]
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode
  color?: ElementColor
  loading?: boolean
  size?: ElementSize
  variant?: ElementVariant
}

export default function Button({
  children,
  className = '',
  color = 'default',
  disabled,
  loading = false,
  size = 'md',
  variant = 'contain',
  ...attributes
}: Props) {
  const mergedClass = clsx(
    className,
    'font-semibold btn rounded-full normal-case',
    'btn-disabled cursor-not-allowed' && (disabled || loading),
    getSizeClass(size),
    getColorClass(color),
    getVariantClass(variant),
  )

  return (
    <button className={mergedClass} disabled={disabled || loading} {...attributes}>
      {loading ? <span className='loading loading-dots'></span> : children}
    </button>
  )
}
