export interface LabelData {
  brandName: string;
  classType: string;
  alcoholContent: string;
  netContents: string;
  governmentWarning: string;
}

export interface VerificationResult {
  isValid: boolean;
  fields: {
    [K in keyof LabelData]: {
      labelValue: string;
      applicationValue: string;
      isMatch: boolean;
      confidence: number;
      feedback?: string;
    };
  };
  overallFeedback: string;
}

export interface BatchVerificationResult {
  id: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: VerificationResult;
  error?: string;
}
