# VoiceCode.ai Automation Setup Guide

I have integrated the 3 "Blueprint" files directly into your project in the `make_blueprints/` folder.

## 📂 The Files
1.  `d:\VoiceCode.ai\make_blueprints\certificate_blueprint.json`
2.  `d:\VoiceCode.ai\make_blueprints\inactivity_blueprint.json`
3.  `d:\VoiceCode.ai\make_blueprints\weekly_progress_blueprint.json`

---

## 🚀 How to Install (Step-by-Step)

### Step 1: Create a Scencario
1.  Log in to [Make.com](https://www.make.com).
2.  Click **"+ Create a new scenario"**.
3.  Click the **three dots (More)** icon in the bottom toolbar.
4.  Select **"Import Blueprint"**.
5.  **Upload** one of the JSON files from your project folder.
6.  The entire module structure will appear instantly!

### Step 2: Connect Your Accounts
The modules will have "Red Exclamation Marks" because they don't know *your* specific accounts yet.
1.  **Click on each module** (e.g., Google Slides).
2.  Click **"Add"** next to Connection to log in to your Google Account.
3.  **Select the file/folder**:
    - For **Google Slides**, select your "Certificate Template" file from your Drive.
    - For **Google Drive**, select the folder where you want to save PDFs.

### Step 3: Deployment
1.  **Save** the scenario (Disk icon).
2.  **Turn it ON** (Toggle switch to "On").

### Step 4: Link Certificate to Code
For the Certificate automation to work, you need to trigger the webhook.
The code implementation logic is:
```typescript
await fetch('YOUR_WEBHOOK_URL', {
  method: 'POST',
  body: JSON.stringify({ userId: '...', userName: '...', courseName: '...' })
});
```
*Ask me if you want me to add this snippet to your LearningView!*
