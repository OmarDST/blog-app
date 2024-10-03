/* eslint-disable no-undef */
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the root directory where your packages are located
const appsDir = path.join(__dirname, "..", "apps");

// Get command-line arguments
const args = process.argv.slice(2);
const forceCopy = args[0] === "true"; // Default to false
const envExampleFile = args[1] || ".env.dev.example"; // Default to .env.dev.example

// Run the script
processPackages();

// Read the apps directory and process each package
async function processPackages() {
  try {
    // Copy from the specified example file in the root directory
    await copyEnvFile(path.join(__dirname, ".."), envExampleFile, forceCopy);

    const folders = await fs.readdir(appsDir);
    for (const folder of folders) {
      const packageDir = path.join(appsDir, folder);

      // Check if the directory exists and if it's a directory
      const stat = await fs.stat(packageDir);
      if (stat.isDirectory()) {
        await copyEnvFile(packageDir, envExampleFile, forceCopy);
      }
    }
  } catch (error) {
    console.error("Error processing packages:", error);
  }
}

// Function to copy the specified env example file to .env if .env doesn't exist or if forced
async function copyEnvFile(packageDir, envExampleFile, force) {
  const envExamplePath = path.join(packageDir, envExampleFile);
  const envPath = path.join(packageDir, ".env");

  try {
    // Check if the specified env example file exists
    await fs.access(envExamplePath);

    // Check if .env already exists
    try {
      await fs.access(envPath);
      if (!force) {
        console.log(`.env already exists in ${packageDir}, skipping...`);
        return;
      }
    } catch {
      // .env does not exist
    }

    // Read the content of the env example file
    const exampleContent = await fs.readFile(envExamplePath, "utf8");

    // Create the content for the .env file with a comment
    const comment = `# Copied from ${envExampleFile}\n`;
    const envContent = comment + exampleContent;

    // Write the new content to .env
    await fs.writeFile(envPath, envContent);
    console.log(`Copied ${envExampleFile} to .env in ${packageDir}`);
  } catch {
    // If the specified env example file doesn't exist, do nothing
    console.log(`No ${envExampleFile} found in ${packageDir}, skipping...`);
  }
}
