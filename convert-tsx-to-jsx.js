// Master script to convert TSX to JSX while preserving functionality
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  // Directories to process
  srcDir: path.join(__dirname, 'src'),
  // File extensions to convert
  extensions: {
    from: '.tsx',
    to: '.jsx'
  },
  // Files to update
  configFiles: {
    viteConfig: path.join(__dirname, 'vite.config.ts'),
    packageJson: path.join(__dirname, 'package.json'),
    indexHtml: path.join(__dirname, 'index.html'),
    tsConfig: path.join(__dirname, 'tsconfig.json')
  },
  // Backup directory
  backupDir: path.join(__dirname, 'tsx-backup')
};

// Create backup of original files
async function createBackup() {
  console.log('Creating backup of original files...');
  
  try {
    // Create backup directory if it doesn't exist
    await fs.mkdir(config.backupDir, { recursive: true });
    
    // Function to recursively copy files
    async function copyDir(src, dest) {
      const entries = await fs.readdir(src, { withFileTypes: true });
      await fs.mkdir(dest, { recursive: true });
      
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          await copyDir(srcPath, destPath);
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }
    }
    
    // Backup src directory
    await copyDir(config.srcDir, path.join(config.backupDir, 'src'));
    
    // Backup config files
    for (const [key, filePath] of Object.entries(config.configFiles)) {
      try {
        const fileName = path.basename(filePath);
        await fs.copyFile(filePath, path.join(config.backupDir, fileName));
      } catch (err) {
        console.warn(`Could not backup ${filePath}: ${err.message}`);
      }
    }
    
    console.log(`Backup created at ${config.backupDir}`);
    return true;
  } catch (error) {
    console.error('Failed to create backup:', error);
    return false;
  }
}

// Function to convert TypeScript syntax to JavaScript
function convertTsxToJsx(content, filePath) {
  try {
    // Save original props destructuring before we remove type annotations
    const propsMatches = content.match(/\(\{\s*([^}]*)\}\)/g) || [];
    const savedProps = {};
    
    propsMatches.forEach((match, index) => {
      const key = `__SAVED_PROPS_${index}__`;
      savedProps[key] = match;
      content = content.replace(match, key);
    });

    // Remove TypeScript interfaces
    content = content.replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, '');
    
    // Remove type imports
    content = content.replace(/import\s+type\s+.*?from\s+['"'].*?['"']/g, '');
    content = content.replace(/import\s+\{\s*.*?type\s+.*?\}\s+from\s+['"'].*?['"']/g, match => {
      // Keep the import but remove the 'type' keyword
      return match.replace(/\s+type\s+/g, ' ');
    });
    
    // Handle import statements with mixed types and values
    content = content.replace(/import\s+\{([\s\S]*?)\}\s+from\s+['"'].*?['"']/g, match => {
      // Remove type imports but keep value imports
      return match.replace(/\s*type\s+\w+,?/g, '').replace(/,\s*\}/g, ' }');
    });
    
    // Remove TypeScript type annotations from function parameters and variables
    content = content.replace(/:\s*React\.FC<.*?>/g, '');
    content = content.replace(/:\s*React\.FC/g, '');
    content = content.replace(/:\s*React\.\w+<.*?>/g, '');
    content = content.replace(/:\s*\w+(\[\])?\s*(?=[,)=])/g, '');
    content = content.replace(/:\s*\{\s*[^}]*\}\s*(?=[,)=])/g, '');
    content = content.replace(/<(\w+)>\s*\(/g, '(');
    
    // Remove type assertions
    content = content.replace(/as\s+\w+(\[\])?/g, '');
    
    // Remove generic type parameters while preserving JSX tags
    content = content.replace(/<([A-Z]\w*)<.*?>>/g, '<$1>'); // Component with generic
    content = content.replace(/<([A-Z]\w*)<.*?>\s+/g, '<$1 '); // Component with generic and props
    
    // Fix function declarations with generics
    content = content.replace(/function\s+\w+<.*?>\(/g, match => {
      return match.replace(/<.*?>/g, '');
    });
    
    // Fix arrow functions with generics
    content = content.replace(/const\s+\w+\s*=\s*<.*?>\(/g, match => {
      return match.replace(/<.*?>/g, '(');
    });
    
    // Remove TypeScript-specific syntax
    content = content.replace(/export\s+type\s+.*?;/g, '');
    content = content.replace(/export\s+interface\s+.*?\{[\s\S]*?\}/g, '');
    content = content.replace(/type\s+\w+\s*=\s*.*?;/g, '');
    content = content.replace(/declare\s+.*?;/g, '');
    
    // Fix enum declarations
    content = content.replace(/enum\s+(\w+)\s*\{([^}]*)\}/g, (match, enumName, enumValues) => {
      const values = enumValues.split(',').map(v => v.trim());
      const jsObject = values.map((v, i) => {
        if (v.includes('=')) {
          return v;
        }
        return `${v} = ${i}`;
      }).join(',\n  ');
      
      return `const ${enumName} = {\n  ${jsObject}\n};`;
    });
    
    // Restore saved props
    Object.keys(savedProps).forEach(key => {
      const originalProps = savedProps[key];
      // Remove type annotations from props
      const cleanedProps = originalProps.replace(/:\s*\w+(\[\])?\s*(?=[,)])/g, '')
                                        .replace(/:\s*\{\s*[^}]*\}\s*(?=[,)])/g, '');
      content = content.replace(key, cleanedProps);
    });
    
    // Fix imports for .tsx files, changing them to .jsx
    content = content.replace(/from\s+['"'](.+?)\.tsx['"']/g, "from '$1.jsx'");
    content = content.replace(/import\s+.*?\s+from\s+['"']\.\/App\.tsx['"']/g, "import App from './App.jsx'");
    
    // Fix default values for props
    content = content.replace(/(\w+)\?\s*:/g, '$1:');
    
    // Remove non-null assertions
    content = content.replace(/(\w+)!/g, '$1');
    
    return content;
  } catch (error) {
    console.error(`Error converting file ${filePath}:`, error);
    return content; // Return original content if conversion fails
  }
}

