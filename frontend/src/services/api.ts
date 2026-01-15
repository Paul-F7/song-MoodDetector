const API_BASE_URL = 'http://localhost:8000';

export interface Emotion {
  name: string;
  percentage: number;
  emoji: string;
  description: string;
}

export interface AnalyzeResult {
  image: string;
  emotion1: Emotion;
  emotion2?: Emotion;
  emotion3?: Emotion;
}

export async function analyzeAudio(file: File): Promise<AnalyzeResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'Failed to analyze audio');
  }

  return response.json();
}