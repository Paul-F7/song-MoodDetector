const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pfom-songmooddetector.hf.space';
const SLICE_DURATION = 45; // seconds, must match backend duration param

function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const dataBytes = samples.length * 2; // 16-bit PCM
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);

  const write = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  write(0, 'RIFF');
  view.setUint32(4, 36 + dataBytes, true);
  write(8, 'WAVE');
  write(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);              // PCM
  view.setUint16(22, 1, true);              // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true);              // block align
  view.setUint16(34, 16, true);             // bits per sample
  write(36, 'data');
  view.setUint32(40, dataBytes, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

async function sliceAudio(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  await audioContext.close();

  const { sampleRate, numberOfChannels, length } = audioBuffer;
  const numSamples = Math.min(length, Math.floor(SLICE_DURATION * sampleRate));
  const maxStart = length - numSamples;
  const startSample = maxStart > 0 ? Math.floor(Math.random() * maxStart) : 0;

  // Mix down to mono
  const mono = new Float32Array(numSamples);
  for (let ch = 0; ch < numberOfChannels; ch++) {
    const channelData = audioBuffer.getChannelData(ch);
    for (let i = 0; i < numSamples; i++) {
      mono[i] += channelData[startSample + i] / numberOfChannels;
    }
  }

  return encodeWav(mono, sampleRate);
}

export interface Emotion {
  name: string;
  percentage: number;
  emoji: string;
  description: string;
}

export interface AnalyzeResult {
  image: string;
  imageUrl?: string;
  emotion1: Emotion;
  emotion2?: Emotion;
  emotion3?: Emotion;
}

export function warmup(): void {
  fetch(`${API_BASE_URL}/`).catch(() => {});
}

export async function analyzeAudio(file: File): Promise<AnalyzeResult> {
  const sliced = await sliceAudio(file);
  const formData = new FormData();
  formData.append('file', sliced, 'audio.wav');

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