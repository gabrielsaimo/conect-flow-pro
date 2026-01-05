import { useState, useCallback } from 'react';
import { parseExcelFile } from '../utils/excel';

interface UseFileUploadReturn {
  headers: string[];
  rawData: (string | number | null | undefined)[][];
  extractedTemplate: string | null;
  isLoading: boolean;
  error: string | null;
  handleFileUpload: (file: File) => Promise<void>;
  clearData: () => void;
  hasData: boolean;
}

/**
 * Hook para gerenciar upload e parsing de arquivos Excel/CSV
 */
export function useFileUpload(): UseFileUploadReturn {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawData, setRawData] = useState<(string | number | null | undefined)[][]>([]);
  const [extractedTemplate, setExtractedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await parseExcelFile(file);
      setHeaders(result.headers);
      setRawData(result.data);
      setExtractedTemplate(result.template);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo');
      setHeaders([]);
      setRawData([]);
      setExtractedTemplate(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setHeaders([]);
    setRawData([]);
    setExtractedTemplate(null);
    setError(null);
  }, []);

  return {
    headers,
    rawData,
    extractedTemplate,
    isLoading,
    error,
    handleFileUpload,
    clearData,
    hasData: rawData.length > 0,
  };
}
