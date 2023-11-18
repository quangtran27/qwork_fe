import Container from '@/components/Container'
import ProfileHeader from '@/components/ProfileHeader'
import { recruiterProfileTabs } from '@/constants/profile.constant'
import { useState } from 'react'
import Applications from './tabs/applications'
import Jobs from './tabs/jobs'

export default function RecruiterProfile() {
  const [activedTab, setActivedTab] = useState(0)

  return (
    <div className='min-h-screen'>
      <ProfileHeader />
      <div className='bg-white'>
        <Container center={false}>
          <div className='flex items-start justify-center gap-2 border-t lg:justify-start'>
            {recruiterProfileTabs.map((tab, index) => (
              <span
                key={index}
                className={`${index === activedTab && 'active font-semibold'} link-underline cursor-pointer`}
                style={{
                  padding: '1rem',
                }}
                onClick={() => {
                  setActivedTab(index)
                }}
              >
                {tab}
              </span>
            ))}
          </div>
        </Container>
      </div>
      <Container>
        {activedTab === 0 && <Jobs />}
        {activedTab === 1 && <Applications />}
      </Container>
    </div>
  )
}
