# 📊 Weekly Progress Automation: Stop-by-Step Setup

This guide specifically explains how to configure the **4 Nodes** in the `weekly_progress_blueprint.json` scenario.

### 🛑 Pre-requisite
Ensure you have imported the blueprint into Make.com. You should see 4 modules in a line.

---

### Node 1: Firestore - Search Documents
**Goal:** Find all active users in your database.
1.  **Click** the first module.
2.  **Connection**: Click **Add**.
    - *Project ID*: Your Firebase Project ID (found in Project Settings).
    - *Key*: You might need your Service Account JSON key content.
3.  **Collection ID**: Type `users`.
4.  **Limit**: Set to `50` (or higher if you have more users).
5.  **Click OK**.

---

### Node 2: Firestore - List Documents
**Goal:** Get the `activityLog` entries for *each* user found in Node 1.
1.  **Click** the second module.
2.  **Connection**: Select the same connection as Node 1.
3.  **Collection ID**: Type `activityLog`.
    - *Note*: This assumes your data structure is `users/{userId}/activityLog/{logId}`.
4.  **Parent Document ID**:
    - Click the input field.
    - Select `Document ID` (or `ID`) from the **User (Node 1)** options in the pop-up panel.
5.  **Query/Filter**:
    - You want logs from the last 7 days.
    - Field: `timestamp`
    - Operator: `>` (Greater than)
    - Value: Click the calendar icon in pop-up -> `addDays` -> `now`, `-7`.
      - Formula: `{{addDays(now; -7)}}`
6.  **Click OK**.

---

### Node 3: Numeric Aggregator
**Goal:** Sum up the XP from all the activity logs found in Node 2.
1.  **Click** the third module (Green icon).
2.  **Source Module**: Select `Firestore - List Documents` (Node 2).
3.  **Aggregate function**: Select `SUM`.
4.  **Value**:
    - Click the input field.
    - Select `xp` from the **ActivityLog (Node 2)** options.
    - *Note*: If you don't see `xp`, you might need to run the scenario once with real data or right-click Node 2 and select "Run this module only" to fetch sample data.
5.  **Click OK**.

---

### Node 4: Email - Send Email
**Goal:** Send the summary to the user.
1.  **Click** the fourth module.
2.  **Connection**: Connect your Gmail or SMTP account.
3.  **To**:
    - Select `email` from the **User (Node 1)** options.
4.  **Subject**: "Your Weekly Progress Report 🚀"
5.  **Content (HTML)**:
    - Use data from the **Aggregator (Node 3)**.
    - Example:
      ```html
      <h1>Hi {{1.displayName}},</h1>
      <p>Here is your progress for the week:</p>
      <ul>
        <li><b>Total XP Gained:</b> {{3.result}}</li>
      </ul>
      <p>Keep coding!</p>
      ```
6.  **Click OK**.

---

### 🧪 Testing
1.  Click **Run once** (Play button).
2.  Watch the "bubbles" move.
3.  Check your inbox!
