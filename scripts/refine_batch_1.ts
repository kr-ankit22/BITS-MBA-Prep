
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_PATH = path.join(__dirname, '../refined_batch_1.csv');

// Manually cleaned questions based on analysis of unique_raw_data.json
const REFINED_QUESTIONS = [
    // Abbott
    {
        Company: "Abbott",
        Domain: "Finance",
        Role: "Analyst",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a challenging project and how you overcame obstacles.",
        Ideal_Approach: "Use structured thinking approach (STAR method). Connect to business value. Show MBA-level strategic understanding and professional communication skills. Quantify impact where possible.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Abbott",
        Domain: "Healthcare",
        Role: "Data Automation, Data Science Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "How do you handle working with cross-functional teams?",
        Ideal_Approach: "Use structured thinking approach. Connect to business value. Show MBA-level strategic understanding and professional communication skills. Quantify impact where possible.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Abbott",
        Domain: "Healthcare",
        Role: "Data Automation, Data Science Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about a time you used data to solve a business problem.",
        Ideal_Approach: "Use structured thinking approach. Focus on the data-driven decision-making process and the resulting business impact.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Abbott",
        Domain: "Healthcare",
        Role: "Data Automation, Data Science Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about yourself.",
        Ideal_Approach: "Focus on professional background relevant to the role, highlighting key achievements and skills.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Abbott",
        Domain: "Healthcare",
        Role: "Data Automation, Data Science Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Walk me through your resume, focusing on analytics or data-driven projects.",
        Ideal_Approach: "Highlight key analytics projects, tools used, and the business impact of your work.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Abbott",
        Domain: "Healthcare",
        Role: "Data Automation, Data Science Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What are your long-term career goals in analytics?",
        Ideal_Approach: "Align your personal career goals with the company's trajectory and the evolving field of analytics.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Abbott",
        Domain: "Healthcare",
        Role: "Data Automation, Data Science Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What motivates you to work in the analytics field?",
        Ideal_Approach: "Discuss your passion for data capability to solve complex problems and drive decision-making.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Abbott",
        Domain: "Healthcare",
        Role: "Data Automation, Data Science Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why MBA?",
        Ideal_Approach: "Connect your technical background with business acumen and leadership aspirations.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Abbott",
        Domain: "Healthcare",
        Role: "Data Automation, Data Science Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why are you interested in our company and this role?",
        Ideal_Approach: "Demonstrate research about Abbott and how your skills align with the specific role requirements.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Abbott",
        Domain: "Healthcare",
        Role: "Data Automation, Data Science Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why did you choose Business Analytics as your specialization?",
        Ideal_Approach: "Explain the intersection of your interest in business strategy and data analysis skills.",
        Asked_In_BITS: "Yes"
    },

    // Aditya Birla Management Corp.
    {
        Company: "Aditya Birla Management Corp.",
        Domain: "Healthcare",
        Role: "Data Automation, Data Science Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a challenging project and how you overcame obstacles.",
        Ideal_Approach: "Use STAR method. Highlight problem-solving skills and resilience.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Aditya Birla Management Corp.",
        Domain: "Corporate Strategy",
        Role: "Data Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "How do you handle working with cross-functional teams?",
        Ideal_Approach: "Emphasize communication, collaboration, and ability to bridge technical and non-technical gaps.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Aditya Birla Management Corp.",
        Domain: "Corporate Strategy",
        Role: "Data Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about a time you used data to solve a business problem.",
        Ideal_Approach: "Provide a specific example where data analysis directly led to a solution or improvement.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Aditya Birla Management Corp.",
        Domain: "Corporate Strategy",
        Role: "Data Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about yourself.",
        Ideal_Approach: "Short professional summary known as 'elevator pitch'.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Aditya Birla Management Corp.",
        Domain: "Corporate Strategy",
        Role: "Data Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Walk me through your resume, focusing on analytics or data-driven projects.",
        Ideal_Approach: "Detail your role, tools used, and the outcomes of the projects mentioned.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Aditya Birla Management Corp.",
        Domain: "Corporate Strategy",
        Role: "Data Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What are your long-term career goals in analytics?",
        Ideal_Approach: "Discuss aspirations for leadership or specialized expertise in analytics.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Aditya Birla Management Corp.",
        Domain: "Corporate Strategy",
        Role: "Data Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What motivates you to work in the analytics field?",
        Ideal_Approach: "Express enthusiasm for discovering insights and influencing strategy through data.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Aditya Birla Management Corp.",
        Domain: "Corporate Strategy",
        Role: "Data Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why MBA?",
        Ideal_Approach: "Explain how an MBA complements your technical skills and prepares you for management.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Aditya Birla Management Corp.",
        Domain: "Corporate Strategy",
        Role: "Data Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why are you interested in our company and this role?",
        Ideal_Approach: "Show knowledge of ABG's diverse portfolio and strategic initiatives.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Aditya Birla Management Corp.",
        Domain: "Corporate Strategy",
        Role: "Data Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why did you choose Business Analytics as your specialization?",
        Ideal_Approach: "Highlight the growing importance of data in decision making.",
        Asked_In_BITS: "Yes"
    },

    // EY
    {
        Company: "EY",
        Domain: "Corporate Strategy",
        Role: "Data Analytics Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a challenging project and how you overcame obstacles.",
        Ideal_Approach: "Use STAR method. Focus on your specific contribution and the positive outcome.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "EY",
        Domain: "Consulting",
        Role: "Digital Risk, Tech Assurance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "How do you handle working with cross-functional teams?",
        Ideal_Approach: "Discuss adaptability, clear communication, and goal alignment.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "EY",
        Domain: "Consulting",
        Role: "Digital Risk, Tech Assurance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about a time you used data to solve a business problem.",
        Ideal_Approach: "Give a concrete example of data-driven problem solving.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "EY",
        Domain: "Consulting",
        Role: "Digital Risk, Tech Assurance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about yourself.",
        Ideal_Approach: "Summarize your education, experience, and key skills relevant to consulting.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "EY",
        Domain: "Consulting",
        Role: "Digital Risk, Tech Assurance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Walk me through your resume, focusing on analytics or data-driven projects.",
        Ideal_Approach: "Explain the 'why' and 'how' of your projects, not just the 'what'.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "EY",
        Domain: "Consulting",
        Role: "Digital Risk, Tech Assurance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What are your long-term career goals in analytics?",
        Ideal_Approach: "Discuss growth into senior consultant or manager roles.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "EY",
        Domain: "Consulting",
        Role: "Digital Risk, Tech Assurance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What motivates you to work in the analytics field?",
        Ideal_Approach: "Focus on the intellectual challenge and impact of analytics.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "EY",
        Domain: "Consulting",
        Role: "Digital Risk, Tech Assurance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why MBA?",
        Ideal_Approach: "Explain the need for business context to better apply technical skills.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "EY",
        Domain: "Consulting",
        Role: "Digital Risk, Tech Assurance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why are you interested in our company and this role?",
        Ideal_Approach: "Mention EY's reputation, culture, and specific service lines.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "EY",
        Domain: "Consulting",
        Role: "Digital Risk, Tech Assurance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Why did you choose Business Analytics as your specialization?",
        Ideal_Approach: "Connect personal strengths with market demand for analytics professionals.",
        Asked_In_BITS: "Yes"
    },

    // Accenture AIOC
    {
        Company: "Accenture AIOC",
        Domain: "Telecommunications",
        Role: "Marketing Analytics",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What is the coefficient of determination (R-squared)?",
        Ideal_Approach: "It shows how well independent variables explain the variation in the dependent variable; value ranges from 0 to 1 (higher = better fit).",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Accenture AIOC",
        Domain: "Marketing Analytics",
        Role: "Data Science Sr Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What is an F-test?",
        Ideal_Approach: "It checks if the regression model is statistically significant; i.e., if at least one predictor meaningfully explains the dependent variable.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Accenture AIOC",
        Domain: "Marketing Analytics",
        Role: "Data Science Sr Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What is Monte Carlo simulation?",
        Ideal_Approach: "A technique that uses random sampling and repeated computations to estimate probabilities or outcomes of uncertain events.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Accenture AIOC",
        Domain: "Marketing Analytics",
        Role: "Data Science Sr Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What are precision and recall?",
        Ideal_Approach: "Precision = Correct Positives / Total Predicted Positives. Recall = Correct Positives / Total Actual Positives. Precision is about accuracy, recall is about completeness.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Accenture AIOC",
        Domain: "Marketing Analytics",
        Role: "Data Science Sr Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What are window functions in SQL?",
        Ideal_Approach: "SQL functions that perform calculations across a set of related table rows (e.g., running totals, ranks, moving averages).",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Accenture AIOC",
        Domain: "Marketing Analytics",
        Role: "Data Science Sr Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What is imbalanced data?",
        Ideal_Approach: "A situation where classes or labels are not equally represented (e.g., 95% Negative, 5% Positive).",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Accenture AIOC",
        Domain: "Marketing Analytics",
        Role: "Data Science Sr Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "Why does imbalanced data matter?",
        Ideal_Approach: "High accuracy can hide poor detection of the minority (often more important) class, making the model useless for rare but critical targets.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Accenture AIOC",
        Domain: "Marketing Analytics",
        Role: "Data Science Sr Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "How do you tackle imbalanced data?",
        Ideal_Approach: "Techniques include oversampling (e.g., SMOTE), undersampling, or using specific loss functions.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Accenture AIOC",
        Domain: "Marketing Analytics",
        Role: "Data Science Sr Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "How many types of joins are there in SQL and what is an inner join?",
        Ideal_Approach: "Common joins: Inner, Left, Right, Full Outer, Cross. Inner join returns only matching rows present in both tables.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Accenture AIOC",
        Domain: "Marketing Analytics",
        Role: "Data Science Sr Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What is the use of SUMIFS in Excel?",
        Ideal_Approach: "It adds numbers in a range based on multiple specific criteria or conditions.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Accenture AIOC",
        Domain: "Marketing Analytics",
        Role: "Data Science Sr Analyst",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What is the difference between ARIMA and SARIMA?",
        Ideal_Approach: "ARIMA is for non-seasonal data; SARIMA adds support for seasonality (fixed repeating patterns like monthly or quarterly).",
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
