import { Route, Routes } from 'react-router-dom'
import PersistLogin from './components/PersistLogin'
import routes from './configs/route.config'
import RootLayout from './layouts/RootLayout'
import ForgotPassword from './pages/forgot-password/index.tsx'
import Home from './pages/home'
import JobDetail from './pages/job-detail'
import Jobs from './pages/jobs'
import Login from './pages/login'
import Profile from './pages/profile.tsx'
import Recruiters from './pages/recruiters'
import Register from './pages/register'
import SearchJobs from './pages/search-jobs.tsx'
import SearchRecruiters from './pages/search-recruiters.tsx'

function App() {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route element={<RootLayout />}>
          <Route path={routes.home} element={<Home />} />
          <Route path={routes.login} element={<Login />} />
          <Route path={routes.register} element={<Register />} />
          <Route path={routes.jobs} element={<Jobs />} />
          <Route path={routes.searchJobs} element={<SearchJobs />} />
          <Route path={routes.jobDetail} element={<JobDetail />} />
          <Route path={routes.recruiters} element={<Recruiters />} />
          <Route path={routes.searchRecruiters} element={<SearchRecruiters />} />
          <Route path={routes.profile} element={<Profile />} />
          <Route path={routes.forgotPassword} element={<ForgotPassword />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
