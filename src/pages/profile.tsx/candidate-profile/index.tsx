import Container from '@/components/Container'
import ProfileHeader from '@/components/ProfileHeader'
import { candidateProfileTabs } from '@/constants/profile.constant'
import { Link, useSearchParams } from 'react-router-dom'
import Applications from './tabs/applications'
import Introduce from './tabs/introduce'

export default function CandidateProfile() {
  const [searchParams] = useSearchParams()
  const activedTab = searchParams.get('tab') || candidateProfileTabs[0].value

  return (
    <>
      <ProfileHeader />
      <div className='border-b bg-white shadow-sm'>
        <Container center={false}>
          <div className='flex items-start justify-center gap-2 border-t lg:justify-start'>
            {candidateProfileTabs.map((tab, index) => (
              <Link
                key={index}
                className={`${tab.value === activedTab && 'active'} link-underline cursor-pointer`}
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
      <Container>{activedTab === candidateProfileTabs[0].value ? <Introduce /> : <Applications />}</Container>
    </>
  )
}
