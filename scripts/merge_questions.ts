
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const V1_PATH = path.join(__dirname, '../questions_uploaded_v1.csv');
const HSBC_PATH = path.join(__dirname, '../hsbc_refined_questions.csv');
const OUT_PATH = path.join(__dirname, '../questions_uploaded_cleaned.csv');

const merge = () => {
    // Read V1
    const v1Content = fs.readFileSync(V1_PATH, 'utf-8').trim();
    // Read HSBC (skip header)
    const hsbcContent = fs.readFileSync(HSBC_PATH, 'utf-8').trim().split('\n').slice(1).join('\n');

    // Combine
    const finalContent = `${v1Content}\n${hsbcContent}`;

    fs.writeFileSync(OUT_PATH, finalContent);
    console.log(`Merged V1 (${v1Content.split('\n').length} lines) with refined HSBC data.`);
    console.log(`Created ${OUT_PATH} with ${finalContent.split('\n').length} lines.`);
};

merge();
