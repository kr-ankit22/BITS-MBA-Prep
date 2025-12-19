
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_PATH = path.join(__dirname, '../refined_batch_final.csv');

// Cleaned questions for remaining companies
const REFINED_QUESTIONS = [
    // Liquidmind.ai
    {
        Company: "Liquidmind.ai",
        Domain: "FinTech",
        Role: "Data Science Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a challenging project and how you overcame obstacles.",
        Ideal_Approach: "Use STAR method. Highlight innovation in fintech.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Liquidmind.ai",
        Domain: "FinTech",
        Role: "Data Science Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "How do you handle working with cross-functional teams?",
        Ideal_Approach: "Focus on bridging the gap between tech and business teams.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Liquidmind.ai",
        Domain: "FinTech",
        Role: "Data Science Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about yourself.",
        Ideal_Approach: "Introduction highlighting SaaS and product experience.",
        Asked_In_BITS: "Yes"
    },

    // Moody's Analytics
    {
        Company: "Moody's Analytics",
        Domain: "Financial Services",
        Role: "Structured Finance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a challenging project and how you overcame obstacles.",
        Ideal_Approach: "STAR method. Highlight financial modeling or data integrity challenges.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Moody's Analytics",
        Domain: "Financial Services",
        Role: "Structured Finance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why are you interested in our company and this role?",
        Ideal_Approach: "Mention Moody's dominance in credit ratings and analytics software.",
        Asked_In_BITS: "Yes"
    },

    // Noccarc Robotics
    {
        Company: "Noccarc Robotics",
        Domain: "MedTech",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why did you choose Business Analytics as your specialization?",
        Ideal_Approach: "To bring data rigor to market research and strategy in critical industries.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Noccarc Robotics",
        Domain: "MedTech",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a challenging project and how you overcame obstacles.",
        Ideal_Approach: "STAR method. Highlight adaptability and research challenges.",
        Asked_In_BITS: "Yes"
    },

    // Raaz App
    {
        Company: "Raaz App",
        Domain: "Technology",
        Role: "Business Analyst",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about yourself.",
        Ideal_Approach: "Short professional intro focusing on app dynamics and analytics.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Raaz App",
        Domain: "Technology",
        Role: "Business Analyst",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "How do you prioritize features for a mobile app?",
        Ideal_Approach: "RICE framework (Reach, Impact, Confidence, Effort) or MoSCoW method.",
        Asked_In_BITS: "Yes"
    },

    // Reliance Industries - AJIO
    {
        Company: "Reliance Industries - AJIO",
        Domain: "E-Commerce",
        Role: "Supply Chain Analyst",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a time you optimized a process.",
        Ideal_Approach: "Focus on efficiency, cost reduction, or time saving in a logistics/supply chain context.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Reliance Industries - AJIO",
        Domain: "E-Commerce",
        Role: "Supply Chain Analyst",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "How do you handle pressure during peak seasons?",
        Ideal_Approach: "Planning, prioritization, and maintaining calm under high demand.",
        Asked_In_BITS: "Yes"
    },

    // Sodexo
    {
        Company: "Sodexo",
        Domain: "Services",
        Role: "Operations Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why Sodexo?",
        Ideal_Approach: "Focus on their Quality of Life services and global scale.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Sodexo",
        Domain: "Services",
        Role: "Operations Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a situation where you had to deal with a difficult client.",
        Ideal_Approach: "Empathy, active listening, and finding a win-win solution.",
        Asked_In_BITS: "Yes"
    },

    // Taurus Mutual Funds
    {
        Company: "Taurus Mutual Funds",
        Domain: "Finance",
        Role: "Equity Research Intern",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What factors do you consider before investing in a stock?",
        Ideal_Approach: "Fundamental analysis (P/E ratio, debt, management) and macroeconomic factors.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Taurus Mutual Funds",
        Domain: "Finance",
        Role: "Equity Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about a time you made a mistake in your analysis.",
        Ideal_Approach: "Admit the mistake, explain how you fixed it, and what you learned to prevent recurrence.",
        Asked_In_BITS: "Yes"
    },

    // Vodafone-Idea
    {
        Company: "Vodafone-Idea",
        Domain: "Telecom",
        Role: "Data Analyst",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "How do you explain complex technical concepts to non-technical stakeholders?",
        Ideal_Approach: "Use analogies, avoid jargon, and focus on business impact.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Vodafone-Idea",
        Domain: "Telecom",
        Role: "Data Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What is Churn Rate and why is it important in Telecom?",
        Ideal_Approach: "Churn = % of customers leaving. Critical because acquiring new customers is costlier than retaining existing ones.",
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
