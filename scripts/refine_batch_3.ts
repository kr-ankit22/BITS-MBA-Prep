
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_PATH = path.join(__dirname, '../refined_batch_3.csv');

// Manually cleaned questions for Batch 3
const REFINED_QUESTIONS = [
    // Liquidmind.ai
    {
        Company: "Liquidmind.ai",
        Domain: "FinTech",
        Role: "Data Science Intern, Marketing Intern, Product Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a challenging project and how you overcame obstacles.",
        Ideal_Approach: "Use STAR method. Highlight innovation in fintech.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Liquidmind.ai",
        Domain: "Technology / SaaS",
        Role: "Product Management Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "How do you handle working with cross-functional teams?",
        Ideal_Approach: "Focus on bridging the gap between tech and business teams.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Liquidmind.ai",
        Domain: "Technology / SaaS",
        Role: "Product Management Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about a time you used data to solve a business problem.",
        Ideal_Approach: "Demonstrate data-driven product decision making.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Liquidmind.ai",
        Domain: "Technology / SaaS",
        Role: "Product Management Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about yourself.",
        Ideal_Approach: "Introduction highlighting SaaS and product experience.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Liquidmind.ai",
        Domain: "Technology / SaaS",
        Role: "Product Management Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Walk me through your resume, focusing on analytics or data-driven projects.",
        Ideal_Approach: "Detail specific metrics and outcomes of your projects.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Liquidmind.ai",
        Domain: "Technology / SaaS",
        Role: "Product Management Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What are your long-term career goals in analytics?",
        Ideal_Approach: "Align with becoming a data-driven product leader.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Liquidmind.ai",
        Domain: "Technology / SaaS",
        Role: "Product Management Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What motivates you to work in the analytics field?",
        Ideal_Approach: "Passion for actionable insights and systematic problem solving.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Liquidmind.ai",
        Domain: "Technology / SaaS",
        Role: "Product Management Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why MBA?",
        Ideal_Approach: "To gain strategic perspective on product and market fit.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Liquidmind.ai",
        Domain: "Technology / SaaS",
        Role: "Product Management Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why are you interested in our company and this role?",
        Ideal_Approach: "Show interest in Liquidmind's specific AI/ML applications.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Liquidmind.ai",
        Domain: "Technology / SaaS",
        Role: "Product Management Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why did you choose Business Analytics as your specialization?",
        Ideal_Approach: "To master the tools that drive modern tech businesses.",
        Asked_In_BITS: "Yes"
    },

    // MiQ (Extensive list, selecting unique and high-quality ones)
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "Ola's business is stagnating. How would you revive it?",
        Ideal_Approach: "Use a structured framework (e.g., SWOT, 4Ps). Analyze market data, competitor landscape, and customer feedback to suggest targeted strategies.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "Write a SQL query to find the customer name and the time of their first purchase.",
        Ideal_Approach: "Use window functions like RANK() or ROW_NUMBER() partitioned by customer and ordered by date, then select the top rank.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "Difference between NumPy and Pandas?",
        Ideal_Approach: "NumPy is for numerical computations (arrays/matrices). Pandas is for structured data manipulation (DataFrames/Series) and handling real-world data issues.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "How do you evaluate model performance?",
        Ideal_Approach: "Discuss metrics relevant to the problem type: Accuracy, Precision, Recall, F1-Score (classification) or RMSE, MAE (regression). Mention Confusion Matrix.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "Explain ARIMA, SARIMA, GARCH models.",
        Ideal_Approach: "ARIMA: Stationary data. SARIMA: Seasonal data. GARCH: Volatility modeling (e.g., financial markets).",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "Guesstimate: Estimate the number of iPhones sold in China.",
        Ideal_Approach: "Top-down approach: Total Population -> Urban/Rural -> Smartphone Users -> iOS Market Share -> Replacement Cycle.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What is the difference between list and tuple in Python?",
        Ideal_Approach: "Lists are mutable (can change). Tuples are immutable (cannot change). Tuples are faster and memory efficient.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "Explain K-Means clustering and how to decide the number of clusters.",
        Ideal_Approach: "It's an unsupervised algorithm grouping data points. Number of clusters (K) is decided using the Elbow Method (looking for the bend in the WCSS curve).",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What is the difference between mean, median, and mode?",
        Ideal_Approach: "Mean: Average. Median: Middle value. Mode: Most frequent. discuss impact of outliers on Mean vs Median.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Technical",
        Difficulty: "Hard",
        Question: "Find the odd ball out of 8 balls where one is heavier. Minimum weighings?",
        Ideal_Approach: "Answer is 2 weighings. (Weigh 3 vs 3. If equal, weigh remaining 2. If unequal, take heavier group of 3, weigh 1 vs 1).",
        Asked_In_BITS: "Yes"
    },

    // Mitigata
    {
        Company: "Mitigata",
        Domain: "Technology / SaaS",
        Role: "Product Management Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a challenging project and how you overcame obstacles.",
        Ideal_Approach: "STAR method. Focus on product launch or feature challenges.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Mitigata",
        Domain: "InsurTech",
        Role: "Founder's Office Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "How do you handle working with cross-functional teams?",
        Ideal_Approach: "Discuss working with founders, tech, and sales.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Mitigata",
        Domain: "InsurTech",
        Role: "Founder's Office Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about a time you used data to solve a business problem.",
        Ideal_Approach: "Example of data guiding a strategic pivot or decision.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Mitigata",
        Domain: "InsurTech",
        Role: "Founder's Office Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about yourself.",
        Ideal_Approach: "Entrepreneurial and analytical introduction.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Mitigata",
        Domain: "InsurTech",
        Role: "Founder's Office Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Walk me through your resume, focusing on analytics or data-driven projects.",
        Ideal_Approach: "Focus on impact, user growth, or efficiency metrics.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Mitigata",
        Domain: "InsurTech",
        Role: "Founder's Office Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What are your long-term career goals in analytics?",
        Ideal_Approach: "Discuss leadership in tech-first insurance or risk management.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Mitigata",
        Domain: "InsurTech",
        Role: "Founder's Office Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What motivates you to work in the analytics field?",
        Ideal_Approach: "Desire to bring transparency and efficiency to insurance.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Mitigata",
        Domain: "InsurTech",
        Role: "Founder's Office Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why MBA?",
        Ideal_Approach: "To gain the business toolkit to scale startups.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Mitigata",
        Domain: "InsurTech",
        Role: "Founder's Office Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why are you interested in our company and this role?",
        Ideal_Approach: "Show passion for Mitigata's mission in cyber risk/insurance.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Mitigata",
        Domain: "InsurTech",
        Role: "Founder's Office Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why did you choose Business Analytics as your specialization?",
        Ideal_Approach: "To apply data to quantify risk and optimize products.",
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
        Question: "How do you handle working with cross-functional teams?",
        Ideal_Approach: "Collaboration with analysts, researchers, and tech teams.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Moody's Analytics",
        Domain: "Financial Services",
        Role: "Structured Finance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about a time you used data to solve a business problem.",
        Ideal_Approach: "Example of using data to assess credit risk or market trends.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Moody's Analytics",
        Domain: "Financial Services",
        Role: "Structured Finance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about yourself.",
        Ideal_Approach: "Focus on finance, risk, and data analysis background.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Moody's Analytics",
        Domain: "Financial Services",
        Role: "Structured Finance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Walk me through your resume, focusing on analytics or data-driven projects.",
        Ideal_Approach: "Detail complex quantitative projects.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Moody's Analytics",
        Domain: "Financial Services",
        Role: "Structured Finance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What are your long-term career goals in analytics?",
        Ideal_Approach: "Aspirations in financial risk analytics or structured finance.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Moody's Analytics",
        Domain: "Financial Services",
        Role: "Structured Finance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What motivates you to work in the analytics field?",
        Ideal_Approach: "The intellectual challenge of quantifying financial certainty.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Moody's Analytics",
        Domain: "Financial Services",
        Role: "Structured Finance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why MBA?",
        Ideal_Approach: "To broaden understanding of global financial markets.",
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
    {
        Company: "Moody's Analytics",
        Domain: "Financial Services",
        Role: "Structured Finance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why did you choose Business Analytics as your specialization?",
        Ideal_Approach: "To master the technical skills required for modern finance.",
        Asked_In_BITS: "Yes"
    },

    // Noccarc Robotics
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
    {
        Company: "Noccarc Robotics",
        Domain: "MedTech",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "How do you handle working with cross-functional teams?",
        Ideal_Approach: "Working with engineers and medical professionals.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Noccarc Robotics",
        Domain: "MedTech",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about a time you used data to solve a business problem.",
        Ideal_Approach: "Example of market sizing or customer needs analysis.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Noccarc Robotics",
        Domain: "MedTech",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about yourself.",
        Ideal_Approach: "Introduction tailored to medtech/startups.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Noccarc Robotics",
        Domain: "MedTech",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Walk me through your resume, focusing on analytics or data-driven projects.",
        Ideal_Approach: "Highlight analytical approach to unstructured problems.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Noccarc Robotics",
        Domain: "MedTech",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What are your long-term career goals in analytics?",
        Ideal_Approach: "Growth in high-tech manufacturing or healthcare analytics.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Noccarc Robotics",
        Domain: "MedTech",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What motivates you to work in the analytics field?",
        Ideal_Approach: "Driving impactful decisions in critical industries like healthcare.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Noccarc Robotics",
        Domain: "MedTech",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why MBA?",
        Ideal_Approach: "To commercialize technical innovations effectively.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Noccarc Robotics",
        Domain: "MedTech",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why are you interested in our company and this role?",
        Ideal_Approach: "Show admiration for Noccarc's pivotal role during COVID and beyond.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Noccarc Robotics",
        Domain: "MedTech",
        Role: "Market Research Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why did you choose Business Analytics as your specialization?",
        Ideal_Approach: "To bring data rigor to market research and strategy.",
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
