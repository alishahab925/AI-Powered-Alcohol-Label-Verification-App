import { LabelData, VerificationResult } from '../types';

export const STANDARD_GOVERNMENT_WARNING =
  "GOVERNMENT WARNING: (1) According to the Surgeon General, women should not drink alcoholic beverages during pregnancy because of the risk of birth defects. (2) Consumption of alcoholic beverages impairs your ability to drive a car or operate machinery, and may cause health problems.";

/**
 * In a production environment with proper API keys and network access,
 * this function would use OpenAI's GPT-4o Vision or Anthropic's Claude 3.5 Sonnet.
 *
 * Example integration with OpenAI:
 *
 * const response = await openai.chat.completions.create({
 *   model: "gpt-4o",
 *   messages: [
 *     {
 *       role: "user",
 *       content: [
 *         { type: "text", text: "Extract the brand name, class/type, alcohol content, net contents, and government warning from this alcohol label. Return as JSON." },
 *         { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
 *       ],
 *     },
 *   ],
 *   response_format: { type: "json_object" }
 * });
 */
export async function analyzeLabelImage(imageName: string): Promise<LabelData> {
  // Simulated delay to mimic AI processing (Sarah's requirement: < 5s)
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Enhanced mock: detect "mismatch" in filename to simulate different label extractions
  if (imageName.toLowerCase().includes('mismatch') || imageName.toLowerCase().includes('error')) {
    return {
      brandName: "OLD TOM'S DISTILLERY", // Extra 'S
      classType: "Kentucky Bourbon Whiskey", // Missing "Straight"
      alcoholContent: "40% Alc./Vol.", // Wrong percentage
      netContents: "1 L", // Wrong size
      governmentWarning: "Government Warning: (1) Women should not drink during pregnancy. (2) Don't drive." // Paraphrased
    };
  }

  // Default "correct" extraction
  return {
    brandName: "OLD TOM DISTILLERY",
    classType: "Kentucky Straight Bourbon Whiskey",
    alcoholContent: "45% Alc./Vol. (90 Proof)",
    netContents: "750 mL",
    governmentWarning: STANDARD_GOVERNMENT_WARNING
  };
}

export function verifyLabel(labelData: LabelData, applicationData: Partial<LabelData>): VerificationResult {
  const fields: VerificationResult['fields'] = {} as any;
  let overallValid = true;

  const keys: (keyof LabelData)[] = ['brandName', 'classType', 'alcoholContent', 'netContents', 'governmentWarning'];

  keys.forEach(key => {
    const labelVal = labelData[key] || "";
    const appVal = applicationData[key] || "";

    let isMatch = false;
    let feedback = "";

    if (key === 'governmentWarning') {
      // Jenny's requirement: EXACT, ALL CAPS header, strict punctuation
      const hasCorrectHeader = labelVal.startsWith("GOVERNMENT WARNING:");
      const isExactMatch = labelVal.trim() === appVal.trim();

      if (!hasCorrectHeader) {
        isMatch = false;
        feedback = "Header 'GOVERNMENT WARNING:' must be present and in ALL CAPS.";
      } else if (!isExactMatch) {
        isMatch = false;
        feedback = "Warning statement text must match the standard health warning verbatim.";
      } else {
        isMatch = true;
      }
    } else {
      // Dave's requirement: "Judgment" (case-insensitive, minor punctuation-insensitive)
      const normalize = (s: string) => s.toLowerCase().replace(/['"“”]/g, '').trim();
      isMatch = normalize(labelVal) === normalize(appVal);

      if (!isMatch) {
        feedback = `Mismatch: Label has "${labelVal}", Application has "${appVal}"`;
      }
    }

    if (!isMatch) overallValid = false;

    fields[key] = {
      labelValue: labelVal,
      applicationValue: appVal,
      isMatch,
      confidence: 0.95,
      feedback
    };
  });

  return {
    isValid: overallValid,
    fields,
    overallFeedback: overallValid ? "Label matches application data." : "Conflicts detected between label and application."
  };
}
