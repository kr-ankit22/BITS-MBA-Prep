
// scripts/test_logo_search.ts
import { LogoService } from '../services/logoService';

// Mock fetch for Node.js environment if needed, or rely on Node 18+ global fetch
// We'll assume the environment supports fetch or we might need a polyfill, 
// strictly speaking AdminPanel is client-side, but ts-node might need 'node-fetch' if old node.
// Let's try running it. If fetch is missing, we'll see.

const testParams = ['Raaz App', 'Guidewire', 'Noccarc Robotics', 'RandomNonExistentCompany123'];

const runTest = async () => {
    console.log("Testing LogoService Search...");

    for (const name of testParams) {
        console.log(`\nLooking up: "${name}"`);
        const url = await LogoService.getLogoUrl(name);
        console.log(`Result: ${url}`);

        // Check if it's using the Search result or Guess
        if (name === 'Raaz App' && url.includes('raazapp.com')) {
            console.log("✅ SUCCESS: Found raazapp.com via Search (or good guess)");
        } else if (name === 'Guidewire' && url.includes('guidewire.com')) {
            console.log("✅ SUCCESS: Found guidewire.com");
        }
    }
};

runTest();
