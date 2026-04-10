import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Read API key from config.js
function getApiKey() {
  const configPath = path.join(__dirname, 'config.js');
  
  if (!fs.existsSync(configPath)) {
    console.error('✗ Error: config.js not found!');
    console.error('  Please create config.js with your API key.');
    console.error('  See config.example.js for reference.');
    process.exit(1);
  }

  try {
    // Read and parse config.js to extract API key
    const configContent = fs.readFileSync(configPath, 'utf8');
    const apiKeyMatch = configContent.match(/const\s+API_KEY\s*=\s*['"]([^'"]+)['"]/);
    
    if (!apiKeyMatch || !apiKeyMatch[1]) {
      console.error('✗ Error: Could not find API_KEY in config.js');
      console.error('  Make sure config.js contains: const API_KEY = "your-key-here";');
      process.exit(1);
    }

    const apiKey = apiKeyMatch[1];
    
    if (apiKey === 'YOUR_API_KEY_HERE' || apiKey === '{{API_KEY_PLACEHOLDER}}' || !apiKey.trim()) {
      console.error('✗ Error: API_KEY in config.js is not set!');
      console.error('  Please set your actual API key in config.js');
      process.exit(1);
    }

    return apiKey;
  } catch (error) {
    console.error('✗ Error reading config.js:', error.message);
    process.exit(1);
  }
}

// Build configuration
const buildOptions = {
  entryPoints: ['background.js'],
  bundle: true,
  outfile: 'dist/background.js',
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  external: ['chrome'],
  minify: false,
  sourcemap: false,
  plugins: [
    {
      name: 'inject-api-key',
      setup(build) {
        build.onEnd(async () => {
          // Read the built file
          const builtFile = path.join(__dirname, 'dist', 'background.js');
          let content = fs.readFileSync(builtFile, 'utf8');
          
          // Get API key from config
          const apiKey = getApiKey();
          
          // Replace placeholder with actual API key (handle both single and double quotes)
          content = content.replace(/'{{API_KEY_PLACEHOLDER}}'/g, `'${apiKey}'`);
          content = content.replace(/"{{API_KEY_PLACEHOLDER}}"/g, `"${apiKey}"`);
          
          // Write back
          fs.writeFileSync(builtFile, content, 'utf8');
        });
      },
    },
  ],
};

// Build function
async function build() {
  try {
    // Validate API key exists before building
    const apiKey = getApiKey();
    console.log('✓ API key found in config.js');
    console.log('✓ Building extension...');
    
    await esbuild.build(buildOptions);
    console.log('✓ Build successful!');
    console.log('✓ background.js bundled to dist/background.js');
    console.log('✓ API key injected securely');
  } catch (error) {
    console.error('✗ Build failed:', error);
    process.exit(1);
  }
}

// Watch mode
if (process.argv.includes('--watch')) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log('👀 Watching for changes...');
} else {
  build();
}

