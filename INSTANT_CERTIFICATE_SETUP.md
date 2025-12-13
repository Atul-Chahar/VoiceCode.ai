# 🎓 Instant Certificate: The Ultimate Newbie Guide

This guide will take you from "Zero" to "Sending Certificates" in about 15 minutes. Follow every step exactly!

---

## 🛑 Step 1: Create Your Certificate Template (Do this first!)
Before we touch Make.com, we need a "Master Copy" of the certificate that the robot will fill in.

1.  Go to **[Google Slides](https://slides.google.com)**.
2.  Create a **Blank Presentation**.
3.  Design your certificate (or paste an image of a certificate design).
4.  **Crucial Step**: Add these exact text boxes where you want the info to appear:
    *   `{{Name}}`  *(Where the student's name goes)*
    *   `{{Course}}` *(e.g., JavaScript Mastery)*
    *   `{{Date}}` *(Today's date)*
5.  **Name the file**: `VoiceCode Certificate Template`.
6.  **Close the tab**. It's autosaved.

---

## 🤖 Step 2: Import the Brain (The Blueprint)
Now we tell Make.com how to think.

1.  Log in to **[Make.com](https://www.make.com)**.
2.  Click **Scenarios** (left menu) -> **Create a new scenario** (top right).
3.  Look at the bottom toolbar. Find the **Three Dots (...)** icon (it says "More").
4.  Click **Import Blueprint**.
5.  **Upload the file** from your computer:
    *   `d:\VoiceCode.ai\make_blueprints\certificate_blueprint.json`
6.  **Boom!** You should see 4 bubbles (Nodes) appear connected in a line.

---

## 🔗 Step 3: Connect the Dots (Configuring Nodes)
The nodes have "Red Exclamation Marks" because they don't know your password yet. Let's fix them left-to-right.

### Node 1: Webhook (The Trigger)
1.  Click the first bubble (**Custom Webhook**).
2.  Click **Add** next to the Webhook field.
3.  Name it `VoiceCode Certificate`. Click **Save**.
4.  **COPY ADDRESS**. (It looks like `https://hook.us1.make.com/...`).
    *   👉 **PASTE THIS URL SOMEWHERE SAFE**. We need it for Step 4.
5.  Click **OK**.

### Node 2: Google Slides (The Creator)
1.  Click the second bubble (**Create a Presentation**).
2.  **Connection**: Click **Add** -> Sign in with your Google Account.
3.  **Title**: Leave it as `Certificate - {{1.userName}}`.
4.  **Template Presentation ID**:
    *   Click the weird list icon or "Map".
    *   Actually, just **Click the input box** and wait. It will load your Drive files.
    *   Select your `VoiceCode Certificate Template` file (from Step 1).
5.  **New Presentation Location**:
    *   Select `My Drive` (or any specific folder).
6.  **Values**: This is where the magic happens.
    *   You will see fields like `Name`, `Course`, `Date`.
    *   Click `Name`. A panel pops up. Find the purple `userName` item (under Node 1) and click it.
    *   *Wait... you might not see `userName` yet because we haven't sent data!*
    *   **TRICK**: Just type `{{1.userName}}` manually for now exactly as I wrote it.
    *   Type `{{1.courseName}}` for Course.
    *   Type `{{1.completionDate}}` for Date.
7.  Click **OK**.

### Node 3: Google Drive (The Downloader)
1.  Click the third bubble (**Download a File**).
2.  **Connection**: Select your Google connection again.
3.  **File ID**: It should already say `Presentation ID` (mapped from Node 2). If not, drag mapping.
4.  **Type**: Select `PDF` (should be default).
5.  Click **OK**.

### Node 4: Email (The Sender)
1.  Click the fourth bubble (**Send an Email**).
2.  **Connection**: Click **Add** -> Connect your Google/Gmail account.
3.  **To**: Type `{{1.email}}` (or select `email` from Node 1).
4.  **Attachments**: It should already have `Certificate...` selected.
5.  Click **OK**.

---

## 💻 Step 4: Add the Hook to Your Code
Remember that URL you copied in Step 3? Time to use it.

1.  Open VS Code.
2.  Go to `d:\VoiceCode.ai\components\CertificateModal.tsx`.
3.  Find line 14:
    ```typescript
    const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/YOUR_WEBHOOK_URL_HERE';
    ```
4.  **Paste your actual URL** inside the quotes.
5.  **Save the file** (`Ctrl+S`).

---

## 🧪 Step 5: The Final Test
1.  Go back to **Make.com**.
2.  Click the **Run once** button (Big purple play button at the bottom left). It will spin and say "Waiting for data".
3.  Go to your **VoiceCode Dashboard** (Localhost).
4.  Click **"Get Certificate"**.
5.  Type your Name and Email -> Click **Send**.
6.  **Watch Make.com**:
    *   The bubbles should turn **Green** one by one. 🟢 🟢 🟢 🟢
7.  **Check your Email**: You should have a fresh PDF certificate!

## 🎉 Step 6: Turn it ON
If it worked:
1.  Click the **Save** (Disk icon) at the bottom.
2.  Turn the **Scheduling** switch to **ON** (bottom left).

**You are now an Automation Engineer.** 🚀
