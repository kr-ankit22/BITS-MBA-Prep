
import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIP_PATH = path.join(__dirname, '../SIP Questions.xlsx');
const OUT_PATH = path.join(__dirname, '../sip_raw_data.json');

const extractSIP = () => {
    try {
        const workbook = XLSX.readFile(SIP_PATH);
        const allData: Record<string, any[]> = {};

        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            // Get raw rows
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            allData[sheetName] = data;
        });

        fs.writeFileSync(OUT_PATH, JSON.stringify(allData, null, 2));
        console.log(`Extracted SIP data to ${OUT_PATH}`);

    } catch (error) {
        console.error("Error extracting SIP data:", error);
    }
}

extractSIP();
