const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const destinationDir = path.join(__dirname, 'files-copy');

async function copyDirectory() {
  try {
    await fs.promises.mkdir(destinationDir, { recursive: true });

    const files = await fs.promises.readdir(sourceDir, { withFileTypes: true });

    const existingFiles = await fs.promises.readdir(destinationDir);
    for (const file of existingFiles) {
      const destFilePath = path.join(destinationDir, file);
      await fs.promises.unlink(destFilePath);
    }

    for (const file of files) {
      const sourcePath = path.join(sourceDir, file.name);
      const destinationPath = path.join(destinationDir, file.name);

      if (file.isFile()) {
        await fs.promises.copyFile(sourcePath, destinationPath);
      } else if (file.isDirectory()) {
        await copySubdirectory(sourcePath, destinationPath);
      }
    }

    console.log('Directory copied successfully!');
  } catch (error) {
    console.error('Error while copying directory:', error.message);
  }
}

async function copySubdirectory(source, destination) {
  try {
    await fs.promises.mkdir(destination, { recursive: true });

    const files = await fs.promises.readdir(source, { withFileTypes: true });

    for (const file of files) {
      const sourcePath = path.join(source, file.name);
      const destinationPath = path.join(destination, file.name);

      if (file.isFile()) {
        await fs.promises.copyFile(sourcePath, destinationPath);
      } else if (file.isDirectory()) {
        await copySubdirectory(sourcePath, destinationPath);
      }
    }
  } catch (error) {
    console.error(`Error copying subdirectory ${source}:`, error.message);
  }
}

copyDirectory();