// Function to update import references in JSX files
async function updateImportReferences(filePath, content) {
  // Update import statements to reference .jsx files instead of .tsx
  return content.replace(/from\s+['"'](\.\.?\/.*?)\.tsx['"']/g, "from '$1.jsx'");
}

// Function to recursively process all TSX files in a directory
async function processDirectory(directory) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const convertedFiles = [];
    
    // First pass: convert all TSX files to JSX
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        const subDirConverted = await processDirectory(fullPath);
        convertedFiles.push(...subDirConverted);
      } else if (entry.name.endsWith(config.extensions.from)) {
        console.log(`Converting ${fullPath}`);
        
        // Read the file content
        const content = await fs.readFile(fullPath, 'utf8');
        
        // Convert TSX to JSX
        const jsxContent = convertTsxToJsx(content, fullPath);
        
        // Create the new JSX file path
        const jsxPath = fullPath.replace(config.extensions.from, config.extensions.to);
        
        // Write the converted content to the new JSX file
        await fs.writeFile(jsxPath, jsxContent, 'utf8');
        
        convertedFiles.push({
          originalPath: fullPath,
          newPath: jsxPath
        });
        
        console.log(`Created ${jsxPath}`);
      }
    }
    
    // Second pass: update import references in all JSX files
    for (const file of convertedFiles) {
      const content = await fs.readFile(file.newPath, 'utf8');
      const updatedContent = await updateImportReferences(file.newPath, content);
      await fs.writeFile(file.newPath, updatedContent, 'utf8');
    }
    
    // Third pass: delete original TSX files after all conversions are done
    for (const file of convertedFiles) {
      await fs.unlink(file.originalPath);
      console.log(`Deleted original ${file.originalPath}`);
    }
    
    return convertedFiles;
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error);
    return [];
  }
}

// Function to update configuration files
async function updateConfigFiles() {
  console.log('Updating configuration files...');
  
  try {
    // Update index.html
    if (await fileExists(config.configFiles.indexHtml)) {
      let indexContent = await fs.readFile(config.configFiles.indexHtml, 'utf8');
      indexContent = indexContent.replace(/src=["']\/src\/main\.tsx["']/g, 'src="/src/main.jsx"');
      await fs.writeFile(config.configFiles.indexHtml, indexContent, 'utf8');
      console.log('Updated index.html to reference main.jsx');
    }
    
    // Create vite.config.js from vite.config.ts
    if (await fileExists(config.configFiles.viteConfig)) {
      let viteConfig = await fs.readFile(config.configFiles.viteConfig, 'utf8');
      
      // Convert TypeScript to JavaScript
      viteConfig = convertTsxToJsx(viteConfig, config.configFiles.viteConfig);
      
      // Update JSX runtime configuration
      if (!viteConfig.includes('jsxRuntime')) {
        viteConfig = viteConfig.replace(
          /react\(\)/g,
          "react({ jsxRuntime: 'automatic' })"
        );
      }
      
      // Add JSX file extension support
      if (!viteConfig.includes('extensions')) {
        viteConfig = viteConfig.replace(
          /resolve:\s*{/g,
          `resolve: {\n    extensions: ['.js', '.jsx', '.json'],`
        );
      }
      
      // Write to vite.config.js
      const viteConfigJsPath = path.join(__dirname, 'vite.config.js');
      await fs.writeFile(viteConfigJsPath, viteConfig, 'utf8');
      console.log(`Created ${viteConfigJsPath} with JSX support`);
    }
    
    // Update package.json
    if (await fileExists(config.configFiles.packageJson)) {
      const packageJson = JSON.parse(await fs.readFile(config.configFiles.packageJson, 'utf8'));
      
      // Add .jsx to eslint configuration if it exists
      if (packageJson.eslintConfig) {
        if (packageJson.eslintConfig.extensions) {
          if (!packageJson.eslintConfig.extensions.includes('.jsx')) {
            packageJson.eslintConfig.extensions.push('.jsx');
          }
        } else {
          packageJson.eslintConfig.extensions = ['.js', '.jsx'];
        }
      }
      
      // Update package.json
      await fs.writeFile(config.configFiles.packageJson, JSON.stringify(packageJson, null, 2), 'utf8');
      console.log('Updated package.json with JSX support');
    }
    
    console.log('Configuration files updated successfully!');
    return true;
  } catch (error) {
    console.error('Error updating configuration files:', error);
    return false;
  }
}

// Helper function to check if a file exists
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting TSX to JSX conversion...');
  console.log(`Source directory: ${config.srcDir}`);
  
  // Create backup first
  const backupCreated = await createBackup();
  if (!backupCreated) {
    console.error('Failed to create backup. Aborting conversion.');
    return;
  }
  
  try {
    // Process all TSX files
    await processDirectory(config.srcDir);
    
    // Update configuration files
    await updateConfigFiles();
    
    console.log('\nConversion completed successfully!');
    console.log(`Backup of original files is available at: ${config.backupDir}`);
    console.log('\nNext steps:');
    console.log('1. Run "npm install" to ensure all dependencies are installed');
    console.log('2. Run "npm run dev" to start the development server');
    console.log('3. Check for any runtime errors and fix them manually if needed');
    
  } catch (error) {
    console.error('Conversion failed:', error);
    console.log('You can restore the backup from:', config.backupDir);
  }
}

// Run the conversion
main();
