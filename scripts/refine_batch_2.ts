
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_PATH = path.join(__dirname, '../refined_batch_2.csv');

// Manually cleaned questions for Batch 2
const REFINED_QUESTIONS = [
    // Guidewire Software
    {
        Company: "Guidewire Software",
        Domain: "Consulting",
        Role: "Digital Risk, Tech Assurance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a challenging project and how you overcame obstacles.",
        Ideal_Approach: "Use STAR method. Highlight technical challenges and collaborative solutions.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Guidewire Software",
        Domain: "InsurTech",
        Role: "Product Manager Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "How do you handle working with cross-functional teams?",
        Ideal_Approach: "Focus on communication across engineering, design, and business units.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Guidewire Software",
        Domain: "InsurTech",
        Role: "Product Manager Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about a time you used data to solve a business problem.",
        Ideal_Approach: "Showcase decision-making based on metrics and user data.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Guidewire Software",
        Domain: "InsurTech",
        Role: "Product Manager Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about yourself.",
        Ideal_Approach: "Professional introduction tailored to product management and tech.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Guidewire Software",
        Domain: "InsurTech",
        Role: "Product Manager Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Walk me through your resume, focusing on analytics or data-driven projects.",
        Ideal_Approach: "Highlight projects involving product metrics, SQL, or user behavior analysis.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Guidewire Software",
        Domain: "InsurTech",
        Role: "Product Manager Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What are your long-term career goals in analytics?",
        Ideal_Approach: "Connect interest in data with product leadership aspirations.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Guidewire Software",
        Domain: "InsurTech",
        Role: "Product Manager Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What motivates you to work in the analytics field?",
        Ideal_Approach: "Discuss the power of data to reveal insights and drive product strategy.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Guidewire Software",
        Domain: "InsurTech",
        Role: "Product Manager Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why MBA?",
        Ideal_Approach: "Explain the desire to bridge technical skills with business strategy.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Guidewire Software",
        Domain: "InsurTech",
        Role: "Product Manager Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why are you interested in our company and this role?",
        Ideal_Approach: "Mention Guidewire's position in the P&C insurance industry and software leadership.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Guidewire Software",
        Domain: "InsurTech",
        Role: "Product Manager Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why did you choose Business Analytics as your specialization?",
        Ideal_Approach: "Express interest in making informed, data-backed business decisions.",
        Asked_In_BITS: "Yes"
    },

    // IDFC First Bank
    {
        Company: "IDFC First Bank",
        Domain: "InsurTech",
        Role: "Product Manager Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a challenging project and how you overcame obstacles.",
        Ideal_Approach: "Use STAR method. Focus on financial or tech-related challenges if possible.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "IDFC First Bank",
        Domain: "Financial Services",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "How do you handle working with cross-functional teams?",
        Ideal_Approach: "Demonstrate ability to work with diverse stakeholders in a banking context.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "IDFC First Bank",
        Domain: "Financial Services",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about a time you used data to solve a business problem.",
        Ideal_Approach: "Provide an example involving market data, customer segmentation, or financial analysis.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "IDFC First Bank",
        Domain: "Financial Services",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about yourself.",
        Ideal_Approach: "Brief summary of education and experience relevant to banking and analytics.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "IDFC First Bank",
        Domain: "Financial Services",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Walk me through your resume, focusing on analytics or data-driven projects.",
        Ideal_Approach: "Highlight analytical rigor and results in previous projects.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "IDFC First Bank",
        Domain: "Financial Services",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What are your long-term career goals in analytics?",
        Ideal_Approach: "Discuss aspirations within the fintech or banking analytics verify.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "IDFC First Bank",
        Domain: "Financial Services",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What motivates you to work in the analytics field?",
        Ideal_Approach: "Focus on the impact of analytics on financial products and customer experience.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "IDFC First Bank",
        Domain: "Financial Services",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why MBA?",
        Ideal_Approach: "Explain the need for holistic business understanding in the financial sector.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "IDFC First Bank",
        Domain: "Financial Services",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why are you interested in our company and this role?",
        Ideal_Approach: "Research IDFC First Bank's digital-first approach and culture.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "IDFC First Bank",
        Domain: "Financial Services",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why did you choose Business Analytics as your specialization?",
        Ideal_Approach: "Link analytics to the future of banking and personalized financial services.",
        Asked_In_BITS: "Yes"
    },

    // Indian Bank
    {
        Company: "Indian Bank",
        Domain: "Financial Services",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a challenging project and how you overcame obstacles.",
        Ideal_Approach: "STAR method. Emphasize perseverance and problem-solving.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Indian Bank",
        Domain: "Financial Services",
        Role: "Financial Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "How do you handle working with cross-functional teams?",
        Ideal_Approach: "Focus on collaboration in a structured, potentially hierarchical environment.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Indian Bank",
        Domain: "Financial Services",
        Role: "Financial Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about a time you used data to solve a business problem.",
        Ideal_Approach: "Example should ideally relate to finance, efficiency, or reporting.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Indian Bank",
        Domain: "Financial Services",
        Role: "Financial Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about yourself.",
        Ideal_Approach: "Concise professional introduction.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Indian Bank",
        Domain: "Financial Services",
        Role: "Financial Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Walk me through your resume, focusing on analytics or data-driven projects.",
        Ideal_Approach: "Explain projects clearly, focusing on your specific contributions.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Indian Bank",
        Domain: "Financial Services",
        Role: "Financial Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What are your long-term career goals in analytics?",
        Ideal_Approach: "Discuss a future in financial data analysis or management.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Indian Bank",
        Domain: "Financial Services",
        Role: "Financial Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What motivates you to work in the analytics field?",
        Ideal_Approach: "Mention accuracy, finding truth in numbers, and optimizing performance.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Indian Bank",
        Domain: "Financial Services",
        Role: "Financial Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why MBA?",
        Ideal_Approach: "To gain broadly applicable business skills and accelerate career growth.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Indian Bank",
        Domain: "Financial Services",
        Role: "Financial Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why are you interested in our company and this role?",
        Ideal_Approach: "Show interest in the public sector banking space and its scale.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Indian Bank",
        Domain: "Financial Services",
        Role: "Financial Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why did you choose Business Analytics as your specialization?",
        Ideal_Approach: "To apply modern analytical techniques to traditional banking problems.",
        Asked_In_BITS: "Yes"
    },

    // Kyoren Labs
    {
        Company: "Kyoren Labs",
        Domain: "Financial Services",
        Role: "Financial Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a challenging project and how you overcame obstacles.",
        Ideal_Approach: "STAR method. Highlight innovation and technical challenges.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Kyoren Labs",
        Domain: "Healthcare",
        Role: "Business Analyst Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "How do you handle working with cross-functional teams?",
        Ideal_Approach: "Focus on agility and working with developers/stakeholders.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Kyoren Labs",
        Domain: "Healthcare",
        Role: "Business Analyst Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about a time you used data to solve a business problem.",
        Ideal_Approach: "Example can be from healthcare, finance, or any complex domain.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Kyoren Labs",
        Domain: "Healthcare",
        Role: "Business Analyst Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about yourself.",
        Ideal_Approach: "Tailor the introduction to a startup/agile environment.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Kyoren Labs",
        Domain: "Healthcare",
        Role: "Business Analyst Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Walk me through your resume, focusing on analytics or data-driven projects.",
        Ideal_Approach: "Focus on hard skills and tangible outputs.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Kyoren Labs",
        Domain: "Healthcare",
        Role: "Business Analyst Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What are your long-term career goals in analytics?",
        Ideal_Approach: "Discuss becoming an expert in data products or strategy.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Kyoren Labs",
        Domain: "Healthcare",
        Role: "Business Analyst Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What motivates you to work in the analytics field?",
        Ideal_Approach: "Passion for problem-solving and finding patterns.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Kyoren Labs",
        Domain: "Healthcare",
        Role: "Business Analyst Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why MBA?",
        Ideal_Approach: "To understand the business side of technology.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Kyoren Labs",
        Domain: "Healthcare",
        Role: "Business Analyst Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why are you interested in our company and this role?",
        Ideal_Approach: "Research what Kyoren Labs does and express genuine interest.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Kyoren Labs",
        Domain: "Healthcare",
        Role: "Business Analyst Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why did you choose Business Analytics as your specialization?",
        Ideal_Approach: "To leverage data for smarter business decisions.",
        Asked_In_BITS: "Yes"
    },

    // LenDen Club
    {
        Company: "LenDen Club",
        Domain: "Healthcare",
        Role: "Business Analyst Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a challenging project and how you overcame obstacles.",
        Ideal_Approach: "STAR method. Emphasize analytical problem-solving.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "LenDen Club",
        Domain: "FinTech",
        Role: "Data Science Intern, Marketing Intern, Product Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "How do you handle working with cross-functional teams?",
        Ideal_Approach: "Focus on collaboration in a fast-paced fintech environment.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "LenDen Club",
        Domain: "FinTech",
        Role: "Data Science Intern, Marketing Intern, Product Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about a time you used data to solve a business problem.",
        Ideal_Approach: "Provide a strong example of data influencing a key decision.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "LenDen Club",
        Domain: "FinTech",
        Role: "Data Science Intern, Marketing Intern, Product Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about yourself.",
        Ideal_Approach: "Pitch yourself as a data-savvy business student.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "LenDen Club",
        Domain: "FinTech",
        Role: "Data Science Intern, Marketing Intern, Product Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Walk me through your resume, focusing on analytics or data-driven projects.",
        Ideal_Approach: "Deep dive into one or two key projects.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "LenDen Club",
        Domain: "FinTech",
        Role: "Data Science Intern, Marketing Intern, Product Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What are your long-term career goals in analytics?",
        Ideal_Approach: "Align with the growth of fintech and data science.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "LenDen Club",
        Domain: "FinTech",
        Role: "Data Science Intern, Marketing Intern, Product Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What motivates you to work in the analytics field?",
        Ideal_Approach: "The opportunity to drive innovation and efficiency.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "LenDen Club",
        Domain: "FinTech",
        Role: "Data Science Intern, Marketing Intern, Product Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why MBA?",
        Ideal_Approach: "To gain strategic vision alongside technical skills.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "LenDen Club",
        Domain: "FinTech",
        Role: "Data Science Intern, Marketing Intern, Product Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why are you interested in our company and this role?",
        Ideal_Approach: "Discuss LenDen Club's peer-to-peer lending model and growth.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "LenDen Club",
        Domain: "FinTech",
        Role: "Data Science Intern, Marketing Intern, Product Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why did you choose Business Analytics as your specialization?",
        Ideal_Approach: "To be at the forefront of financial technology innovation.",
        Asked_In_BITS: "Yes"
    }
];

const generateCSV = () => {
    const HEADER = "Company,Domain,Role,Topic,Difficulty,Question,Ideal_Approach,Asked_In_BITS";
    const rows = REFINED_QUESTIONS.map(item => {
        return [
            item.Company,
            item.Domain,
            item.Role,
            item.Topic,
            item.Difficulty,
            `"${item.Question.replace(/"/g, '""')}"`,
            `"${item.Ideal_Approach.replace(/"/g, '""')}"`,
            item.Asked_In_BITS
        ].join(",");
    });

    const content = [HEADER, ...rows].join("\n");
    fs.writeFileSync(OUT_PATH, content);
    console.log(`Created ${OUT_PATH} with ${rows.length} refined questions.`);
}

generateCSV();
