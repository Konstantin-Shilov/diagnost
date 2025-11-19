/**
 * Font Generator Script for jsPDF
 *
 * This script helps convert TTF fonts to base64 for use with jsPDF
 *
 * Steps to use:
 * 1. Download Roboto-Regular.ttf from Google Fonts
 * 2. Place it in this directory (scripts/)
 * 3. Run: node scripts/generate-font.js
 * 4. The output will be saved to src/core/services/fonts/roboto-base64.ts
 *
 * Alternative: Use online converter at:
 * https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fontPath = path.join(__dirname, 'Roboto-Regular.ttf');
const outputPath = path.join(__dirname, '../src/core/services/fonts/roboto-base64.ts');

if (!fs.existsSync(fontPath)) {
  console.error('Error: Roboto-Regular.ttf not found in scripts/ directory');
  console.log('\nPlease download Roboto font:');
  console.log('1. Visit: https://fonts.google.com/specimen/Roboto');
  console.log('2. Download the font family');
  console.log('3. Extract Roboto-Regular.ttf to scripts/ directory');
  console.log('4. Run this script again');
  process.exit(1);
}

try {
  const fontBuffer = fs.readFileSync(fontPath);
  const base64Font = fontBuffer.toString('base64');

  const output = `// Auto-generated Roboto Regular font for jsPDF with Cyrillic support
// Generated on ${new Date().toISOString()}

export const robotoRegularBase64 = "${base64Font}";

export const robotoFontName = "Roboto-Regular";
`;

  fs.writeFileSync(outputPath, output, 'utf-8');

  console.log('✓ Font successfully converted to base64');
  console.log(`✓ Output saved to: ${outputPath}`);
  console.log(`✓ Font size: ${(base64Font.length / 1024).toFixed(2)} KB (base64)`);
} catch (error) {
  console.error('Error converting font:', error.message);
  process.exit(1);
}