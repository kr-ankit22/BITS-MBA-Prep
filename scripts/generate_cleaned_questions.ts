
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HEADER = "Company,Domain,Role,Topic,Difficulty,Question,Ideal_Approach,Asked_In_BITS";

const CLEANED_QUESTIONS = [
    {
        q: "What is the Inventory Turnover Ratio formula and how do you interpret it?",
        topic: "Finance",
        domain: "Finance",
        approach: "Explain formula (COGS / Avg Inventory) and implies efficiency of sales."
    },
    {
        q: "Explain the Cash Conversion Cycle formula and its interpretation.",
        topic: "Finance",
        domain: "Finance",
        approach: "Days Inventory Outstanding + Days Sales Outstanding - Days Payable Outstanding."
    },
    {
        q: "List the fundamental Principles of Accounting.",
        topic: "Finance",
        domain: "Finance",
        approach: "Mention accrual, consistency, prudence, going concern, entity concept."
    },
    {
        q: "Estimate the number of Two-Wheelers sold annually in India.",
        topic: "Guesstimate",
        domain: "Consulting",
        approach: "Population -> Target Segment -> Income Levels -> Replacement vs New Demand."
    },
    {
        q: "How do you measure the performance of a team or individual in banking operations context?",
        topic: "Behavioral",
        domain: "General",
        approach: "Mention KPIs like accuracy, turnaround time (TAT), customer satisfaction, and error rates."
    },
    {
        q: "What metrics indicate effective revenue generation for a bank?",
        topic: "Finance",
        domain: "Finance",
        approach: "NIM (Net Interest Margin), Fee-based income, Loan book growth, CASA ratio."
    },
    {
        q: "Explain the concept of 'Share of Wallet' in banking.",
        topic: "Product Management",
        domain: "Product",
        approach: "Percentage of a customer's total spend/assets held with us vs competitors."
    },
    {
        q: "What are the key products offered by HSBC?",
        topic: "General Awareness",
        domain: "General",
        approach: "Retail Banking, Wealth Management, Commercial Banking, Global Banking & Markets."
    },
    {
        q: "What is the difference between Market Risk and Credit Risk?",
        topic: "Finance",
        domain: "Finance",
        approach: "Market: Losses due to market factor movements. Credit: Default by counterparty."
    },
    {
        q: "Is AI a job creator or a job destroyer?",
        topic: "General Awareness",
        domain: "Analytics",
        approach: "Discuss automation vs augmentation, new roles created (ML Ops) vs redundant routine tasks."
    },
    {
        q: "Differentiate between Systematic and Unsystematic Risk.",
        topic: "Finance",
        domain: "Finance",
        approach: "Systematic: Market-wide (non-diversifiable). Unsystematic: Company-specific (diversifiable)."
    },
    {
        q: "Explain the concept of Binning in SQL.",
        topic: "SQL",
        domain: "Analytics",
        approach: "Using CASE statements to categorize continuous variables into groups."
    },
    {
        q: "How do you access the 5th row and 3rd column of a dataframe in Pandas?",
        topic: "Python",
        domain: "Analytics",
        approach: "df.iloc[4, 2]"
    },
    {
        q: "How do you append two dataframes in Python?",
        topic: "Python",
        domain: "Analytics",
        approach: "pd.concat([df1, df2]) or df1.append(df2) (deprecated)."
    },
    {
        q: "What happens to the columns if you join a dataframe with 5 columns and another with 7 columns?",
        topic: "Python",
        domain: "Analytics",
        approach: "Depends on join type, generally 5+7 = 12 columns if no overlap/suffix handling."
    },
    {
        q: "What are Derivatives in finance?",
        topic: "Finance",
        domain: "Finance",
        approach: "Contracts deriving value from underlying assets (Options, Futures, Swaps)."
    },
    {
        q: "Why is a Mutual Fund called 'Mutual'?",
        topic: "Finance",
        domain: "Finance",
        approach: "Pooled money from many investors mutually shared for returns/risks."
    }
];

const generateCSV = () => {
    const lines = [HEADER];

    CLEANED_QUESTIONS.forEach(item => {
        const row = [
            "HSBC", // Company
            item.domain, // Domain
            "Analyst", // Role
            item.topic, // Topic
            "Medium", // Difficulty
            `"${item.q.replace(/"/g, '""')}"`, // Question (Escape quotes)
            `"${item.approach.replace(/"/g, '""')}"`, // Ideal Approach
            "Yes" // Asked_in_BITS
        ];
        lines.push(row.join(","));
    });

    const outputPath = path.join(__dirname, '../hsbc_refined_questions.csv');
    fs.writeFileSync(outputPath, lines.join('\n'));
    console.log(`Successfully generated ${lines.length - 1} refined questions to ${outputPath}`);
};

generateCSV();
