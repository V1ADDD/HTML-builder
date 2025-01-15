const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const bundleFile = path.join(outputDir, 'bundle.css');

async function mergeStyles() {
  try {
    await fs.promises.mkdir(outputDir, { recursive: true });

    const bundleStream = fs.createWriteStream(bundleFile);

    const files = await fs.promises.readdir(stylesDir, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(stylesDir, file.name);

      if (file.isFile() && path.extname(file.name) === '.css') {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        bundleStream.write(data + '\n'); 
      }
    }

    bundleStream.end();
    console.log('Styles have been merged into bundle.css successfully!');
  } catch (error) {
    console.error('Error during merging styles:', error.message);
  }
}

mergeStyles();
