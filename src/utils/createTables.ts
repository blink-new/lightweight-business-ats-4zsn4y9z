import { blink } from '@/blink/client'

export interface DatabaseSchema {
  jobs: {
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
  
  applications: {
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
  
  candidates: {
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
}

export async function createDatabaseTables() {
  try {
    console.log('Checking database connectivity...')
    
    const user = await blink.auth.me()
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Try to create tables by making a simple query first
    // If the database doesn't exist, this will trigger its creation
    console.log('Attempting to initialize database...')
    
    // Try a simple operation to trigger database creation
    try {
      // First, try to list existing records (this might trigger database creation)
      await blink.db.jobs.list({ limit: 1 })
      console.log('Database already exists and is accessible')
      return true
    } catch (error) {
      console.log('Database not accessible, attempting to create...')
      
      // If listing fails, try to create a record (this should trigger database creation)
      const tempId = `init_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      try {
        // Create a temporary job to initialize the database
        await blink.db.jobs.create({
          id: tempId,
          userId: user.id,
          title: 'Database Initialization',
          company: 'System',
          location: 'Remote',
          type: 'full-time',
          description: 'Temporary record for database initialization',
          requirements: 'None',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        
        // If successful, delete the temporary record
        await blink.db.jobs.delete(tempId)
        console.log('Database initialized successfully')
        return true
      } catch (createError) {
        console.error('Failed to initialize database:', createError)
        throw createError
      }
    }
  } catch (error) {
    console.error('Database initialization failed:', error)
    // Don't throw the error, just log it and continue
    // The app should still work even if database initialization fails
    return false
  }
}