# AI-Powered Alcohol Label Verification App

## Overview
This prototype is an AI-powered verification tool designed for TTB (Tax and Trade Bureau) agents to automate the matching of alcohol label artwork against COLA (Certificate of Label Approval) applications.

The application focuses on reducing the manual data-entry verification workload for agents while maintaining high standards for health warning compliance and allowing for human-like "judgment" on brand matching.

## Key Features
- **Single Label Verification**: Upload a label image and compare it against application fields.
- **Batch Processing**: Handle large volumes of labels (200-300 at a time) with automated queueing and reporting.
- **Persona-Driven Logic**:
    - **Dave's "Judgment"**: Implements fuzzy/case-insensitive matching for brand names and types to avoid false rejections.
    - **Jenny's "Strictness"**: Implements verbatim matching for the Government Warning statement, ensuring the "GOVERNMENT WARNING:" header is present and in all caps.
    - **Sarah's Accessibility**: High-contrast, clean UI designed for varying tech comfort levels.
- **Performance**: Targeted < 2s response time for AI extraction to ensure agent adoption.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React
- **Validation**: Zod
- **Animations**: Framer Motion

## Setup & Run Instructions

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

### Building for Production
```bash
npm run build
npm start
```

## AI Implementation & Approach

### Current Prototype Logic
The current prototype uses a content-aware service layer (`src/services/verificationService.ts`) that simulates vision-based extraction.
- To see a **Success** case: Upload any standard image.
- To see a **Conflict** case: Upload an image with "mismatch" or "error" in the filename.

### Production Integration
To transition to a live vision model, the `analyzeLabelImage` function in `verificationService.ts` should be updated to call an LLM API.

**Recommended Implementation:**
Using OpenAI GPT-4o Vision:
```typescript
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Extract: brand name, class/type, alcohol content, net contents, government warning." },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
      ],
    },
  ],
  response_format: { type: "json_object" }
});
```

## Assumptions & Decisions
1. **Network Restrictions**: Based on IT feedback regarding outbound traffic blocks, the prototype defaults to a local simulation to ensure it remains "testable" in restricted environments.
2. **COLA Integration**: As per Marcus (IT Admin), this is a standalone proof-of-concept and does not connect to the legacy .NET COLA system.
3. **Data Retention**: No images or PII are stored on the server, adhering to preliminary security concerns.
