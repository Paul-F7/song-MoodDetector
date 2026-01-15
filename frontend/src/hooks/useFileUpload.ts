import { useState, useCallback, useRef } from 'react';
import { analyzeAudio, AnalyzeResult } from '../services/api';

interface UseFileUploadReturn {
  isDragging: boolean;
  isLoading: boolean;
  error: string | null;
  result: AnalyzeResult | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetResult: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.includes('audio/') && !file.name.endsWith('.mp3')) {
      setError('Please upload an MP3 file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const analysisResult = await analyzeAudio(file);
      setResult(analysisResult);
      console.log('Analysis result:', analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze audio');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    // Reset input so the same file can be selected again
    e.target.value = '';
  }, [processFile]);

  const resetResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    isDragging,
    isLoading,
    error,
    result,
    inputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleClick,
    handleFileChange,
    resetResult,
  };
}