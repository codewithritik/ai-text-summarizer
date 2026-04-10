# Security Best Practices for API Key

## 🔒 Secure API Key Storage

**Current Implementation:**
- ✅ API key is stored in `config.js` (gitignored - never committed to version control)
- ✅ API key is injected during build time into `dist/background.js`
- ✅ Source code (`background.js`) contains only a placeholder
- ✅ Users cannot see or modify the API key through the extension UI

## ⚠️ Important Security Notice

**Your API key will be visible in the built extension files.** Anyone who installs your extension can view the API key by inspecting the `dist/background.js` file. This is a limitation of client-side Chrome extensions.

## How to Protect Your API Key

### 1. **Restrict API Key in Google Cloud Console** (RECOMMENDED)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your API key and click **Edit**
4. Under **API restrictions**, select **Restrict key**
5. Choose **Generative Language API** only
6. Under **Application restrictions**, you can:
   - **HTTP referrers**: Restrict to specific websites (not applicable for extensions)
   - **IP addresses**: Restrict to your IP (if you have a static IP)
   - **None**: Allow from anywhere (less secure but works for extensions)

### 2. **Set Quota Limits**

1. In Google Cloud Console, go to **APIs & Services** → **Quotas**
2. Set daily/monthly limits to prevent unexpected charges
3. Enable billing alerts

### 3. **Monitor Usage**

1. Go to **APIs & Services** → **Dashboard**
2. Monitor API usage regularly
3. Set up alerts for unusual activity

### 4. **Use Separate API Key for Extension**

- Create a dedicated API key just for this extension
- This way, if it's compromised, you can revoke it without affecting other projects

### 5. **Rotate Keys Regularly**

- Periodically create new API keys and update `config.js`
- Revoke old keys that are no longer needed

## Alternative: Backend Proxy (Most Secure)

For maximum security, you could:
1. Create a backend server (Node.js, Python, etc.)
2. Store API key on the server
3. Extension calls your server → Server calls Google AI API
4. This keeps the API key completely hidden

However, this requires hosting a server, which may not be necessary for personal use.

## Current Setup

### For Production/Personal Use:
1. **Store API key in `config.js`** (already gitignored)
   - Copy `config.example.js` to `config.js`
   - Add your actual API key to `config.js`
   - `config.js` will NEVER be committed to git

2. **Build the extension:**
   ```bash
   npm run build
   ```
   - This injects the API key from `config.js` into `dist/background.js`
   - The built file contains your API key

3. **Load extension in Chrome:**
   - Load the entire folder (including `dist/` folder)
   - Chrome will use `dist/background.js` which has the API key

### Security Best Practices:
- ✅ **Restrict the API key in Google Cloud Console** (REQUIRED)
- ✅ **Set quota limits** to prevent unexpected charges
- ✅ **Monitor usage** regularly
- ✅ **Never commit `config.js`** to version control (already in `.gitignore`)
- ✅ **Use a separate API key** just for this extension

## If Sharing the Extension Publicly

If you plan to share this extension publicly:
- ❌ **Don't include your API key** - remove it from `config.js` before sharing
- ✅ Share `config.example.js` as a template
- ✅ Provide instructions for users to create their own `config.js`
- ✅ Users must run `npm run build` after adding their API key

