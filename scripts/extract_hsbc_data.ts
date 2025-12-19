
import * as XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import path from 'path';

// For ESM compat
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function extractExcel() {
    const filePath = path.join(__dirname, '../HSBC Questions.xlsx');

    try {
        const workbook = readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = utils.sheet_to_json(sheet);
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error reading xlsx:", error);
    }
}

extractExcel();
