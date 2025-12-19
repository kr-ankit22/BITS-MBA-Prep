
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIP_PATH = path.join(__dirname, '../SIP Questions.xlsx');

const analyzeSIP = () => {
    try {
        const workbook = XLSX.readFile(SIP_PATH);
        const sheetNames = workbook.SheetNames;

        console.log("Found Sheets (Companies):");
        console.log(sheetNames.join(", "));

        console.log("\n--- Sample Data Inspection ---");

        // Inspect first 3 sheets to get an idea of structure
        sheetNames.slice(0, 3).forEach(sheetName => {
            console.log(`\nSheet: ${sheetName}`);
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Array of arrays

            // Print header and first 2 rows
            if (data.length > 0) console.log("Header:", data[0]);
            if (data.length > 1) console.log("Row 1:", data[1]);
            if (data.length > 2) console.log("Row 2:", data[2]);
        });

    } catch (error) {
        console.error("Error reading SIP Questions.xlsx:", error);
    }
}

analyzeSIP();
