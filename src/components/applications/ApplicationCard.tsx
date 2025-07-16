import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Mail, 
  Phone, 
  FileText, 
  Eye, 
  Brain,
  Calendar,
  MapPin
} from 'lucide-react'
import { Application, Job } from '@/types'
import { AIMatchScore } from './AIMatchScore'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ApplicationCardProps {
  application: Application
  job?: Job
  onStatusChange?: (applicationId: string, status: Application['status']) => void
  onAnalyzeMatch?: (applicationId: string) => void
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-yellow-100 text-yellow-800',
  interview: 'bg-purple-100 text-purple-800',
  rejected: 'bg-red-100 text-red-800',
  hired: 'bg-green-100 text-green-800',
}

export function ApplicationCard({ 
  application, 
  job, 
  onStatusChange, 
  onAnalyzeMatch 
}: ApplicationCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyzeMatch = async () => {
    if (!onAnalyzeMatch) return
    setIsAnalyzing(true)
    await onAnalyzeMatch(application.id)
    setIsAnalyzing(false)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-white">
                  {getInitials(application.candidateName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {application.candidateName}
                </h3>
                <p className="text-sm text-gray-500">{job?.title}</p>
              </div>
            </div>
            <Badge className={statusColors[application.status]}>
              {application.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Contact Info */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              {application.candidateEmail}
            </div>
            {application.candidatePhone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {application.candidatePhone}
              </div>
            )}
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              Applied {new Date(application.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* AI Match Score */}
          {application.aiMatchScore && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">AI Match Score</span>
              </div>
              <Badge variant={application.aiMatchScore >= 80 ? 'default' : 
                             application.aiMatchScore >= 60 ? 'secondary' : 'destructive'}>
                {application.aiMatchScore}%
              </Badge>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDetails(true)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            
            {application.resumeUrl && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(application.resumeUrl, '_blank')}
              >
                <FileText className="h-4 w-4 mr-1" />
                Resume
              </Button>
            )}

            {!application.aiMatchScore && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAnalyzeMatch}
                disabled={isAnalyzing}
              >
                <Brain className="h-4 w-4 mr-1" />
                {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-white">
                  {getInitials(application.candidateName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div>{application.candidateName}</div>
                <div className="text-sm font-normal text-gray-500">
                  Application for {job?.title}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {application.candidateEmail}
                </div>
                {application.candidatePhone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {application.candidatePhone}
                  </div>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            {application.coverLetter && (
              <div>
                <h3 className="font-semibold mb-3">Cover Letter</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {application.coverLetter}
                  </p>
                </div>
              </div>
            )}

            {/* AI Match Analysis */}
            {application.aiMatchScore && application.aiMatchAnalysis && (
              <AIMatchScore 
                matchResult={(() => {
                  try {
                    const parsed = JSON.parse(application.aiMatchAnalysis)
                    return {
                      score: application.aiMatchScore,
                      analysis: parsed.analysis || application.aiMatchAnalysis,
                      strengths: parsed.strengths || [],
                      concerns: parsed.concerns || []
                    }
                  } catch {
                    return {
                      score: application.aiMatchScore,
                      analysis: application.aiMatchAnalysis,
                      strengths: [],
                      concerns: []
                    }
                  }
                })()}
              />
            )}

            {/* Status Actions */}
            <div>
              <h3 className="font-semibold mb-3">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {(['new', 'reviewing', 'interview', 'rejected', 'hired'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={application.status === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onStatusChange?.(application.id, status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}