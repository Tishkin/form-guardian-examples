#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function openBrowser() {
  // Wait a bit for Next.js to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    await execAsync('xdg-open http://localhost:3005');
  } catch (error) {
    // Fallback to other methods
    try {
      await execAsync('open http://localhost:3005');
    } catch (e) {
      console.log('Could not open browser automatically. Please open http://localhost:3005 manually.');
    }
  }
}

openBrowser();

