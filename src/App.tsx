import { Route, Routes } from 'react-router-dom'
import PersistLogin from './components/PersistLogin'
import routes from './configs/route.config'
import RootLayout from './layouts/RootLayout'
import Account from './pages/account.tsx'
import ActiveUser from './pages/active-user.tsx'
import ChangePassword from './pages/change-password.tsx'
import ForgotPassword from './pages/forgot-password'
import Home from './pages/home'
import JobDetail from './pages/job-detail'
import Jobs from './pages/jobs'
import Login from './pages/login'
import Profile from './pages/profile.tsx'
import Recruiters from './pages/recruiters'
import Register from './pages/register'
import RegisterSuccess from './pages/register-sucess.tsx'
import ResetPassword from './pages/reset-password.tsx'
import SearchJobs from './pages/search-jobs.tsx'
import SearchRecruiters from './pages/search-recruiters.tsx'
import Test from './pages/test.tsx'
import VerifyEmail from './pages/verify-email.tsx'

function App() {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route element={<RootLayout />}>
          <Route path={routes.home} element={<Home />} />
          <Route path='/test' element={<Test />} />
          <Route path={routes.login} element={<Login />} />
          <Route path={routes.register} element={<Register />} />
          <Route path={routes.jobs} element={<Jobs />} />
          <Route path={routes.searchJobs} element={<SearchJobs />} />
          <Route path={routes.jobDetail} element={<JobDetail />} />
          <Route path={routes.recruiters} element={<Recruiters />} />
          <Route path={routes.searchRecruiters} element={<SearchRecruiters />} />
          <Route path={routes.profile} element={<Profile />} />
          <Route path={routes.account} element={<Account />} />
          <Route path={routes.activeUser} element={<ActiveUser />} />
          <Route path={routes.changePassword} element={<ChangePassword />} />
          <Route path={routes.forgotPassword} element={<ForgotPassword />} />
          <Route path={routes.resetPassword} element={<ResetPassword />} />
          <Route path={routes.registerSuccess} element={<RegisterSuccess />} />
          <Route path={routes.verifyEmail} element={<VerifyEmail />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
