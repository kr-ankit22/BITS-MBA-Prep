
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '../questions_uploaded_v1.csv');

interface Question {
    Company: string;
    Domain: string;
    Role: string;
    Topic: string;
    Difficulty: string;
    Question: string;
    Ideal_Approach: string;
    Asked_In_BITS: string;
}

const analyze = () => {
    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = content.split('\n');
    const questions: Record<string, string[]> = {};
    const fullData: Record<string, Question[]> = {};

    lines.slice(1).forEach(line => {
        // Rudimentary CSV parse (splitting by comma, but respecting quotes is hard without lib)
        // We will assume "Company" is the first col.
        // Actually, this simple split is dangerous if questions have commas.
        // We will use a regex to match CSV.

        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        // This is flaky. I'll use a safer approach:
        // Use a simple state machine or just use the lines since I just need the text.

        // Let's use string manipulation assuming standard CSV "val","val",...

        const firstComma = line.indexOf(',');
        if (firstComma === -1) return;

        const company = line.substring(0, firstComma).trim();

        // Let's just find the Question column. It is the 6th column (index 5).
        // Company, Domain, Role, Topic, Difficulty, Question, ...
        // We can't robustly parse without a lib.
        // I will use `npm install csv-parse`? 
        // Or I can just trust the `line` if I'm displaying it.

        if (!questions[company]) questions[company] = [];
        questions[company].push(line);
    });

    const output: Record<string, string[]> = {};

    Object.keys(questions).forEach(company => {
        const unique = [...new Set(questions[company])];
        output[company] = unique;
    });

    fs.writeFileSync(path.join(__dirname, '../unique_raw_data.json'), JSON.stringify(output, null, 2));
    console.log("Analysis complete. Check unique_raw_data.json");
}

analyze();
