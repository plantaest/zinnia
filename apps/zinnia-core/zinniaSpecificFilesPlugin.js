import fs from 'fs';
import path from 'path';
import { transform } from 'esbuild';

const startFilePath = path.join(__dirname, 'public/start.js');
const documentFilePath = path.join(__dirname, 'src/document.css');
const outputDir = path.join(__dirname, 'dist/assets');
const outputStartFilePath = path.join(outputDir, 'start.js');
const outputDocumentFilePath = path.join(outputDir, 'document.css');

export default function (mode) {
  return {
    name: 'zinnia-specific-files-plugin',
    generateBundle: async (options, bundle) => {
      // (1) Create start.js
      let startFileSource = fs.readFileSync(startFilePath, 'utf-8');
      const hashedFileNames = Object.keys(bundle);
      const fileNames = new Map();

      for (const hashedFileName of hashedFileNames) {
        const simpleFileName = hashedFileName.replace(/-.*?\./, '.'); // Remove hash
        fileNames.set(simpleFileName, hashedFileName);
      }

      for (const simpleFileName of fileNames.keys()) {
        startFileSource = startFileSource.replace(simpleFileName, fileNames.get(simpleFileName));
      }

      if (mode === 'canary') {
        startFileSource = startFileSource.replace('VERSION', 'canary');
      } else {
        startFileSource = startFileSource.replace('VERSION', process.env.npm_package_version);
      }

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const compressedStartFile = await transform(startFileSource, {
        loader: 'js',
        minify: true,
      });

      fs.writeFileSync(outputStartFilePath, compressedStartFile.code);

      // (2) Create document.css
      const documentFileSource = fs.readFileSync(documentFilePath, 'utf-8');

      const compressedDocumentFile = await transform(documentFileSource, {
        loader: 'css',
        minify: true,
      });

      fs.writeFileSync(outputDocumentFilePath, compressedDocumentFile.code);
    },
  };
}
