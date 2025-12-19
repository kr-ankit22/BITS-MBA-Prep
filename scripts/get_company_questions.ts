
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx'; // Just in case, but we parse CSV text here for speed

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '../questions_uploaded_v1.csv');

const getQuestions = (targetCompany: string) => {
    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = content.split('\n');
    const headers = lines[0].split(',');

    // Simple CSV parser (handling quotes roughly, or just searching line by line)
    // Since we just need to see the data to clean it, raw lines are fine.

    console.log(`Questions for ${targetCompany}:`);
    console.log("---------------------------------------------------");

    let count = 0;
    lines.slice(1).forEach(line => {
        if (line.includes(targetCompany)) {
            console.log(line);
            count++;
        }
    });
    console.log("---------------------------------------------------");
    console.log(`Total: ${count}`);
}

const company = process.argv[2];
if (!company) {
    console.log("Please provide company name");
} else {
    getQuestions(company);
}
