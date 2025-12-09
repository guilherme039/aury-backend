import React, { useState } from 'react';
import { CheckIcon, KeyIcon } from './Icons';

interface SubscriptionScreenProps {
    onBypass?: () => void;
}

interface PlanOptionProps {
    title: string;
    price: string;
    subtitle?: string;
    badge?: string;
    isSelected: boolean;
    onClick: () => void;
}

const PlanOption: React.FC<PlanOptionProps> = ({ title, price, subtitle, badge, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={`relative p-4 rounded-2xl text-center border-2 transition-all duration-200 ${isSelected ? 'bg-cyan-500/10 border-cyan-400' : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'}`}
    >
        {badge && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-400 text-black text-xs font-bold px-3 py-0.5 rounded-full">
                {badge}
            </div>
        )}
        <div className="flex items-center justify-center gap-2 mb-2">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-cyan-400 border-cyan-400' : 'border-gray-500'}`}>
                {isSelected && <CheckIcon className="w-3 h-3 text-black" />}
            </div>
            <h4 className="font-bold text-lg">{title}</h4>
        </div>
        <p className="font-semibold text-white">{price}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </button>
);

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ onBypass }) => {
    const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');

    const handleContinue = () => {
        const url = selectedPlan === 'annual'
            ? 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2ef61cf5fefa4681b991ee2e53fa13a4'
            : 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=7ce56baf6f6b442daefb331d781624a1';
        window.open(url, '_blank');
    };

    return (
        <div className="bg-[#0C0C0E] min-h-screen font-sans text-[#E5E7EB] antialiased body-bg-animate flex flex-col p-6 relative">
            {/* Dev Bypass Button */}


            <main className="flex-1 flex flex-col justify-center items-center text-center">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-extrabold text-white mb-4">
                        Você usou suas 3 análises gratuitas!
                    </h1>
                    <p className="text-gray-400 mb-8">Assine para continuar analisando suas refeições e atingir seus objetivos.</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <PlanOption
                            title="Mensal"
                            price="R$ 14,90/mês"
                            isSelected={selectedPlan === 'monthly'}
                            onClick={() => setSelectedPlan('monthly')}
                        />
                        <PlanOption
                            title="Anual"
                            price="R$ 127/ano"
                            subtitle="(R$ 10,50/mês)"
                            badge="MAIS POPULAR"
                            isSelected={selectedPlan === 'annual'}
                            onClick={() => setSelectedPlan('annual')}
                        />
                    </div>

                    <div className="space-y-1 text-sm text-gray-400 mb-8">
                        <p className="flex items-center justify-center gap-2">
                            <CheckIcon className="w-4 h-4 text-green-500" />
                            <span>Acesso ilimitado e imediato.</span>
                        </p>
                        <p>Cancele a qualquer momento.</p>
                    </div>
                </div>
            </main>

            <footer className="w-full max-w-md mx-auto">
                <button
                    onClick={handleContinue}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 transition-colors active:scale-95 shadow-lg shadow-blue-500/30"
                >
                    Assinar e Desbloquear Acesso
                </button>
            </footer>
        </div>
    );
};

export default SubscriptionScreen;