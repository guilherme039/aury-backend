

import React, { useState, useEffect } from 'react';
import { SettingsIcon, PencilIcon, MoonIcon, GlobeIcon, CloudIcon, ChatBubbleIcon, WaterDropIcon, KeyIcon, ArrowLeftIcon, ProteinGradientIcon, RulerIcon, ScaleIcon, CakeIcon } from './Icons';
import { DailyGoals, UserProfileData } from '../types';

interface SettingsProps {
    goals: DailyGoals;
    onBack: () => void;
    profile: UserProfileData;
    onUpdateProfile: (newProfileData: Partial<UserProfileData>) => void;
}

type EditableField = 'age' | 'weight' | 'height';

const Header = ({ onBack }: { onBack: () => void; }) => (
    <div className="flex items-center space-x-3 mb-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">Ajustes</h1>
    </div>
);

const Card: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
    <div className={`bg-[#1A1B1E]/80 backdrop-blur-lg border border-gray-800/80 rounded-2xl p-4 shadow-xl shadow-black/40 ${className}`}>
        {children}
    </div>
);

const ProfileCard = () => (
    <Card>
        <div className="flex items-center space-x-4">
            <div className="relative">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" className="w-16 h-16 rounded-full border-2 border-gray-700"/>
                <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-pulse" style={{boxShadow: '0 0 15px #3B82F6'}}></div>
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">John Doe</h2>
                <p className="text-sm text-gray-400">Meta: Definição Muscular</p>
            </div>
            <button className="ml-auto p-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors group">
                <PencilIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
            </button>
        </div>
    </Card>
);

const ApiIntegrations = () => {
    const [piAPIKey, setPiAPIKey] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem('piapi_key') || '';
        setPiAPIKey(storedKey);
    }, []);

    const handleSaveKey = () => {
        localStorage.setItem('piapi_key', piAPIKey);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Integrações de API</h3>
            <Card>
                <div className="flex items-center gap-4 mb-3">
                    <div className="text-gray-400"><KeyIcon className="w-5 h-5"/></div>
                    <span className="text-gray-300 font-medium">Chave da API PiAPI (Fallback)</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                    Esta chave será usada como backup (PiAPI) caso a API principal do Gemini falhe.
                </p>
                <div className="flex gap-2">
                    <input
                        type="password"
                        value={piAPIKey}
                        onChange={(e) => setPiAPIKey(e.target.value)}
                        placeholder="Insira sua chave PiAPI..."
                        className="flex-1 bg-[#0C0C0E] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        onClick={handleSaveKey} 
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${saved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-500'}`}
                    >
                        {saved ? 'Salvo!' : 'Salvar'}
                    </button>
                </div>
            </Card>
        </div>
    );
};

const SettingsItem: React.FC<{icon: React.ReactNode, label: string, value?: string, onClick?: () => void}> = ({ icon, label, value, onClick }) => (
    <button onClick={onClick} disabled={!onClick} className="w-full flex items-center p-4 text-left hover:bg-gray-800/50 transition-colors group disabled:cursor-default disabled:hover:bg-transparent">
        <div className="text-gray-400 group-hover:text-blue-400 transition-colors">{icon}</div>
        <span className="flex-1 ml-4 text-gray-300 font-medium">{label}</span>
        {value && <span className={`text-gray-500 transition-colors ${onClick ? 'group-hover:text-white' : ''}`}>{value}</span>}
    </button>
);

const GeneralSettings = () => (
    <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Geral</h3>
        <Card className="p-0 divide-y divide-gray-800">
            <SettingsItem icon={<MoonIcon className="w-5 h-5 text-gray-400"/>} label="Tema" value="Escuro" />
            <SettingsItem icon={<GlobeIcon className="w-5 h-5 text-gray-400"/>} label="Idioma" value="Português" />
            <SettingsItem icon={<CloudIcon className="w-5 h-5 text-gray-400"/>} label="Backup e Sincronização" />
            <SettingsItem icon={<ChatBubbleIcon className="w-5 h-5 text-gray-400"/>} label="Ajuda e Suporte" />
        </Card>
    </div>
);

