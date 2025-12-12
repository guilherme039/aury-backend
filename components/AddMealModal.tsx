


import React, { useState, useCallback, useRef, useEffect } from 'react';
import { analyzeFoodImage } from '../services/analysisService';
import { Meal, NutritionInfo, DailyGoals, ScanResult, DetectedFood } from '../types';
import CameraView from './CameraView';
import AnalysisResult from './AnalysisResult';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeal: (meal: Omit<Meal, 'id' | 'time'>) => void;
  dailyGoals: DailyGoals;
  currentTotals: NutritionInfo;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Falha ao converter blob para base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const dataUrlToBase64 = (dataUrl: string): string => {
  return dataUrl.split(',')[1];
};


const AddMealModal: React.FC<AddMealModalProps> = ({ isOpen, onClose, onAddMeal, dailyGoals, currentTotals }) => {
  const [view, setView] = useState<'camera' | 'loading' | 'result' | 'error'>('camera');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setView('camera');
    setImageDataUrl(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleAnalysis = async (file: File, imageUrl: string) => {
    console.log("Starting analysis...");
    setView('loading');
    setImageDataUrl(imageUrl);
    setError(null);

    try {
      console.log("Calling analyzeFoodImage...");
      // Cast response to ScanResult since the service now returns any
      const result = await analyzeFoodImage(file) as ScanResult;
      console.log("Analysis result received:", result);

      if (!result || !result.mealName) {
        throw new Error("Dados de análise incompletos. Tente novamente.");
      }

      setAnalysisResult(result);
      setView('result');
      console.log("Navigating to result view");
    } catch (err) {
      console.error("Analysis failed:", err);
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido. Tente novamente.';
      setError(errorMessage);
      setView('error');
      console.log("Navigating to error view with message:", errorMessage);
    }
  };

  const handleCapture = (dataUrl: string) => {
    // Convert dataUrl to File
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], "camera_capture.jpg", { type: mime });

    handleAnalysis(file, dataUrl);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    try {
      // Pass file directly
      handleAnalysis(file, previewUrl);
    } catch (error) {
      setError("Não foi possível carregar a imagem da galeria.");
      setView('error');
    }
  };

  const handleSelectFromGallery = () => {
    fileInputRef.current?.click();
  };

  const handleAddMealFromAnalysis = (finalMeal: { name: string; nutrition: NutritionInfo; detectedFoods: DetectedFood[] }) => {
    if (imageDataUrl) {
      onAddMeal({
        name: finalMeal.name,
        imageUrl: imageDataUrl,
        nutrition: finalMeal.nutrition,
        detectedFoods: finalMeal.detectedFoods,
      });
      handleClose();
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'camera':
        return <CameraView onCapture={handleCapture} onClose={handleClose} onSelectFromGallery={handleSelectFromGallery} />;

      case 'loading':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {imageDataUrl && <img src={imageDataUrl} alt="Comida capturada" className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-lg font-semibold text-white">
              <div className="w-8 h-8 border-4 border-t-cyan-400 border-gray-600 rounded-full animate-spin mb-4"></div>
              Analisando...
            </div>
          </div>
        );

      case 'result':
        if (analysisResult && imageDataUrl) {
          return (
            <AnalysisResult
              scanResult={analysisResult}
              imageUrl={imageDataUrl}
              onAddMeal={handleAddMealFromAnalysis}
              onScanAgain={resetState}
            />
          );
        }

        // Fallback if data is missing despite success state
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gray-900">
            <h3 className="text-xl font-bold text-yellow-500 mb-2">Dados Incompletos</h3>
            <p className="text-gray-400 bg-yellow-900/20 p-3 rounded-lg mb-6">A análise foi concluída, mas os dados não puderam ser carregados corretamente.</p>
            <button onClick={resetState} className="w-full bg-gray-700/80 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors border border-gray-600">
              Tentar Novamente
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#0C0C0E]">
            <div className="max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-red-400 mb-3">Erro na Análise</h3>
              <p className="text-gray-300 bg-red-900/20 p-4 rounded-lg mb-6 border border-red-900/30">{error}</p>
              <div className="space-y-3">
                <button
                  onClick={resetState}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
                >
                  Tirar Outra Foto
                </button>
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-700/80 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors border border-gray-600"
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div
        className="bg-[#1A1A1D] w-full h-full text-white relative overflow-hidden"
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {renderContent()}
      </div>
    </div>
  );
};

export default React.memo(AddMealModal);
