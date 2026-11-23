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
  
  let count = 0;
  for await (const line of rl) {
    count++;
    console.log(`\nLine ${count}:`);
    try {
      const obj = JSON.parse(line);
      console.log(`Source: ${obj.source}, Type: ${obj.type}`);
      if (obj.content) console.log(`Content: ${String(obj.content).substring(0, 300)}`);
      if (obj.tool_calls) console.log(`Tool Calls: ${JSON.stringify(obj.tool_calls).substring(0, 300)}`);
      if (obj.tool_name) console.log(`Tool Name: ${obj.tool_name}, Action: ${obj.tool_action}`);
    } catch {
      console.log(line.substring(0, 300));
    }
  }
}

run();