const LogoutButton = () => (
    <div className="pt-4">
        <button className="w-full text-center py-3 rounded-lg text-red-500 font-semibold hover:bg-red-500/10 transition-colors">
            Sair da Conta
        </button>
    </div>
);

const Settings: React.FC<SettingsProps> = ({ goals, onBack, profile, onUpdateProfile }) => {
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [currentValue, setCurrentValue] = useState('');

  const handleEditClick = (field: EditableField, value: number) => {
    setEditingField(field);
    setCurrentValue(String(value));
  };

  const handleSave = () => {
    if (editingField) {
        const numericValue = parseFloat(currentValue);
        if (!isNaN(numericValue) && numericValue > 0) {
            onUpdateProfile({ [editingField]: numericValue });
        }
    }
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const getModalInfo = () => {
    if (!editingField) return { title: '', unit: ''};
    switch(editingField) {
        case 'age': return { title: 'Qual a sua idade?', unit: 'anos' };
        case 'weight': return { title: 'Qual o seu peso?', unit: 'kg' };
        case 'height': return { title: 'Qual a sua altura?', unit: 'cm' };
        default: return { title: '', unit: ''};
    }
  }

  return (
    <div className="text-white p-2 space-y-6 animate-fade-in">
       <Header onBack={onBack}/>
       <div className="space-y-6">
            <ProfileCard />

            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Metas Diárias</h3>
                <Card className="p-0 divide-y divide-gray-800">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <div><ProteinGradientIcon className="w-5 h-5"/></div>
                            <span className="text-gray-300 font-medium">Meta de Proteína</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span
                                className="w-28 bg-[#0C0C0E] border border-gray-700 rounded-lg px-2 py-1.5 text-center font-semibold"
                            >
                                {goals.protein}
                            </span>
                            <span className="text-gray-500 text-sm">g</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <div className="text-cyan-400"><WaterDropIcon className="w-5 h-5"/></div>
                            <span className="text-gray-300 font-medium">Meta de Água</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span
                                className="w-28 bg-[#0C0C0E] border border-gray-700 rounded-lg px-2 py-1.5 text-center font-semibold"
                            >
                                {goals.water}
                            </span>
                            <span className="text-gray-500 text-sm">ml</span>
                        </div>
                    </div>
                </Card>
            </div>

            <ApiIntegrations />

            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Dados Pessoais</h3>
                <Card className="p-0 divide-y divide-gray-800">
                    <SettingsItem icon={<CakeIcon className="w-5 h-5 text-purple-400"/>} label="Sua idade" value={`${profile.age} anos`} onClick={() => handleEditClick('age', profile.age)} />
                    <SettingsItem icon={<ScaleIcon className="w-5 h-5 text-green-400"/>} label="Seu peso" value={`${profile.weight} kg`} onClick={() => handleEditClick('weight', profile.weight)} />
                    <SettingsItem icon={<RulerIcon className="w-5 h-5 text-yellow-400"/>} label="Sua altura" value={`${profile.height} cm`} onClick={() => handleEditClick('height', profile.height)} />
                </Card>
            </div>
            
            <GeneralSettings />
       </div>
       <LogoutButton />

       {editingField && (
         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#1A1B1E] rounded-2xl p-6 w-full max-w-sm border border-gray-700 shadow-2xl shadow-black/50">
                <h3 className="text-lg font-bold mb-4">{getModalInfo().title}</h3>
                <div className="relative">
                    <input 
                        type="number"
                        value={currentValue}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        className="w-full bg-[#0C0C0E] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 pr-12"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    />
                    <span className="absolute right-3 top-2.5 text-gray-500">{getModalInfo().unit}</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleCancel} className="flex-1 bg-gray-700/80 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors">Cancelar</button>
                    <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-500 transition-colors">Salvar</button>
                </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default React.memo(Settings);