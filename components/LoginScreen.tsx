
import React, { useEffect, useRef } from 'react';
import { ArrowLeftIcon, GoogleIcon, ShieldCheckIcon } from './Icons';

// Add type definitions for Google Identity Services to avoid TypeScript errors.
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: any) => void; }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, any>) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface LoginScreenProps {
    onLoginSuccess: (asOwner: boolean) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
    const googleButtonRef = useRef<HTMLDivElement>(null);
    
    // Callback function to handle the response from Google Sign-In.
    const handleGoogleCredentialResponse = (response: any) => {
        console.log("Encoded JWT ID token: " + response.credential);
        // In a real application, you would send this token to your backend for verification.
        // For this demo, Google login always signs in as a regular user.
        onLoginSuccess(false);
    }

    useEffect(() => {
        // Check if the Google script has loaded before initializing.
        if (window.google && googleButtonRef.current) {
            window.google.accounts.id.initialize({
                // IMPORTANT: Replace with your actual Google Cloud Client ID.
                // This ID is available from the Google Cloud Console.
                client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
                callback: handleGoogleCredentialResponse,
            });

            // Render the Google Sign-In button with a dark theme and fixed width.
            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                { 
                    theme: 'filled_black', 
                    size: 'large',
                    type: 'standard',
                    text: 'continue_with',
                    shape: 'pill',
                    logo_alignment: 'left',
                    width: '300', // Set fixed width
                }
            );
        }
    }, []);
    
    return (
        <div className="bg-[#0C0C0E] min-h-screen font-sans text-white flex flex-col p-4 animate-fade-in body-bg-animate">
            <header className="flex-shrink-0">
                <div className="flex items-center h-16">
                    <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                        <ArrowLeftIcon className="w-6 h-6 text-gray-400" />
                    </button>
                </div>
                 {/* Progress bar with dark theme */}
                <div className="w-full bg-gray-800 rounded-full h-1">
                    <div className="bg-white h-1 rounded-full" style={{ width: '0%' }}></div>
                </div>
            </header>
            
            <main className="flex-1 flex flex-col justify-start pt-16 px-4 space-y-12">
                <h1 className="text-4xl font-bold text-white leading-tight">
                    Comece seu progresso
                </h1>
                
                <div className="space-y-4 flex flex-col items-center">
                    <button 
                        onClick={() => onLoginSuccess(false)}
                        className="bg-white text-black font-semibold py-3 rounded-full flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors active:scale-95"
                        aria-label="Entrar como Usuário Padrão"
                        style={{ width: '300px' }}
                    >
                        <span>Entrar como Usuário Padrão</span>
                    </button>
                    
                    <button 
                        onClick={() => onLoginSuccess(true)}
                        className="bg-black border border-yellow-400/50 text-yellow-400 font-semibold py-3 rounded-full flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors active:scale-95"
                        aria-label="Entrar como Proprietário"
                        style={{ width: '300px' }}
                    >
                        <ShieldCheckIcon className="w-5 h-5"/>
                        <span>Entrar como Proprietário (Admin)</span>
                    </button>
                    
                    <div className="text-gray-500 text-sm py-2">ou</div>

                    <div ref={googleButtonRef}></div>
                </div>
            </main>
        </div>
    );
};

export default LoginScreen;
