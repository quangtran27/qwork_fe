import { CandidateProfile, Profile, RecruiterProfile } from '@/types/profile.type'

export const profileToCandidateProfile = (profile: Profile): CandidateProfile => {
  return {
    name: profile.name,
    phone: profile.phone,
    description: profile.description,
    address: profile.address,
    position: profile.position || '',
    gender: profile.gender || '',
    birthDay: profile.birthDay || '',
    email: profile.email,
  }
}

export const profileToRecruiterProfile = (profile: Profile): RecruiterProfile => {
  return {
    name: profile.name,
    phone: profile.phone,
    address: profile.address,
    email: profile.email,
    description: profile.description,
  }
}
