const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const componentsDir = path.join(__dirname, 'components');
const templateFile = path.join(__dirname, 'template.html');
const outputHTML = path.join(projectDist, 'index.html');
const outputCSS = path.join(projectDist, 'style.css');
const outputAssets = path.join(projectDist, 'assets');

async function createProjectDist() {
  await fs.promises.mkdir(projectDist, { recursive: true });
}

async function buildHTML() {
  try {
    let template = await fs.promises.readFile(templateFile, 'utf-8');

    const tagRegex = /{{\s*([\w-]+)\s*}}/g;
    const matches = [...template.matchAll(tagRegex)];

    for (const match of matches) {
      const tagName = match[1];
      const componentPath = path.join(componentsDir, `${tagName}.html`);

      try {
        const componentContent = await fs.promises.readFile(componentPath, 'utf-8');
        template = template.replace(match[0], componentContent);
      } catch {
        console.warn(`Component file for tag "{{${tagName}}}" not found or not readable.`);
      }
    }

    await fs.promises.writeFile(outputHTML, template);
    console.log('index.html built successfully!');
  } catch (error) {
    console.error('Error building HTML:', error.message);
  }
}

async function mergeStyles() {
  try {
    const styleFiles = await fs.promises.readdir(stylesDir, { withFileTypes: true });

    const bundleStream = fs.createWriteStream(outputCSS);
    for (const file of styleFiles) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const data = await fs.promises.readFile(path.join(stylesDir, file.name), 'utf-8');
        bundleStream.write(data + '\n');
      }
    }

    bundleStream.end();
    console.log('style.css built successfully!');
  } catch (error) {
    console.error('Error merging styles:', error.message);
  }
}

async function copyAssets(srcDir, destDir) {
  try {
    await fs.promises.mkdir(destDir, { recursive: true });

    const items = await fs.promises.readdir(srcDir, { withFileTypes: true });

    for (const item of items) {
      const srcPath = path.join(srcDir, item.name);
      const destPath = path.join(destDir, item.name);

      if (item.isDirectory()) {
        await copyAssets(srcPath, destPath);
      } else if (item.isFile()) {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }

    console.log('Assets copied successfully!');
  } catch (error) {
    console.error('Error copying assets:', error.message);
  }
}

async function buildProject() {
  try {
    await createProjectDist();
    await Promise.all([
      buildHTML(),
      mergeStyles(),
      copyAssets(assetsDir, outputAssets),
    ]);
    console.log('Project built successfully!');
  } catch (error) {
    console.error('Error building project:', error.message);
  }
}

buildProject();
