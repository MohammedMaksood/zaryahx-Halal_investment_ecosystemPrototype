// Script to update Vite config for JSX support
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateViteConfig() {
  try {
    const viteConfigPath = path.join(__dirname, 'vite.config.ts');
    console.log(`Updating Vite config at ${viteConfigPath}`);
    
    // Read the current vite.config.ts
    const content = await fs.readFile(viteConfigPath, 'utf8');
    
    // Create a new vite.config.js file with JSX support
    const updatedContent = content
      // Change file extension in import statements
      .replace(/from\s+["'](.+?)\.tsx["']/g, "from '$1.jsx'")
      // Ensure JSX runtime is set to automatic
      .replace(/react\(\)/g, "react({ jsxRuntime: 'automatic' })")
      // Add JSX file extensions to resolve.extensions if not present
      .replace(
        /resolve:\s*{/g, 
        `resolve: {
    extensions: ['.js', '.jsx', '.json'],`
      );
    
    // Write the updated config to vite.config.js
    const viteConfigJsPath = path.join(__dirname, 'vite.config.js');
    await fs.writeFile(viteConfigJsPath, updatedContent, 'utf8');
    
    console.log(`Created ${viteConfigJsPath} with JSX support`);
    
    // Update package.json to use .jsx files
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
    
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
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    console.log('Updated package.json with JSX support');
    
    console.log('Vite configuration updated successfully!');
  } catch (error) {
    console.error('Error updating Vite config:', error);
  }
}

updateViteConfig();
