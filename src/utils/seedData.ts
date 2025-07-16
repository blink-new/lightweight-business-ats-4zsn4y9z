import { blink } from '@/blink/client'
import { sampleJobs, sampleApplications } from '@/data/sampleData'

export async function seedSampleData() {
  try {
    const user = await blink.auth.me()
    
    // Check if data already exists
    let existingJobs = []
    try {
      existingJobs = await blink.db.jobs.list({ 
        where: { userId: user.id },
        limit: 1 
      })
    } catch (error) {
      console.log('Jobs table does not exist yet, will be created when first record is added')
    }
    
    if (existingJobs.length > 0) {
      console.log('Sample data already exists')
      return
    }

    console.log('Seeding sample data...')
    
    // Create jobs first (applications depend on jobs)
    const createdJobs = []
    for (const jobData of sampleJobs) {
      try {
        const job = await blink.db.jobs.create({
          ...jobData,
          userId: user.id
        })
        createdJobs.push(job)
        console.log(`Created job: ${job.title}`)
        
        // Add a small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`Failed to create job ${jobData.title}:`, error)
        // If this is a database not found error, throw it to stop the process
        if (error.message?.includes('Database for project') || error.message?.includes('not found')) {
          throw new Error('Database not available. Please try again in a moment.')
        }
      }
    }
    
    // Create applications
    for (const appData of sampleApplications) {
      try {
        const application = await blink.db.applications.create({
          ...appData,
          userId: user.id
        })
        console.log(`Created application from: ${application.candidateName}`)
        
        // Add a small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`Failed to create application from ${appData.candidateName}:`, error)
        // If this is a database not found error, throw it to stop the process
        if (error.message?.includes('Database for project') || error.message?.includes('not found')) {
          throw new Error('Database not available. Please try again in a moment.')
        }
      }
    }
    
    console.log('Sample data seeded successfully!')
  } catch (error) {
    console.error('Error seeding sample data:', error)
    throw error
  }
}