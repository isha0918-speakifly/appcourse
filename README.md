# Speakifly — flat file version

Every file sits directly in one folder — no subfolders — so you can upload
this straight into a GitHub repo. Same course: level-based lessons,
vocabulary practice, and an AI speaking partner, with no accounts or
login screen. Each student's progress is remembered automatically in
their own browser.

## Files in this zip

| File | What it does |
|---|---|
| `index.html` | Homepage — levels dashboard |
| `lesson.html` | A level's units, vocabulary, pronunciation practice |
| `speaking-partner.html` | Voice conversation with the AI |
| `styles.css` | All styling |
| `curriculum.js` | Lesson content — edit this to add levels/units/words |
| `progress.js` | Saves/reads each student's progress in their browser |
| `speech.js` | Browser speech-to-text and text-to-speech |
| `ai-partner.js` | Talks to the Cloud Function that runs the AI |
| `logo.png` | Your Speakifly logo, used in the header and browser tab |
| `cloud-function-index.js` | Server-side code that calls the Claude API |
| `cloud-function-package.json` | Dependency list for that server-side code |

## Step 1 — Upload to GitHub

1. Create a new repository on GitHub (e.g. `speakifly`).
2. Open it, click **Add file → Upload files**.
3. Drag in every file from this zip **except** `cloud-function-index.js`
   and `cloud-function-package.json` (those two are handled separately
   in Step 3 — they don't belong on the website itself).
4. Commit the upload.

## Step 2 — Turn on GitHub Pages

**Settings → Pages → Source: Deploy from branch → main → / (root) → Save**

After a minute your site is live at:
```
https://YOUR_USERNAME.github.io/speakifly/
```
Send that link to students — everything except the AI partner works already.

## Step 3 — Connect the AI speaking partner (one-time)

The AI needs a small server-side piece so your API key stays private —
it can never sit inside the website's own files, or anyone could read it.

1. Get an API key at console.anthropic.com.
2. Create a free project at console.firebase.google.com (only used for
   this one function — no login/database setup needed).
3. On your computer:
   ```
   npm install -g firebase-tools
   firebase login
   mkdir speakifly-function && cd speakifly-function
   firebase init functions      # choose JavaScript
   ```
4. Delete the `functions/index.js` and `functions/package.json` that were
   just generated, and put `cloud-function-index.js` and
   `cloud-function-package.json` in their place — renamed to
   `index.js` and `package.json`.
5. Set your key and deploy:
   ```
   cd functions
   npm install
   firebase functions:config:set anthropic.key="YOUR_ANTHROPIC_API_KEY"
   cd ..
   firebase deploy --only functions
   ```
6. Copy the URL it prints, e.g.
   `https://us-central1-yourproject.cloudfunctions.net/chatWithPartner`.
7. Back in your GitHub repo, open `ai-partner.js`, paste that URL into
   `CLOUD_FUNCTION_URL` at the top, and commit the change.

> Note: Cloud Functions that call an external API require Firebase's
> "Blaze" (pay-as-you-go) plan. Normal classroom use stays within the
> free monthly quota — you just need a card on file.

## Sharing links with students

- Same link for everyone: `https://YOUR_USERNAME.github.io/speakifly/`
- Personalized greeting: `https://YOUR_USERNAME.github.io/speakifly/?student=Riya`
  (only changes the "Welcome back" text — progress still lives on their device)

## Known limitations

- Progress is saved per device, not per student across devices — clearing
  browser data or switching phones resets it.
- Pronunciation scoring is simple word-matching, not phoneme-level accuracy.
- Voice input/output works best in Chrome or Edge; Safari support is partial.
