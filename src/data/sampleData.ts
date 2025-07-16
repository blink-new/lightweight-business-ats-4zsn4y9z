import { Job, Application } from '@/types'

export const sampleJobs: Omit<Job, 'userId'>[] = [
  {
    id: 'job_1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'full-time',
    description: `We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining our web applications using modern JavaScript frameworks.

Key Responsibilities:
- Develop and maintain responsive web applications
- Collaborate with designers and backend developers
- Write clean, maintainable code
- Participate in code reviews and technical discussions
- Mentor junior developers`,
    requirements: `Required Skills:
- 5+ years of experience with React.js
- Strong knowledge of TypeScript
- Experience with modern CSS frameworks (Tailwind CSS preferred)
- Proficiency in Git and version control
- Experience with REST APIs and GraphQL
- Understanding of web performance optimization
- Bachelor's degree in Computer Science or equivalent experience

Preferred Skills:
- Experience with Next.js
- Knowledge of testing frameworks (Jest, Cypress)
- Familiarity with cloud platforms (AWS, Vercel)
- Experience with design systems`,
    salaryMin: 120000,
    salaryMax: 180000,
    status: 'active',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 'job_2',
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'Remote',
    type: 'full-time',
    description: `Join our dynamic startup as a Product Manager and help shape the future of our innovative SaaS platform. You'll work closely with engineering, design, and business teams to deliver exceptional user experiences.

Key Responsibilities:
- Define product strategy and roadmap
- Gather and prioritize product requirements
- Work with engineering teams to deliver features
- Analyze user feedback and market trends
- Coordinate product launches and go-to-market strategies`,
    requirements: `Required Skills:
- 3+ years of product management experience
- Experience with SaaS products
- Strong analytical and problem-solving skills
- Excellent communication and leadership abilities
- Experience with product management tools (Jira, Figma, etc.)
- Understanding of agile development methodologies
- Bachelor's degree in Business, Engineering, or related field

Preferred Skills:
- Experience in B2B SaaS
- Technical background or CS degree
- Experience with user research and data analysis
- Knowledge of UX/UI principles`,
    salaryMin: 90000,
    salaryMax: 140000,
    status: 'active',
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString()
  }
]

export const sampleApplications: Omit<Application, 'userId'>[] = [
  {
    id: 'app_1',
    jobId: 'job_1',
    candidateName: 'Sarah Johnson',
    candidateEmail: 'sarah.johnson@email.com',
    candidatePhone: '+1 (555) 123-4567',
    coverLetter: `Dear Hiring Manager,

I am excited to apply for the Senior Frontend Developer position at TechCorp Inc. With over 6 years of experience in React development and a passion for creating exceptional user experiences, I believe I would be a valuable addition to your team.

In my current role at WebSolutions LLC, I have:
- Led the development of a complex dashboard application using React, TypeScript, and Tailwind CSS
- Improved application performance by 40% through code optimization and lazy loading
- Mentored 3 junior developers and established coding standards for the team
- Collaborated closely with UX designers to implement pixel-perfect designs

I am particularly drawn to TechCorp's commitment to innovation and would love to contribute to your mission of building cutting-edge web applications. My experience with modern frontend technologies and my ability to work in fast-paced environments make me well-suited for this role.

I would welcome the opportunity to discuss how my skills and experience can contribute to your team's success.

Best regards,
Sarah Johnson`,
    status: 'new',
    createdAt: new Date('2024-01-22').toISOString(),
    updatedAt: new Date('2024-01-22').toISOString()
  },
  {
    id: 'app_2',
    jobId: 'job_1',
    candidateName: 'Michael Chen',
    candidateEmail: 'michael.chen@email.com',
    candidatePhone: '+1 (555) 987-6543',
    coverLetter: `Hello,

I'm interested in the Frontend Developer position. I have 2 years of experience with JavaScript and have worked on a few React projects. I'm a quick learner and eager to grow my skills.

I've built some personal projects using HTML, CSS, and JavaScript. I'm familiar with Git and have used Bootstrap for styling. I think this would be a great opportunity for me to advance my career.

Looking forward to hearing from you.

Thanks,
Michael Chen`,
    status: 'new',
    createdAt: new Date('2024-01-23').toISOString(),
    updatedAt: new Date('2024-01-23').toISOString()
  },
  {
    id: 'app_3',
    jobId: 'job_2',
    candidateName: 'Emily Rodriguez',
    candidateEmail: 'emily.rodriguez@email.com',
    candidatePhone: '+1 (555) 456-7890',
    coverLetter: `Dear StartupXYZ Team,

I am writing to express my strong interest in the Product Manager position. With 4 years of product management experience in the SaaS industry and a track record of successful product launches, I am excited about the opportunity to contribute to your innovative platform.

My experience includes:
- Managing the product roadmap for a B2B analytics platform with 10,000+ users
- Leading cross-functional teams of 8-12 people including engineers, designers, and marketers
- Conducting user research and A/B testing to drive product decisions
- Successfully launched 3 major features that increased user engagement by 35%
- Experience with Jira, Figma, Mixpanel, and other product management tools

I am particularly excited about StartupXYZ's mission and the opportunity to work in a fast-paced startup environment. My combination of technical understanding (I have a CS background) and business acumen would allow me to effectively bridge the gap between technical and business teams.

I would love to discuss how my experience can help drive StartupXYZ's product success.

Best regards,
Emily Rodriguez`,
    status: 'reviewing',
    createdAt: new Date('2024-01-21').toISOString(),
    updatedAt: new Date('2024-01-24').toISOString()
  },
  {
    id: 'app_4',
    jobId: 'job_2',
    candidateName: 'David Kim',
    candidateEmail: 'david.kim@email.com',
    coverLetter: `Hi there,

I saw your Product Manager job posting and wanted to apply. I have some experience in project management and think I could transition into product management.

I've managed a few small projects at my current company and have good communication skills. I'm interested in learning more about product management and think your company would be a good place to start.

I'm available for an interview anytime.

Thanks,
David Kim`,
    status: 'new',
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString()
  }
]