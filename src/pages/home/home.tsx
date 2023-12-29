import OutstandingJobs from '@/components/OutstandingJobs'
import OutstandingRecruiters from '@/components/OutstandingRecuiters'
import SearchBox from '@/components/SearchBox'
import routes from '@/configs/route.config'

export default function CommonHome() {
  return (
    <>
      <SearchBox
        title='Tìm việc làm nhanh 24h, việc làm mới nhất và nhanh chóng trên toàn quốc'
        body={<></>}
        placeholder='Tên công việc, vị trí ứng tuyển...'
        searchPath={routes.searchJobs}
      />
      <section className='mt-8 px-4 lg:px-0'>
        <OutstandingRecruiters />
      </section>
      <section className='mt-4 px-4 lg:px-0'>
        <OutstandingJobs />
      </section>
    </>
  )
}
