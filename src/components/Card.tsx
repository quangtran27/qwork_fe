type CardProps = {
  children?: React.ReactNode
  size?: 'sm' | 'md'
}

export default function Card({ children, size = 'md' }: CardProps) {
  return (
    <section className={`${size === 'md' ? 'p-6' : 'p-3'} rounded-2xl border bg-white shadow-sm`}>{children}</section>
  )
}
