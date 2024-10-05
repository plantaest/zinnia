// Ref: https://formatjs.io/docs/guides/advanced-usage#pre-compiling-messages
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const inputDir = 'src/locales';
const tempDir = 'temp-locales';

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const files = fs.readdirSync(inputDir).filter((file) => file.endsWith('.json'));

files.forEach((file) => {
  const inputFilePath = path.join(inputDir, file);
  const messages = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8'));

  delete messages['@metadata'];

  const formattedMessages = {};
  Object.keys(messages).forEach((key) => {
    formattedMessages[key] = {
      defaultMessage: messages[key],
    };
  });

  const outputFilePath = path.join(tempDir, file);
  fs.writeFileSync(outputFilePath, JSON.stringify(formattedMessages, null, 2));

  console.log(`Formatted JSON has been written to ${outputFilePath}`);
});

execSync(`pnpm compile --ast ${tempDir} ${inputDir}/ast`, { stdio: 'inherit' });

fs.rmSync(tempDir, { recursive: true, force: true });
console.log(`Temporary directory ${tempDir} has been removed.`);
