
import React from 'react';
import { ArrowLeftIcon, ShieldCheckIcon } from './Icons';

interface LoginScreenProps {
    onLoginSuccess: (asOwner: boolean) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {

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
                <div className="space-y-6 flex flex-col items-center w-full max-w-sm">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-white">Bem-vindo</h2>
                        <p className="text-gray-400">Faça login para continuar seu progresso</p>
                    </div>

                    <button
                        onClick={() => onLoginSuccess(false)}
                        className="w-full bg-white text-black font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-gray-100 transition-all active:scale-95 shadow-lg hover:shadow-xl"
                        aria-label="Entrar no Aplicativo"
                    >
                        <span>Entrar</span>
                        <ArrowLeftIcon className="w-5 h-5 rotate-180" />
                    </button>

                    <button
                        onClick={() => onLoginSuccess(true)}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-blue-500 transition-all active:scale-95 shadow-lg hover:shadow-xl"
                        aria-label="Entrar como Dono"
                    >
                        <ShieldCheckIcon className="w-5 h-5" />
                        <span>Entrar como Dono</span>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LoginScreen;
