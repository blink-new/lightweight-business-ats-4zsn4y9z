export interface Job {
  id: string
  userId: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract'
  description: string
  requirements: string
  salaryMin?: number
  salaryMax?: number
  status: 'active' | 'paused' | 'closed'
  createdAt: string
  updatedAt: string
}

export interface Application {
  id: string
  jobId: string
  userId: string
  candidateName: string
  candidateEmail: string
  candidatePhone?: string
  resumeUrl?: string
  coverLetter?: string
  status: 'new' | 'reviewing' | 'interview' | 'rejected' | 'hired'
  aiMatchScore?: number
  aiMatchAnalysis?: string
  createdAt: string
  updatedAt: string
}

export interface Candidate {
  id: string
  userId: string
  name: string
  email: string
  phone?: string
  resumeUrl?: string
  linkedinUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface AIMatchResult {
  score: number
  analysis: string
  strengths: string[]
  concerns: string[]
}