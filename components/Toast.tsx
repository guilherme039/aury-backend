import React, { useEffect, useState } from 'react';
import { CheckCircleIcon } from './Icons';

interface ToastProps {
  message: string;
  show: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, show }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    let timer: number;
    if (show) {
      setIsRendered(true);
    } else {
      // Wait for animation to complete before unmounting
      timer = window.setTimeout(() => {
        setIsRendered(false);
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [show]);

  if (!isRendered) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ease-in-out transform ${
        show
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      }`}
      style={{ transform: `translateX(-50%) ${show ? 'translateY(0)' : 'translateY(1rem)'}` }}
      role="alert"
    >
      <div className="bg-green-600/90 backdrop-blur-md text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2 shadow-lg shadow-green-500/30">
        <CheckCircleIcon className="w-4 h-4" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
