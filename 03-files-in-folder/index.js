const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function listFilesInFolder() {
  try {
    const items = await fs.readdir(folderPath, { withFileTypes: true });

    for (const item of items) {
      if (item.isFile()) {
        const filePath = path.join(folderPath, item.name);
        const fileStats = await fs.stat(filePath);

        const fileName = path.basename(item.name, path.extname(item.name));
        const fileExt = path.extname(item.name).slice(1);
        const fileSize = fileStats.size;

        const fileSizeInKB = fileSize / 1024;

        console.log(`${fileName} - ${fileExt} - ${fileSizeInKB.toFixed(3)}kb`);
      }
    }
  } catch (error) {
    console.error('Error reading folder:', error.message);
  }
}

listFilesInFolder();
