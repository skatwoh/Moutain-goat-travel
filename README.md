## Project Overview

This is a **Next.js** application (bootstrapped with `create-next-app`) that provides a travel booking platform with tours, stays, and optional shuttle/vehicle services.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open <http://localhost:3000> with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

---

## Google Sheets Database Integration

### Overview
We use a **Google Sheet** as a lightweight, free, real‑time database. A Google Apps Script deployed as a **Web App** exposes a simple REST API (`GET`/`POST`) that the frontend calls via `fetch`. This eliminates the need for a separate backend server while keeping data persistent.

### Setup Steps
1. **Create a Google Sheet**
   - Open Google Sheets and create a new spreadsheet.
   - Add headers in the first row for each field you want to store (e.g., `id`, `name`, `type`, `date`, `details`).
2. **Add Apps Script**
   - In the sheet, click **Extensions → Apps Script**.
   - Replace the default code with the following (adjust column names as needed):
   ```javascript
   const SHEET_ID = 'YOUR_SHEET_ID_HERE';
   const SHEET = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

   function doGet(e) {
     const rows = SHEET.getDataRange().getValues();
     const headers = rows.shift();
     const data = rows.map(row => {
       const obj = {};
       headers.forEach((h, i) => obj[h] = row[i]);
       return obj;
     });
     return ContentService.createTextOutput(JSON.stringify(data))
       .setMimeType(ContentService.MimeType.JSON);
   }

   function doPost(e) {
     const payload = JSON.parse(e.postData.contents);
     const newRow = Object.values(payload);
     SHEET.appendRow(newRow);
     return ContentService.createTextOutput(JSON.stringify({status: 'ok'}))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
   - Replace `YOUR_SHEET_ID_HERE` with the ID from the sheet URL.
3. **Deploy as Web App**
   - Click **Deploy → New deployment**.
   - Choose **Web app**.
   - Set **Execute as** to *Me* and **Who has access** to *Anyone* (or *Anyone with the link* for public APIs).
   - Deploy and copy the **Web App URL**.
4. **Configure the Frontend**
   - In `src/lib/db.js` the `BASE_URL` constant points to the Web App URL. Update it if you change the deployment.
   - The module provides `readDB()` and `writeDB(data)` helpers that use `fetch` to communicate with the sheet. A local `db.json` fallback is used when the sheet is unreachable.

### Usage Notes
- **Rate limits**: Google Apps Script caps calls per minute; batch writes or throttling may be necessary for heavy traffic.
- **Security**: Since the endpoint is public, never expose sensitive information. Use simple validation in the script if needed.
- **Data format**: Ensure the order of values in `payload` matches the column order in the sheet.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- **Next.js Documentation** – https://nextjs.org/docs
- **Learn Next.js** – https://nextjs.org/learn

You can check out the **Next.js GitHub repository** – https://github.com/vercel/next.js – for feedback and contributions.

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the **Vercel Platform** (https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the **Next.js deployment documentation** (https://nextjs.org/docs/app/building-your-application/deploying) for more details.

