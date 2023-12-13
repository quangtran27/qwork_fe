const routes = {
  activeUser: 'active/:email/:token',
  account: '/account',
  changePassword: '/change-password',
  forgotPassword: '/forgot-password',
  home: '/',
  jobs: '/jobs',
  jobApplications: '/jobs/:id/',
  jobDetail: '/jobs/:id',
  login: '/login',
  profile: '/profile/:id',
  recruiters: '/recruiters',
  register: '/register',
  searchJobs: '/jobs/search',
  searchRecruiters: '/recruiters/search',
  registerSuccess: '/register-success',
  verifyEmail: '/verify-email',
  resetPassword: '/reset-password/:email/:token',
}

export default routes
