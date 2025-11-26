
import { Company, Question, Topic, Difficulty, Resource } from './types';

export const COMPANIES: Company[] = [
  {
    id: 'c1',
    name: 'JPMorgan Chase',
    sector: 'Finance',
    logo: 'https://logo.clearbit.com/jpmorganchase.com',
    description: 'Leading global financial services firm offering solutions to the world\'s most important corporations, governments and institutions.',
    roles: ['Risk Analyst', 'Quant Associate', 'Data Scientist']
  },
  {
    id: 'c2',
    name: 'Accenture Strategy',
    sector: 'Consulting',
    logo: 'https://logo.clearbit.com/accenture.com',
    description: 'Provides strategy and management consulting services to help clients improve performance.',
    roles: ['Management Consultant', 'Strategy Analyst']
  },
  {
    id: 'c3',
    name: 'Amazon',
    sector: 'Tech',
    logo: 'https://logo.clearbit.com/amazon.com',
    description: 'E-commerce and cloud computing giant focusing on customer obsession and innovation.',
    roles: ['Program Manager', 'Business Analyst', 'Product Manager']
  },
  {
    id: 'c4',
    name: 'Credit Suisse',
    sector: 'Finance',
    logo: 'https://logo.clearbit.com/credit-suisse.com',
    description: 'Global wealth manager and investment bank with strong capabilities in investment banking.',
    roles: ['Investment Banking Analyst', 'Equity Research']
  }
];

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    companyId: 'c1',
    companyName: 'JPMorgan Chase',
    text: 'Explain the difference between bagging and boosting.',
    topic: Topic.Analytics,
    // category: 'Technical',
    difficulty: Difficulty.Medium,

    frequency: 5,
    idealApproach: 'Bagging (Bootstrap Aggregating) reduces variance by training models in parallel on random subsets (e.g., Random Forest). Boosting reduces bias by training models sequentially, where each new model focuses on errors from previous ones (e.g., XGBoost). Key distinction is parallel vs sequential.',
    askedInBITS: true,
    role: 'Data Scientist',
    domain: 'Finance'
  },
  {
    id: 'q2',
    companyId: 'c1',
    companyName: 'JPMorgan Chase',
    text: 'Write a SQL query to find the second highest salary from an Employee table.',
    topic: Topic.SQL,
    // category: 'Technical',
    difficulty: Difficulty.Easy,
    frequency: 8,
    idealApproach: 'SELECT MAX(Salary) FROM Employee WHERE Salary < (SELECT MAX(Salary) FROM Employee); OR using dense_rank(): SELECT * FROM (SELECT Salary, DENSE_RANK() OVER (ORDER BY Salary DESC) as rank FROM Employee) WHERE rank = 2;',
    askedInBITS: true,
    role: 'Quant Associate',
    domain: 'Finance'
  },
  {
    id: 'q3',
    companyId: 'c2',
    companyName: 'Accenture Strategy',
    text: 'How would you design a metric to measure user engagement for a streaming platform?',
    topic: Topic.Product,
    difficulty: Difficulty.Hard,

    frequency: 3,
    idealApproach: 'Guesstimate approach: 1. Define Population of Mumbai (~20M). 2. Households (Divide by 4 -> 5M). 3. Car Ownership Rate (Assume 10% -> 500k personal cars). 4. Add commercial cars (Ola/Uber/Taxis ~ 200k). Total ~700k. 5. Color Distribution (Red is rare, maybe 5-7%). Calculation: 700k * 0.05 = 35,000 red cars.',
    askedInBITS: true,
    role: 'Strategy Analyst',
    domain: 'Consulting'
  },
  {
    id: 'q4',
    companyId: 'c3',
    companyName: 'Amazon',
    text: 'Tell me about a time you failed and how you handled it.',
    topic: Topic.Behavioral,
    difficulty: Difficulty.Medium,
    frequency: 10,
    idealApproach: 'Use STAR format. Situation: Led a project with tight deadline. Task: Deliver feature X. Action: Underestimated complexity, missed deadline. Result: Project delayed. Learning: Implemented better estimation techniques and buffer time for future projects. Emphasize the learning and resilience.',
    askedInBITS: false,
    role: 'Program Manager',
    domain: 'Tech'
  },
  {
    id: 'q5',
    companyId: 'c4',
    companyName: 'Credit Suisse',
    text: 'What is the P/E ratio and why is it important?',
    topic: Topic.Finance,
    difficulty: Difficulty.Medium,
    frequency: 6,
    idealApproach: 'Price-to-Earnings ratio. Calculated as Market Value per Share / Earnings per Share (EPS). It indicates the dollar amount an investor can expect to invest in a company in order to receive one dollar of that company’s earnings. High P/E suggests growth expectations; low P/E suggests undervaluation or stability.',
    askedInBITS: true,
    role: 'Investment Banking Analyst',
    domain: 'Finance'
  }
];

export const RESOURCES: Resource[] = [
  {
    id: 'r1',
    title: 'Kaggle Learn - Python',
    url: 'https://www.kaggle.com/learn/python',
    description: 'Free interactive Python tutorials covering fundamentals with hands-on exercises. Ideal for data science beginners.',
    category: 'Python',
    source: 'Kaggle',
    duration: '5 hours'
  },
  {
    id: 'r2',
    title: 'Google Data Analytics Professional Certificate',
    url: 'https://grow.google/certificates/data-analytics/',
    description: 'Comprehensive program teaching R, SQL, Python, Tableau with hands-on projects. Industry-recognized certification.',
    category: 'Data Analytics',
    source: 'Coursera',
    duration: '6 months'
  },
  {
    id: 'r3',
    title: 'Python for Data Science - freeCodeCamp',
    url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
    description: 'Complete 7+ hour beginner-friendly course covering Python fundamentals, pandas, data manipulation, and visualization.',
    category: 'Python',
    source: 'YouTube',
    duration: '7 hours'
  },
  {
    id: 'r4',
    title: 'Mode Analytics SQL Tutorial',
    url: 'https://mode.com/sql-tutorial/',
    description: 'Comprehensive free SQL tutorial from basic to advanced covering SELECT, JOINs, aggregations, window functions.',
    category: 'SQL',
    source: 'Mode',
    duration: 'Self-paced'
  },
  {
    id: 'r5',
    title: 'Product School - Product Management',
    url: 'https://productschool.com/',
    description: 'Resources, books, and certifications for aspiring product managers.',
    category: 'Product',
    source: 'Product School',
    duration: 'Various'
  }
];

// --- Access Control Lists ---
// Replace these with actual emails when ready
export const ADMIN_EMAILS = [
  'admin@bits-pilani.ac.in',
  'placement@bits-pilani.ac.in',
  'test_admin_bits_prep@gmail.com' // For testing
];

export const FACULTY_EMAILS = [
  'h20240806@pilani.bits-pilani.ac.in', // Admin
  'faculty@bits-pilani.ac.in',
  'professor@bits-pilani.ac.in',
  'test_faculty@example.com' // For testing
];


