import Container from '@/components/Container'
import ProfileHeader from '@/components/ProfileHeader'
import { recruiterProfileTabs as tabs } from '@/constants/profile.constant'
import { Link, useSearchParams } from 'react-router-dom'

export default function RecruiterProfile() {
  const [searchParams] = useSearchParams()
  const activedTabValue = searchParams.get('tab') || tabs[0].value
  const ActiveTabJSX = tabs.find((tab) => tab.value === activedTabValue) ?? tabs[0]

  return (
    <>
      <ProfileHeader />
      <div className='border-b bg-white shadow-sm'>
        <Container center={false}>
          <div className='flex items-start justify-center gap-2 border-t lg:justify-start'>
            {tabs.map((tab, index) => (
              <Link
                key={index}
                className={`${tab.value === activedTabValue && 'active'} link-underline cursor-pointer`}
                to={`?tab=${tab.value}`}
                style={{
                  padding: '1rem',
                }}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
      <div className='mx-auto w-full max-w-screen-xl'>
        <ActiveTabJSX.tab />
      </div>
    </>
  )
}
