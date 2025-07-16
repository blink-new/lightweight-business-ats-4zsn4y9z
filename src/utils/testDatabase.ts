import { blink } from '@/blink/client'

export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...')
    
    const user = await blink.auth.me()
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Try to create a simple test record
    const testId = `test_${Date.now()}`
    
    console.log('Attempting to create test job record...')
    const testJob = await blink.db.jobs.create({
      id: testId,
      userId: user.id,
      title: 'Test Job',
      company: 'Test Company',
      location: 'Test Location',
      type: 'full-time',
      description: 'Test description',
      requirements: 'Test requirements',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    
    console.log('Test job created successfully:', testJob)
    
    // Try to list records
    const jobs = await blink.db.jobs.list({ limit: 1 })
    console.log('Jobs list successful:', jobs.length)
    
    // Clean up test record
    await blink.db.jobs.delete(testId)
    console.log('Test job deleted successfully')
    
    return true
  } catch (error) {
    console.error('Database test failed:', error)
    return false
  }
}