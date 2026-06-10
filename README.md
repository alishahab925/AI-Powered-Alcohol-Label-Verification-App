# AI-Powered-Alcohol-Label-Verification-App

A browser-based tool that uses Google Gemini's vision AI to automatically verify TTB (Alcohol and Tobacco Tax and Trade Bureau) compliance requirements on alcohol beverage label images.

---

## Live Demo

> **ai-powered-alcohol-label-verificati-nine.vercel.app**

---

## Setup & Running Locally

This is a **single-file static HTML app** — no build step, no dependencies to install.

```bash
# Clone the repo
git clone https://github.com/alishahab925/AI-Powered-Alcohol-Label-Verification-App.git
cd AI-Powered-Alcohol-Label-Verification-App

# Option 1: Open directly in browser
open index.html

# Option 2: Serve locally
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

No API key setup required — the app works out of the box.

---

## How to Use

1. **Single label:** Drop or upload one label image → click "Verify Label"
2. **Batch mode:** Toggle "Batch mode" → upload up to 20 images → verify all at once
3. Results appear in 2–5 seconds with pass / fail / warning for each required field

---

## What It Checks

Per TTB requirements, the tool verifies the presence and formatting of:

| Field | Check |
|---|---|
| Brand Name | Present on label |
| Class / Type | Designation present (e.g. "Kentucky Straight Bourbon Whiskey") |
| Alcohol Content | ABV listed (e.g. "45% Alc./Vol.") |
| Net Contents | Volume listed (e.g. "750 mL") |
| Producer / Bottler Info | Name and address present |
| Government Warning | Exact wording, "GOVERNMENT WARNING:" in ALL CAPS |

The AI applies judgment for edge cases — minor capitalization differences in brand names are flagged as warnings rather than hard failures, consistent with stakeholder feedback from the discovery sessions (Dave Morrison's "STONE'S THROW" vs "Stone's Throw" example).

---

## Approach & Technical Decisions

### Architecture
Single-file HTML/CSS/JS — no framework, no build toolchain, no backend. Deliberate choice for this prototype:
- **Zero setup for reviewers** — open the URL and it just works
- **Easy to deploy** — any static host works (Vercel, Netlify, GitHub Pages)
- **Transparent** — all logic readable in one place

### AI Integration
Uses **Google Gemini 1.5 Flash** via the Generative Language API with vision capability. The label image is converted to base64 and sent alongside a structured prompt that instructs the model to return JSON with per-field compliance results.

The prompt is designed to:
- Return strict JSON only (no markdown wrapping)
- Apply practical judgment (warn vs fail for minor issues)
- Specifically enforce the government warning ALL CAPS requirement per Jenny Park's feedback
- Handle poor image quality gracefully (warn rather than hard fail)

### Performance
Typical response time is **2–5 seconds** per label — within the ~5 second threshold identified as critical during stakeholder discovery with Sarah Chen. No preprocessing or OCR pipeline needed; the vision model handles raw images directly.

### Batch Mode
Multiple labels process sequentially with a live status indicator per file. A summary (X passed / Y failed) appears on completion. Each result is collapsible to reduce visual clutter for large batches — addressing Janet from Seattle's long-standing request.

---

## Assumptions & Limitations

- **No COLA integration:** Standalone proof-of-concept as scoped by Marcus Williams. Does not connect to the existing COLA system.
- **No data persistence:** Results are not saved between sessions. A production version would log results for audit trail and document retention compliance.
- **Sequential batch processing:** Batch jobs run one at a time to stay within API rate limits. Parallel processing would be faster but requires rate limit management.
- **Government warning text:** Checks for presence and ALL CAPS formatting of "GOVERNMENT WARNING:". A production version should do a full exact match against the complete statutory warning text.
- **Image quality:** Very low quality or heavily obscured images may produce warnings. The model handles moderate quality variation well, addressing Jenny Park's concern about imperfect label photos.

---

## Tools Used

- **HTML / CSS / JavaScript** — no framework
- **Google Gemini 1.5 Flash** — vision AI for label analysis (free tier)
- **IBM Plex Sans / IBM Plex Mono** — typography (Google Fonts)
- **Vercel** — deployment

---

## Deploying

```bash
npx vercel --prod
```

Or drag the folder into [vercel.com/new](https://vercel.com/new). Also works with Netlify Drop or GitHub Pages.
