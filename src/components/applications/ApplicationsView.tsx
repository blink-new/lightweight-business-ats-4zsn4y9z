import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ApplicationCard } from './ApplicationCard'
import { blink } from '@/blink/client'
import { Application, Job } from '@/types'
import { analyzeApplicationMatch } from '@/services/aiMatching'
import { seedSampleData } from '@/utils/seedData'
import { Search, Filter, Brain, Zap, Database } from 'lucide-react'
import { toast } from 'sonner'

export function ApplicationsView() {
  const [applications, setApplications] = useState<Application[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [loading, setLoading] = useState(true)
  const [analyzingAll, setAnalyzingAll] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = applications

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'match-score':
          return (b.aiMatchScore || 0) - (a.aiMatchScore || 0)
        case 'name':
          return a.candidateName.localeCompare(b.candidateName)
        default:
          return 0
      }
    })

    setFilteredApplications(filtered)
  }, [applications, searchTerm, statusFilter, sortBy])

  const loadData = async () => {
    try {
      const user = await blink.auth.me()
      
      // Load applications and jobs
      const [applicationsData, jobsData] = await Promise.all([
        blink.db.applications.list({ 
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        }).catch((error) => {
          console.log('Applications table not accessible:', error.message)
          return []
        }),
        blink.db.jobs.list({ 
          where: { userId: user.id }
        }).catch((error) => {
          console.log('Jobs table not accessible:', error.message)
          return []
        })
      ])
      
      setApplications(applicationsData)
      setJobs(jobsData)
    } catch (error) {
      console.error('Error loading data:', error)
      // Only show error toast for unexpected errors
      if (!error.message?.includes('Database for project') && !error.message?.includes('not found')) {
        toast.error('Failed to load applications')
      }
    } finally {
      setLoading(false)
    }
  }



  const handleStatusChange = async (applicationId: string, status: Application['status']) => {
    try {
      await blink.db.applications.update(applicationId, { 
        status,
        updatedAt: new Date().toISOString()
      })
      
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status, updatedAt: new Date().toISOString() }
            : app
        )
      )
      
      toast.success('Application status updated')
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleAnalyzeMatch = async (applicationId: string) => {
    const application = applications.find(app => app.id === applicationId)
    const job = jobs.find(j => j.id === application?.jobId)
    
    if (!application || !job) {
      toast.error('Application or job not found')
      return
    }

    try {
      toast.info('Analyzing application match...')
      const matchResult = await analyzeApplicationMatch(application, job)
      
      // Update application with AI analysis
      await blink.db.applications.update(applicationId, {
        aiMatchScore: matchResult.score,
        aiMatchAnalysis: JSON.stringify({
          analysis: matchResult.analysis,
          strengths: matchResult.strengths,
          concerns: matchResult.concerns
        }),
        updatedAt: new Date().toISOString()
      })
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { 
                ...app, 
                aiMatchScore: matchResult.score,
                aiMatchAnalysis: JSON.stringify({
                  analysis: matchResult.analysis,
                  strengths: matchResult.strengths,
                  concerns: matchResult.concerns
                }),
                updatedAt: new Date().toISOString()
              }
            : app
        )
      )
      
      toast.success(`Match analysis complete! Score: ${matchResult.score}%`)
    } catch (error) {
      console.error('Error analyzing match:', error)
      toast.error('Failed to analyze application match')
    }
  }

  const handleAnalyzeAll = async () => {
    const unanalyzedApps = applications.filter(app => !app.aiMatchScore)
    
    if (unanalyzedApps.length === 0) {
      toast.info('All applications have already been analyzed')
      return
    }

    setAnalyzingAll(true)
    toast.info(`Analyzing ${unanalyzedApps.length} applications...`)

    let analyzed = 0
    for (const application of unanalyzedApps) {
      const job = jobs.find(j => j.id === application.jobId)
      if (job) {
        try {
          const matchResult = await analyzeApplicationMatch(application, job)
          
          await blink.db.applications.update(application.id, {
            aiMatchScore: matchResult.score,
            aiMatchAnalysis: JSON.stringify({
              analysis: matchResult.analysis,
              strengths: matchResult.strengths,
              concerns: matchResult.concerns
            }),
            updatedAt: new Date().toISOString()
          })
          
          setApplications(prev => 
            prev.map(app => 
              app.id === application.id 
                ? { 
                    ...app, 
                    aiMatchScore: matchResult.score,
                    aiMatchAnalysis: JSON.stringify({
                      analysis: matchResult.analysis,
                      strengths: matchResult.strengths,
                      concerns: matchResult.concerns
                    }),
                    updatedAt: new Date().toISOString()
                  }
                : app
            )
          )
          
          analyzed++
          toast.info(`Analyzed ${analyzed}/${unanalyzedApps.length} applications`)
          
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error) {
          console.error(`Error analyzing application ${application.id}:`, error)
        }
      }
    }

    setAnalyzingAll(false)
    toast.success(`Analysis complete! Analyzed ${analyzed} applications`)
  }

  const handleSeedData = async () => {
    try {
      await seedSampleData()
      await loadData() // Reload data after seeding
      toast.success('Sample data added successfully!')
    } catch (error) {
      console.error('Error seeding data:', error)
      if (error.message?.includes('Database not available')) {
        toast.error('Database is not ready yet. Please try again in a moment.')
      } else {
        toast.error('Failed to add sample data')
      }
    }
  }

  const getStatusCounts = () => {
    const counts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return counts
  }

  const statusCounts = getStatusCounts()
  const unanalyzedCount = applications.filter(app => !app.aiMatchScore).length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Applications</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-gray-600">
            {applications.length} total applications
          </p>
        </div>
        
        <div className="flex gap-2">
          {applications.length === 0 && (
            <Button 
              onClick={handleSeedData}
              variant="outline"
            >
              <Database className="h-4 w-4 mr-2" />
              Add Sample Data
            </Button>
          )}
          
          {unanalyzedCount > 0 && (
            <Button 
              onClick={handleAnalyzeAll}
              disabled={analyzingAll}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              {analyzingAll ? 'Analyzing...' : `AI Analyze All (${unanalyzedCount})`}
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {statusCounts.new || 0}
            </div>
            <div className="text-sm text-gray-600">New</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {statusCounts.reviewing || 0}
            </div>
            <div className="text-sm text-gray-600">Reviewing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {statusCounts.interview || 0}
            </div>
            <div className="text-sm text-gray-600">Interview</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {statusCounts.hired || 0}
            </div>
            <div className="text-sm text-gray-600">Hired</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {statusCounts.rejected || 0}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="match-score">Match Score</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Grid */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Brain className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-600 mb-4">
              {applications.length === 0 
                ? "You haven't received any applications yet. Get started by adding some sample data to explore the features."
                : "No applications match your current filters."
              }
            </p>
            {applications.length === 0 && (
              <Button 
                onClick={handleSeedData}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Database className="h-4 w-4 mr-2" />
                Add Sample Data
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              job={jobs.find(j => j.id === application.jobId)}
              onStatusChange={handleStatusChange}
              onAnalyzeMatch={handleAnalyzeMatch}
            />
          ))}
        </div>
      )}
    </div>
  )
}