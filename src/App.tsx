import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { ApplicationsView } from '@/components/applications/ApplicationsView'
import { blink } from '@/blink/client'
import { Toaster } from '@/components/ui/sonner'
import { createDatabaseTables } from '@/utils/createTables'
import { testDatabaseConnection } from '@/utils/testDatabase'

function App() {
  const [activeTab, setActiveTab] = useState('applications')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      
      // Initialize database tables when user is authenticated
      if (state.user && !state.isLoading) {
        try {
          console.log('Testing database connection...')
          const dbTest = await testDatabaseConnection()
          if (dbTest) {
            console.log('Database is working correctly')
          } else {
            console.log('Database test failed - attempting initialization...')
            const success = await createDatabaseTables()
            if (success) {
              console.log('Database initialized successfully')
            } else {
              console.log('Database initialization failed - app will continue with limited functionality')
            }
          }
        } catch (error) {
          console.error('Database initialization error:', error)
          console.log('App will continue with limited functionality')
        }
      }
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <p className="text-gray-600">You need to be authenticated to access the ATS.</p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'applications':
        return <ApplicationsView />
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="bg-white p-8 rounded-lg border text-center">
              <p className="text-gray-600">Dashboard coming soon...</p>
            </div>
          </div>
        )
      case 'jobs':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Jobs</h1>
            <div className="bg-white p-8 rounded-lg border text-center">
              <p className="text-gray-600">Job management coming soon...</p>
            </div>
          </div>
        )
      case 'candidates':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Candidates</h1>
            <div className="bg-white p-8 rounded-lg border text-center">
              <p className="text-gray-600">Candidate management coming soon...</p>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <div className="bg-white p-8 rounded-lg border text-center">
              <p className="text-gray-600">Settings coming soon...</p>
            </div>
          </div>
        )
      default:
        return <ApplicationsView />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 md:ml-64">
          <div className="p-6 md:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
      
      <Toaster />
    </div>
  )
}

export default App