import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Brain, CheckCircle, AlertCircle } from 'lucide-react'
import { AIMatchResult } from '@/types'

interface AIMatchScoreProps {
  matchResult?: AIMatchResult
  isLoading?: boolean
}

export function AIMatchScore({ matchResult, isLoading }: AIMatchScoreProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brain className="h-4 w-4 text-primary animate-pulse" />
            AI Match Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="animate-pulse">
              <div className="h-2 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!matchResult) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brain className="h-4 w-4 text-gray-400" />
            AI Match Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No analysis available</p>
        </CardContent>
      </Card>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Brain className="h-4 w-4 text-primary" />
          AI Match Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Match Score</span>
            <Badge variant={getScoreBadgeVariant(matchResult.score)}>
              {matchResult.score}%
            </Badge>
          </div>
          <Progress value={matchResult.score} className="h-2" />
        </div>

        {/* Analysis */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Analysis</h4>
          <p className="text-sm text-gray-600">{matchResult.analysis}</p>
        </div>

        {/* Strengths */}
        {matchResult.strengths.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              Strengths
            </h4>
            <ul className="space-y-1">
              {matchResult.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-1">
                  <span className="text-green-600 mt-1">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Concerns */}
        {matchResult.concerns.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-yellow-600" />
              Areas of Concern
            </h4>
            <ul className="space-y-1">
              {matchResult.concerns.map((concern, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-1">
                  <span className="text-yellow-600 mt-1">•</span>
                  {concern}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}