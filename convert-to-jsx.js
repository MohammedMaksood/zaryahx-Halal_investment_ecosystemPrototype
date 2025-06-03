// Script to convert TSX files to JSX with advanced handling
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    
    // Fix default values for props
    content = content.replace(/(\w+)\?\s*:/g, '$1:');
    
    // Handle optional chaining (keep it as is, supported in modern browsers)
    
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
      } else if (entry.name.endsWith('.tsx')) {
        console.log(`Converting ${fullPath}`);
        
        // Read the file content
        const content = await fs.readFile(fullPath, 'utf8');
        
        // Convert TSX to JSX
        const jsxContent = convertTsxToJsx(content, fullPath);
        
        // Create the new JSX file path
        const jsxPath = fullPath.replace('.tsx', '.jsx');
        
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

// Function to update main.tsx and other entry files
async function updateEntryFiles(srcDir) {
  try {
    // Update main.tsx to main.jsx
    const mainTsxPath = path.join(srcDir, 'main.tsx');
    const mainJsxPath = path.join(srcDir, 'main.jsx');
    
    if (await fileExists(mainTsxPath) && await fileExists(mainJsxPath)) {
      // Update index.html to reference main.jsx instead of main.tsx
      const indexHtmlPath = path.join(__dirname, 'index.html');
      if (await fileExists(indexHtmlPath)) {
        let indexContent = await fs.readFile(indexHtmlPath, 'utf8');
        indexContent = indexContent.replace(/src=\"\/src\/main.tsx\"/, 'src="/src/main.jsx"');
        await fs.writeFile(indexHtmlPath, indexContent, 'utf8');
        console.log('Updated index.html to reference main.jsx');
      }
    }
    
    // Update vite.config.ts if needed
    const viteConfigPath = path.join(__dirname, 'vite.config.ts');
    if (await fileExists(viteConfigPath)) {
      let viteConfig = await fs.readFile(viteConfigPath, 'utf8');
      // Add JSX support if not already present
      if (!viteConfig.includes('jsxRuntime')) {
        viteConfig = viteConfig.replace(
          'plugins: [',
          'plugins: [\n    react({ jsxRuntime: "automatic" }),'
        );
        await fs.writeFile(viteConfigPath, viteConfig, 'utf8');
        console.log('Updated vite.config.ts to support JSX files');
      }
    }
  } catch (error) {
    console.error('Error updating entry files:', error);
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
  const srcDir = path.join(__dirname, 'src');
  console.log(`Starting conversion in ${srcDir}`);
  
  try {
    await processDirectory(srcDir);
    await updateEntryFiles(srcDir);
    console.log('Conversion completed successfully!');
    console.log('Note: You may need to update your build configuration to handle JSX files.');
  } catch (error) {
    console.error('Conversion failed:', error);
  }
}

main();
