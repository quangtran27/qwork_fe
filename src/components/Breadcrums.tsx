import { Link } from 'react-router-dom'

export type BreadcrumbItem = {
  label: string
  to: string
}

export type BreadcrumbsProps = {
  items?: BreadcrumbItem[]
}

export default function Breadcrumbs({ items = [] }: BreadcrumbsProps) {
  return (
    <div className='breadcrumbs py-0 text-sm'>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <Link to={item.to}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
