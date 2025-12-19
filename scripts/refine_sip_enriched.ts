
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_PATH = path.join(__dirname, '../refined_sip_enriched.csv');

// Manually cleaned and enriched questions from SIP Raw Data
const SIP_QUESTIONS = [
    // Lenden Club (Enriched)
    {
        Company: "LenDen Club",
        Domain: "Product Management",
        Role: "Product Intern",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What are the top 3 features of your most used app, and what improvements would you suggest?",
        Ideal_Approach: "Product Critique Framework: Define the app, user persona, and goal. Analyze features (pros/cons). Suggest metric-driven improvements.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "LenDen Club",
        Domain: "Product Management",
        Role: "Product Intern",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "Identify potential users for this app (apart from you) and how you would solve their problems.",
        Ideal_Approach: "User Segmentation: Demographic/Psychographic. Pain point analysis. Solutioning with feature mapping.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "LenDen Club",
        Domain: "Product Management",
        Role: "Product Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What do you think a Product Manager's day-to-day looks like?",
        Ideal_Approach: "Mention mix of: Standups, Stakeholder communication (Eng/Design), Data analysis, User research, and Documentation (PRDs).",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "LenDen Club",
        Domain: "Digital Marketing",
        Role: "Marketing Intern",
        Topic: "Technical",
        Difficulty: "Easy",
        Question: "What is a backlink?",
        Ideal_Approach: "A link from one website to another. Crucial for SEO authority and ranking.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "LenDen Club",
        Domain: "Digital Marketing",
        Role: "Marketing Intern",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What is SEO and what are some popular tools?",
        Ideal_Approach: "SEO: Optimizing visibility. Tools: SEMrush, Ahrefs, Google Search Console, Moz.",
        Asked_In_BITS: "Yes"
    },

    // Abbott (Enriched)
    {
        Company: "Abbott",
        Domain: "Healthcare Analytics",
        Role: "Data Science Intern",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "Scenario: You have a list of doctor names and addresses in Excel. How do you validate if the addresses are correct?",
        Ideal_Approach: "Use Google Maps API or medical registry databases for validation. Automate with PythonScript/Pandas or Excel VBA.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Abbott",
        Domain: "Healthcare Analytics",
        Role: "Data Science Intern",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "How would you automate updating data from Excel to a PowerPoint presentation on a monthly basis?",
        Ideal_Approach: "Use Python libraries like `python-pptx` and `pandas`, or VBA macros to link Excel ranges to PowerPoint slides.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Abbott",
        Domain: "Healthcare Analytics",
        Role: "Data Science Intern",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "How do you handle missing values in a dataset?",
        Ideal_Approach: "Imputation (Mean/Median/Mode), KNN imputation, deleting rows (if insignificant), or predicting values using regression.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Abbott",
        Domain: "Healthcare Analytics",
        Role: "Data Science Intern",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "Compare two datasets using Pandas.",
        Ideal_Approach: "Use `df.compare()`, `df.equals()`, or merge/join with indicator=True to find diffs.",
        Asked_In_BITS: "Yes"
    },

    // Mitigata (Enriched)
    {
        Company: "Mitigata",
        Domain: "InsurTech",
        Role: "Founder's Office Intern",
        Topic: "Strategy",
        Difficulty: "Hard",
        Question: "Design a Go-To-Market (GTM) strategy for a new domain/product.",
        Ideal_Approach: "Target Audience -> Value Proposition -> Channels (Sales/Marketing) -> Pricing -> Launch Timeline -> Metrics (KPIs).",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Mitigata",
        Domain: "InsurTech",
        Role: "Founder's Office Intern",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "What do you understand by the responsibilities of a Founder's Office role?",
        Ideal_Approach: "Cross-functional execution, strategic initiatives, special projects, and being a force multiplier for the founders.",
        Asked_In_BITS: "Yes"
    },

    // Tata Capital (Enriched)
    {
        Company: "Tata Capital",
        Domain: "Financial Services",
        Role: "Financial Analytics",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "Explain SLR (Simple Linear Regression) and Multi-collinearity.",
        Ideal_Approach: "SLR: Relation between one dependent and independent variable. Multi-collinearity: When independent variables are highly correlated, skewing results (check VIF).",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Tata Capital",
        Domain: "Financial Services",
        Role: "Financial Analytics",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What are the different types of SQL joins? Explain their significance.",
        Ideal_Approach: "Inner (matching), Left (all left + matching right), Right (all right + matching left), Full (all), Cross (Cartesian). crucial for combining data tables.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Tata Capital",
        Domain: "Financial Services",
        Role: "Financial Analytics",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What is the difference between an NBFC and a Bank?",
        Ideal_Approach: "NBFCs cannot accept demand deposits (checks) and are not part of payment settlement system. Banks are more regulated under Banking Regulation Act.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Tata Capital",
        Domain: "Financial Services",
        Role: "Financial Analytics",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "Scenario: Identify the top 5 customers who have the maximum debit in a transaction dataset.",
        Ideal_Approach: "SQL: `SELECT customer_id, SUM(debit_amount) FROM transactions GROUP BY customer_id ORDER BY SUM(debit_amount) DESC LIMIT 5;`",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Tata Capital",
        Domain: "Financial Services",
        Role: "Financial Analytics",
        Topic: "Technical",
        Difficulty: "Medium",
        Question: "What is Interest Discount?",
        Ideal_Approach: "Reduction in interest rate offered to preferred customers or during promotions to increase loan uptake.",
        Asked_In_BITS: "Yes"
    },

    // Kyoren Labs (Enriched)
    {
        Company: "Kyoren Labs",
        Domain: "Healthcare",
        Role: "Business Analyst",
        Topic: "Strategy",
        Difficulty: "Medium",
        Question: "Situation: How would you approach a new product launch from a data collection and strategy standpoint?",
        Ideal_Approach: "Define KPIs -> Identify Data Sources (Primary/Secondary) -> Set up Tracking (Google Analytics/Mixpanel) -> Feedback Loop strategy.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "Kyoren Labs",
        Domain: "Healthcare",
        Role: "Business Analyst",
        Topic: "Strategy",
        Difficulty: "Medium",
        Question: "Develop a pricing strategy for new skin care products using industry analysis.",
        Ideal_Approach: "Competitor Price Benchmarking -> Cost-Plus vs Value-Based Pricing -> Psychology of pricing (premium vs mass market).",
        Asked_In_BITS: "Yes"
    },

    // EY (Enriched)
    {
        Company: "EY",
        Domain: "Consulting",
        Role: "Tech Assurance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "Tell me about a situation at work for which you got appreciation.",
        Ideal_Approach: "STAR method. Focus on going above and beyond, or solving a critical/time-sensitive problem.",
        Asked_In_BITS: "Yes"
    },
    {
        Company: "EY",
        Domain: "Consulting",
        Role: "Tech Assurance",
        Topic: "Behavioral",
        Difficulty: "Medium",
        Question: "How did you handle conflicts/timeline delays during your projects?",
        Ideal_Approach: "Proactive communication, renegotiating scope/deadlines, allocating extra resources, and keeping stakeholders informed.",
        Asked_In_BITS: "Yes"
    }
];

const generateCSV = () => {
    const HEADER = "Company,Domain,Role,Topic,Difficulty,Question,Ideal_Approach,Asked_In_BITS";
    const rows = SIP_QUESTIONS.map(item => {
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
    console.log(`Created ${OUT_PATH} with ${rows.length} enriched questions.`);
}

generateCSV();
