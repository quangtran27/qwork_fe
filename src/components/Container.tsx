import { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  center?: boolean
}

export default function Container({ children, center = true }: ContainerProps) {
  return (
    <section className={`${center ? 'items-center' : ''} mx-auto flex w-full max-w-screen-xl flex-col`}>
      {children}
    </section>
  )
}
