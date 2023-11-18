import { PropsWithChildren } from 'react'

export default function Card({ children }: PropsWithChildren) {
  return <section className='max-w-full rounded-3xl bg-white p-8 shadow'>{children}</section>
}
