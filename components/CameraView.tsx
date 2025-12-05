import React, { useRef, useEffect, useState } from 'react';
import { GalleryIcon, CloseIcon, BarcodeIcon } from './Icons';

interface CameraViewProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
  onSelectFromGallery: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose, onSelectFromGallery }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasStream, setHasStream] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let streamInstance: MediaStream | null = null;
    let mounted = true;

    const startCamera = async () => {
      // Reset error state
      setError(null);

      try {
        // First, try to get the environment camera (rear camera) directly
        const constraints = {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        };

        streamInstance = await navigator.mediaDevices.getUserMedia(constraints);

        if (mounted && videoRef.current) {
          videoRef.current.srcObject = streamInstance;
          setHasStream(true);
          return;
        }
      } catch (firstError) {
        console.warn('Primary camera attempt failed, trying fallback...', firstError);

        // Fallback: Try to enumerate devices and find a video input
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');

          if (videoDevices.length > 0) {
            // Try the last one (often the rear one on mobile if not labeled) or just any
            const targetDeviceId = videoDevices[videoDevices.length - 1].deviceId;

            const fallbackConstraints = {
              video: { deviceId: { exact: targetDeviceId } }
            };

            streamInstance = await navigator.mediaDevices.getUserMedia(fallbackConstraints);

            if (mounted && videoRef.current) {
              videoRef.current.srcObject = streamInstance;
              setHasStream(true);
              return;
            }
          } else {
            // Last resort: just ask for video
            const simpleConstraints = { video: true };
            streamInstance = await navigator.mediaDevices.getUserMedia(simpleConstraints);

            if (mounted && videoRef.current) {
              videoRef.current.srcObject = streamInstance;
              setHasStream(true);
              return;
            }
          }
        } catch (secondError) {
          console.error("All camera attempts failed:", secondError);
          if (mounted) {
            let errorMessage = "Não foi possível acessar a câmera.";
            if (secondError instanceof DOMException) {
              if (secondError.name === 'NotAllowedError' || secondError.name === 'PermissionDeniedError') {
                errorMessage = "Permissão de câmera negada. Verifique as configurações do navegador.";
              } else if (secondError.name === 'NotFoundError') {
                errorMessage = "Nenhuma câmera encontrada.";
              }
            }
            setError(errorMessage);
          }
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (streamInstance) {
        streamInstance.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(imageDataUrl);
      }
    }
  };

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-4/5 max-w-sm aspect-square border-4 border-white/50 rounded-3xl" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {!hasStream && !error && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-lg font-semibold text-white">
          <div className="w-8 h-8 border-4 border-t-cyan-400 border-gray-600 rounded-full animate-spin mb-4"></div>
          Iniciando câmera...
        </div>
      )}

      {error && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-black/70 p-4 rounded-lg text-red-400 max-w-sm">{error}</div>}

      {/* Controls */}
      <div className="absolute top-4 left-4 z-10">
        <button onClick={onClose} className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-white/10 transition-colors">
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-end gap-4">
        <div className="flex items-center justify-center gap-2">
          <button className="bg-white text-black px-3 py-2 rounded-lg font-semibold text-xs">
            Escanear Alimento
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 opacity-60 cursor-not-allowed">
            <BarcodeIcon className="w-4 h-4" />
            Código de Barras
          </button>
          <button onClick={onSelectFromGallery} className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5">
            <GalleryIcon className="w-4 h-4" />
            Galeria
          </button>
        </div>

        <button onClick={handleCapture} className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg active:scale-95 transition-transform" aria-label="Escanear Alimento">
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraView;