import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#0C0C0E] flex items-center justify-center z-[100] animate-fade-out" style={{animationDelay: '1.8s'}}>
      <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-splash">
        Aury
      </h1>
    </div>
  );
};

export default SplashScreen;
