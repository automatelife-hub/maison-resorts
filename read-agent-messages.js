import fs from 'fs';
import readline from 'readline';

async function run() {
  const logPath = `C:\\Users\\Neste\\.gemini\\antigravity\\brain\\24a1373f-69a3-4453-a352-7d0b3c50bde0\\.system_generated\\logs\\transcript.jsonl`;
  if (!fs.existsSync(logPath)) {
    console.log('File not found!');
    return;
  }
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    if (line.includes('send_message') || line.includes('Recipient')) {
      console.log(`\n--- Line ${lineCount} ---`);
      try {
        const obj = JSON.parse(line);
        console.log(JSON.stringify(obj, null, 2).substring(0, 1000));
      } catch {
        console.log(line.substring(0, 500));
      }
    }
  }
  console.log(`\nProcessed ${lineCount} lines.`);
}

run();
