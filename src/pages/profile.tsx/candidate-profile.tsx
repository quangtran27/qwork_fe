import Container from '@/components/Container'
import ProfileHeader from '@/components/ProfileHeader'
import { candidateProfileTabs as tabs } from '@/constants/profile.constant'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth, selectProfile } from '@/redux/reducers/auth-slice'
import { Link, useSearchParams } from 'react-router-dom'
import NotFound from '../not-founded'

export default function CandidateProfile() {
  const auth = useAppSelector(selectAuth)
  const profile = useAppSelector(selectProfile)
  const [searchParams] = useSearchParams()
  const activedTabValue = searchParams.get('tab') || tabs[0].value

  const filteredTabs = tabs.filter((tab) => {
    if (tab.isPrivate) {
      return auth.user.id === profile.userId
    } else {
      return true
    }
  })
  const activedTab = tabs.find((tab) => tab.value === activedTabValue)

  return (
    <>
      <ProfileHeader />
      <div className='border-b bg-white shadow-sm'>
        <Container center={false}>
          <div className='flex items-start justify-center gap-2 border-t lg:justify-start'>
            {filteredTabs.map((tab, index) => (
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
      <Container>{activedTab ? <activedTab.tab /> : <NotFound />}</Container>
    </>
  )
}
