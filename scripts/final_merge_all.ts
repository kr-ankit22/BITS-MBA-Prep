
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const V1_PATH = path.join(__dirname, '../questions_uploaded_v1.csv');
const HSBC_PATH = path.join(__dirname, '../hsbc_refined_questions.csv');
const BATCH_1_PATH = path.join(__dirname, '../refined_batch_1.csv');
const BATCH_2_PATH = path.join(__dirname, '../refined_batch_2.csv');
const BATCH_FINAL_PATH = path.join(__dirname, '../refined_batch_final.csv');
const SIP_PATH = path.join(__dirname, '../refined_sip_enriched.csv');

const OUT_PATH = path.join(__dirname, '../final_questions_bank.csv');

const readCSV = (filePath: string) => {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    const lines = content.split('\n');
    // Skip header and parse lines loosely
    return lines.slice(1).filter(l => l.trim().length > 0);
};

const mergeAll = () => {
    console.log("Starting final merge...");

    // 1. Read all sources
    const v1Lines = readCSV(V1_PATH);
    const hsbcLines = readCSV(HSBC_PATH);
    const batch1Lines = readCSV(BATCH_1_PATH);
    const batch2Lines = readCSV(BATCH_2_PATH);
    const batchFinalLines = readCSV(BATCH_FINAL_PATH);
    const sipLines = readCSV(SIP_PATH);

    const questionsByCompany: Record<string, string[]> = {};

    // Helper to add lines to map
    const addToMap = (lines: string[], sourceName: string) => {
        lines.forEach(line => {
            if (!line) return;
            const parts = line.split(',');
            if (parts.length === 0) return;
            const company = parts[0].trim();
            if (!questionsByCompany[company]) {
                questionsByCompany[company] = [];
            }
            questionsByCompany[company].push(line);
        });
        console.log(`Added ${lines.length} lines from ${sourceName}`);
    };

    // 2. Add Generic Batches First
    addToMap(hsbcLines, "HSBC Refined");
    addToMap(batch1Lines, "Batch 1");
    addToMap(batch2Lines, "Batch 2");
    addToMap(batchFinalLines, "Batch Final");

    // 3. Handle MiQ (Keep from V1)
    // Filter V1 for MiQ only, as others are refined
    const miqLines = v1Lines.filter(l => l.startsWith("MiQ"));
    addToMap(miqLines, "V1 (MiQ Only)");

    // 4. SIP Enrichment (Priority)
    // For companies in SIP, we REPLACE the generic entries to ensure high quality
    // Companies: Abbott, LenDen Club, Mitigata, Tata Capital, Kyoren Labs, EY
    const sipCompanies = new Set();
    sipLines.forEach(line => {
        const company = line.split(',')[0].trim();
        sipCompanies.add(company);
    });

    console.log("Enriching/Replacing data for:", Array.from(sipCompanies));

    sipLines.forEach(line => {
        const company = line.split(',')[0].trim();
        // If this is the FIRST time we see this company in SIP loop, clear its generic entries
        // We use a separate tracker for 'cleared' to avoid clearing multiple times
        if (questionsByCompany[company] && !questionsByCompany[company].includes("CLEARED_FOR_SIP")) {
            // Actually, simplest way: Just overwrite the array if it exists with empty, then push
            // But we need to do it once.
            // Let's just reset it right now iterating sipCompanies.
        }
    });

    // Explicit reset for SIP companies
    sipCompanies.forEach(c => {
        if (questionsByCompany[c as string]) {
            console.log(`Replaced generic questions for ${c} with SIP data.`);
            questionsByCompany[c as string] = [];
        }
    });

    // Now add SIP lines
    addToMap(sipLines, "SIP Enriched");
    console.log("SIP data merged.");

    // 5. Generate Output
    const HEADER = "Company,Domain,Role,Topic,Difficulty,Question,Ideal_Approach,Asked_In_BITS";
    let finalContent = HEADER + "\n";

    console.log("Applying blacklist...");

    // Blacklist companies as per user request
    const BLACKLIST = [
        "Reliance Industries - AJIO",
        "IDFC First Bank",
        "Indian Bank",
        "Liquidmind.ai"
    ];

    BLACKLIST.forEach(c => {
        if (questionsByCompany[c]) {
            console.log(`Removing blacklisted company: ${c}`);
            delete questionsByCompany[c];
        }
    });

    // Sort companies alphabetically for neatness
    const sortedCompanies = Object.keys(questionsByCompany).sort();

    let totalQuestions = 0;
    sortedCompanies.forEach(company => {
        const questions = questionsByCompany[company];
        // Deduplicate simplistic duplicates if any (exact match)
        const uniqueQuestions = [...new Set(questions)];
        finalContent += uniqueQuestions.join("\n") + "\n";
        totalQuestions += uniqueQuestions.length;
    });

    fs.writeFileSync(OUT_PATH, finalContent.trim());
    console.log(`\nSuccessfully created ${OUT_PATH}`);
    console.log(`Total Companies: ${sortedCompanies.length}`);
    console.log(`Total Questions: ${totalQuestions}`);
};

mergeAll();
