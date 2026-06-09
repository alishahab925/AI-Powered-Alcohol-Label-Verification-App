import { NextRequest, NextResponse } from 'next/server';
import { analyzeLabelImage, verifyLabel } from '@/services/verificationService';
import { LabelData } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const applicationDataRaw = formData.get('applicationData') as string;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const applicationData = JSON.parse(applicationDataRaw || '{}') as Partial<LabelData>;

    // In a real app, we'd convert File to Buffer
    // For prototype, we'll just pass the name or mock it
    const extractedData = await analyzeLabelImage(image.name);

    const result = verifyLabel(extractedData, applicationData);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
