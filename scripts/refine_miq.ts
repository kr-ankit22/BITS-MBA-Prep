
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '../data_files/final_questions_bank.csv');

// Config
const TARGET_COMPANY = 'MiQ';

// Curated High-Quality Questions for MiQ
// Derived from analyzing the raw 200+ entries which covered:
// - Python (Dictionaries, coding)
// - SQL (Window functions)
// - Statistics (Variance, Multicollinearity)
// - Logical/Cognitive (Odd one out)
const NEW_MIQ_QUESTIONS = [
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Python",
        Difficulty: "Medium",
        Question: "Write a Python function to manipulate a dictionary (e.g., merging two dictionaries or sorting by value).",
        Ideal_Approach: "Demonstrate knowledge of dictionary methods (.items(), .get()) and comprehensions.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Python",
        Difficulty: "Easy",
        Question: "What is the difference between 5/2 and 5//2 in Python?",
        Ideal_Approach: "Explain float division (2.5) vs integer/floor division (2).",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "SQL",
        Difficulty: "Medium",
        Question: "Explain and demonstrate the use of Window Functions in SQL (e.g., RANK vs DENSE_RANK).",
        Ideal_Approach: "Provide a query example using OVER() clause to solve a ranking or running total problem.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "SQL",
        Difficulty: "Hard",
        Question: "Write a SQL query to find top 3 performing campaigns per region.",
        Ideal_Approach: "Use CTE with RANK() PARTITION BY region ORDER BY performance DESC.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Statistics",
        Difficulty: "Medium",
        Question: "How do you calculate Variance? What does it signify in a dataset?",
        Ideal_Approach: "Explain variance as the average squared deviation from the mean, indicating data spread.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Statistics",
        Difficulty: "Medium",
        Question: "What is Multicollinearity and how does it affect a regression model?",
        Ideal_Approach: "It occurs when independent variables are highly correlated. It makes coefficient estimates unstable. Fix by checking VIF (Variance Inflation Factor).",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a time you had to write code to automate a manual process.",
        Ideal_Approach: "STAR method. Focus on the tool used (Python/SQL), time saved, and error reduction.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Logical Reasoning: Find the odd man out from a given series.",
        Ideal_Approach: "Pattern recognition. Explain the logic clearly.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Data Science",
        Difficulty: "Medium",
        Question: "How would you handle missing data in a marketing dataset?",
        Ideal_Approach: "Check mechanism (MCAR/MAR/MNAR). Impute (mean/median/KNN) or drop based on business context.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Product",
        Difficulty: "Hard",
        Question: "Guesstimate: Estimate the annual iPhone sales in China.",
        Ideal_Approach: "Top-down approach: Population -> Target Segment (Income/Age) -> Smartphone Penetration -> iOS Market Share -> Replacement Cycle.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Product",
        Difficulty: "Medium",
        Question: "Product Case: How would you improve the engagement of a music streaming app?",
        Ideal_Approach: "Clarify goal -> User Segments -> Pain Points -> Solutions (Social features, Curated playlists) -> Metrics (DAU, Time Spent).",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Walk me through your resume. Why MiQ?",
        Ideal_Approach: "Connect past analytics projects to MiQ's programmatic advertising focus.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Describe a situation where you had a conflict with a team member.",
        Ideal_Approach: "Focus on professional disagreement, listening to their side, and finding a data-driven resolution.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What are your strengths and weaknesses?",
        Ideal_Approach: "Strength: Analytical rigor / Visual storytelling. Weakness: Public speaking (but working on it).",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Statistics",
        Difficulty: "Easy",
        Question: "Explain P-value to a non-technical stakeholder.",
        Ideal_Approach: "Probability of seeing these results just by random chance. Low p-value (<0.05) means 'unlikely to be a fluke'.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "SQL",
        Difficulty: "Medium",
        Question: "Write a SQL query to find the second highest salary in each department.",
        Ideal_Approach: "Use DENSE_RANK() OVER(PARTITION BY dept ORDER BY salary DESC) = 2.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "MiQ",
        Domain: "Marketing Analytics",
        Role: "Senior Analyst",
        Topic: "Python",
        Difficulty: "Medium",
        Question: "How do you reverse a string in Python without using built-in functions?",
        Ideal_Approach: "Use slicing [::-1] or a loop. Explain complexity.",
        Asked_In_BITS: "Yes"
    }
];

const refineMiQ = () => {
    if (!fs.existsSync(CSV_PATH)) {
        console.error(`File not found: ${CSV_PATH}`);
        return;
    }

    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const rows = fileContent.split('\n');
    const header = rows[0];

    // Filter out existing MiQ rows
    const nonMiQRows = rows.slice(1).filter(row => {
        const columns = row.split(','); // Basic split, assumes no commas in first column (Company Name)
        // Better CSV parsing might be needed if company name has commas, but MiQ doesn't.
        const company = columns[0]?.replace(/"/g, '').trim();
        return company !== TARGET_COMPANY && row.trim().length > 0;
    });

    console.log(`Original rows: ${rows.length}`);
    console.log(`Rows after removing ${TARGET_COMPANY}: ${nonMiQRows.length}`);

    // Create new CSV content
    const newMiQRows = NEW_MIQ_QUESTIONS.map(q => {
        return [
            q.Company,
            q.Domain,
            q.Role,
            q.Topic,
            q.Difficulty,
            `"${q.Question.replace(/"/g, '""')}"`,
            `"${q.Ideal_Approach.replace(/"/g, '""')}"`,
            q.Asked_In_BITS
        ].join(',');
    });

    const newContent = [header, ...nonMiQRows, ...newMiQRows].join('\n');
    fs.writeFileSync(CSV_PATH, newContent);
    console.log(`Successfully updated ${CSV_PATH}. Added ${newMiQRows.length} refined MiQ questions.`);
};

refineMiQ();
