import { blink } from '@/blink/client'
import { Application, Job, AIMatchResult } from '@/types'

export async function analyzeApplicationMatch(
  application: Application, 
  job: Job
): Promise<AIMatchResult> {
  try {
    const prompt = `
You are an expert HR professional analyzing job applications. Please analyze how well this candidate matches the job requirements.

JOB DETAILS:
Title: ${job.title}
Company: ${job.company}
Type: ${job.type}
Location: ${job.location}

Job Description:
${job.description}

Job Requirements:
${job.requirements}

CANDIDATE APPLICATION:
Name: ${application.candidateName}
Email: ${application.candidateEmail}
${application.candidatePhone ? `Phone: ${application.candidatePhone}` : ''}

Cover Letter:
${application.coverLetter || 'No cover letter provided'}

Please provide:
1. A match score from 0-100 (where 100 is a perfect match)
2. A brief analysis explaining the score
3. Top 3 strengths that make this candidate suitable
4. Top 3 concerns or areas where the candidate may not be ideal

Format your response as JSON with this structure:
{
  "score": number,
  "analysis": "string",
  "strengths": ["string", "string", "string"],
  "concerns": ["string", "string", "string"]
}
`

    const { object } = await blink.ai.generateObject({
      prompt,
      schema: {
        type: 'object',
        properties: {
          score: { type: 'number', minimum: 0, maximum: 100 },
          analysis: { type: 'string' },
          strengths: {
            type: 'array',
            items: { type: 'string' },
            maxItems: 3
          },
          concerns: {
            type: 'array',
            items: { type: 'string' },
            maxItems: 3
          }
        },
        required: ['score', 'analysis', 'strengths', 'concerns']
      }
    })

    return {
      score: Math.round(object.score),
      analysis: object.analysis,
      strengths: object.strengths,
      concerns: object.concerns
    }
  } catch (error) {
    console.error('Error analyzing application match:', error)
    throw new Error('Failed to analyze application match')
  }
}

export async function batchAnalyzeApplications(
  applications: Application[],
  jobs: Job[]
): Promise<Map<string, AIMatchResult>> {
  const results = new Map<string, AIMatchResult>()
  
  for (const application of applications) {
    const job = jobs.find(j => j.id === application.jobId)
    if (job) {
      try {
        const result = await analyzeApplicationMatch(application, job)
        results.set(application.id, result)
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`Failed to analyze application ${application.id}:`, error)
      }
    }
  }
  
  return results
}