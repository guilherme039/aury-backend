import React, { useState } from 'react';
import { OnboardingData } from '../types';
import { 
    ArrowLeftIcon, 
    WorkoutFrequencyIconOne, 
    WorkoutFrequencyIconTwo, 
    WorkoutFrequencyIconThree, 
    ObstacleConsistencyIcon,
    ObstacleHabitsIcon,
    HeartIcon,
    ObstacleScheduleIcon,
    ObstacleInspirationIcon,
    CheckCircleIcon
} from './Icons';

interface OnboardingFlowProps {
    onComplete: (data: OnboardingData) => void;
}

// Onboarding Wrapper
interface OnboardingWrapperProps {
    children: React.ReactNode;
    step: number;
    totalSteps: number;
    isFirstStep: boolean;
    onBack: () => void;
    onContinue: () => void;
}
const OnboardingWrapper: React.FC<OnboardingWrapperProps> = ({ children, step, totalSteps, onBack, onContinue, isFirstStep }) => {
    return (
        <div className="container mx-auto max-w-lg p-4 flex flex-col min-h-screen font-sans">
            <header className="flex-shrink-0 h-16 relative">
                <div className="flex items-center h-full">
                    <button onClick={onBack} className={`p-2 rounded-full hover:bg-gray-800 transition-all ${isFirstStep ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <ArrowLeftIcon className="w-6 h-6 text-gray-400" />
                    </button>
                </div>
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 w-full px-16">
                    <div className="w-full bg-gray-800 rounded-full h-1">
                        <div className="bg-white h-1 rounded-full" style={{ width: `${step / (totalSteps-1) * 100}%`, transition: 'width 0.3s ease-in-out' }}></div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col justify-center animate-fade-in" key={step}>
                {children}
            </main>

            <footer className="flex-shrink-0 py-4">
                <button
                    onClick={onContinue}
                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors active:scale-95 shadow-lg shadow-black/20"
                >
                    Continuar
                </button>
            </footer>
        </div>
    );
};


// Option Button component
const OptionButton: React.FC<{text: string, isSelected: boolean, onClick: () => void, className?: string, children?: React.ReactNode}> = React.memo(({text, isSelected, onClick, className, children}) => (
    <button
        onClick={onClick}
        className={`w-full p-4 rounded-2xl text-left flex items-center gap-4 transition-all duration-200 ${isSelected ? 'bg-white text-black' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/60'} ${className}`}
    >
        {children}
        <span className="font-semibold">{text}</span>
    </button>
));


// --- Step 1: Gender ---
const GENDERS = ['Masculino', 'Feminino', 'Outro'];

const GenderScreen: React.FC<{value: string; onSelect: (value: string) => void}> = ({ value, onSelect }) => (
    <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Escolha seu gênero</h1>
        <p className="text-gray-400 mb-8 max-w-xs mx-auto">Isso será usado para calibrar seu plano personalizado.</p>
        <div className="space-y-3">
            {GENDERS.map(gender => (
                <OptionButton key={gender} text={gender} isSelected={value === gender} onClick={() => onSelect(gender)} className="justify-center"/>
            ))}
        </div>
    </div>
);

// --- Step 2: Objective ---
const OBJECTIVES = ['Perder peso', 'Manter', 'Ganhar peso'];
const ObjectiveScreen: React.FC<{value: string; onSelect: (value: string) => void}> = ({ value, onSelect }) => (
    <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Qual é o seu objetivo?</h1>
        <p className="text-gray-400 mb-8 max-w-xs mx-auto">Isso nos ajuda a gerar um plano para sua ingestão de calorias.</p>
        <div className="space-y-3">
            {OBJECTIVES.map(obj => (
                <OptionButton key={obj} text={obj} isSelected={value === obj} onClick={() => onSelect(obj)} className="justify-center"/>
            ))}
        </div>
    </div>
);

// --- Step 3: Workout Frequency ---
const WORKOUTS = [
    { value: '0-2', label: 'Treinos de vez em quando', icon: <WorkoutFrequencyIconOne /> },
    { value: '3-5', label: 'Alguns treinos por semana', icon: <WorkoutFrequencyIconTwo /> },
    { value: '6+', label: 'Atleta dedicado', icon: <WorkoutFrequencyIconThree /> },
];
const WorkoutFrequencyScreen: React.FC<{value: string; onSelect: (value: string) => void}> = ({ value, onSelect }) => (
    <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Quantos treinos você faz por semana?</h1>
        <p className="text-gray-400 mb-8 max-w-xs mx-auto">Isso será usado para calibrar seu plano personalizado.</p>
        <div className="space-y-3">
            {WORKOUTS.map(item => (
                <OptionButton key={item.value} text="" isSelected={value === item.value} onClick={() => onSelect(item.value)}>
                    <div className={`w-8 h-8 flex items-center justify-center transition-colors ${value === item.value ? 'text-black' : 'text-gray-400'}`}>
                        {item.icon}
                    </div>
                    <div>
                        <p className="font-bold">{item.value}</p>
                        <p className="text-sm font-normal -mt-1">{item.label}</p>
                    </div>
                </OptionButton>
            ))}
        </div>
    </div>
);


// --- Step 4: Obstacles ---
const OBSTACLES = [
    { text: 'Falta de consistência', icon: <ObstacleConsistencyIcon className="w-6 h-6" /> },
    { text: 'Hábitos alimentares não saudáveis', icon: <ObstacleHabitsIcon className="w-6 h-6" /> },
    { text: 'Falta de apoio', icon: <HeartIcon className="w-6 h-6" /> },
    { text: 'Agenda lotada', icon: <ObstacleScheduleIcon className="w-6 h-6" /> },
    { text: 'Falta de inspiração para refeições', icon: <ObstacleInspirationIcon className="w-6 h-6" /> },
];

const ObstaclesScreen: React.FC<{value: string; onSelect: (value: string) => void}> = ({ value, onSelect }) => (
     <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">O que está impedindo você de atingir seus objetivos?</h1>
        <div className="space-y-3">
            {OBSTACLES.map(item => (
                <OptionButton key={item.text} text={item.text} isSelected={value === item.text} onClick={() => onSelect(item.text)}>
                    <div className={`transition-colors ${value === item.text ? 'text-black' : 'text-gray-400'}`}>
                        {item.icon}
                    </div>
                </OptionButton>
            ))}
        </div>
    </div>
);


// --- Step 5: All Set ---
const AllSetScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="relative w-48 h-48 mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500/10 to-blue-500/10 animate-pulse"></div>
            <div className="absolute inset-2 bg-[#0C0C0E] rounded-full"></div>
            <svg viewBox="0 0 100 100" className="absolute inset-0">
                {Array.from({length: 12}).map((_, i) => (
                    <circle key={i} cx="50" cy="50" r="45" fill="none" stroke="#4B5563" strokeWidth="1" strokeDasharray="1 7.85" strokeDashoffset={i * -8.85} transform="rotate(-90 50 50)"/>
                ))}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-5xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.7 9.63c.43-1.22 1.3-2.29 2.4-3.08a4.5 4.5 0 1 1-6.06 6.06c.79-1.1 1.86-1.97 3.08-2.4l.58-.28zM17.15 13.5c-.8-.21-1.54-.58-2.18-1.08l-.58-.46a1 1 0 0 0-1.29.13c-.32.32-.47.75-.42 1.17l.25 2.2a1 1 0 0 1-.37.91l-1.14 1.14c-.9.9-2.12 1.4-3.41 1.4-2.65 0-4.8-2.15-4.8-4.8s2.15-4.8 4.8-4.8c1.29 0 2.51.5 3.41 1.4l1.14 1.14a1 1 0 0 1 .91-.37l2.2.25c.42.05.85-.1 1.17-.42a1 1 0 0 0 .13-1.29l-.46-.58c-.5-.64-.87-1.38-1.08-2.18a7.5 7.5 0 1 0-7.7 10.15A7.5 7.5 0 0 0 17.15 13.5z"/>
                    <path fill="#F43F5E" d="M19.46 3.04a2 2 0 0 0-2.83 0l-1.06 1.06-1.06 1.06a2 2 0 0 0 0 2.83l.71.71c.05.05.12.05.18 0l2.12-2.12c.05-.05.05-.12 0-.18l-.71-.71z"/>
                </svg>
            </div>
        </div>

        <p className="flex items-center gap-2 font-semibold text-green-400 mb-2">
            <CheckCircleIcon className="w-5 h-5"/>
            Tudo pronto!
        </p>
        <h1 className="text-3xl font-bold max-w-xs mx-auto">Hora de gerar o seu plano personalizado!</h1>
    </div>
);

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [userData, setUserData] = useState<Partial<OnboardingData>>({
        goal: 'Ganhar peso',
        workoutFrequency: '3-5',
        obstacle: 'Agenda lotada',
        howHeard: '', // Added howHeard to the initial state
    });
    const [isExiting, setIsExiting] = useState(false);

    const handleNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
    const handleBack = () => setStep(s => Math.max(s - 1, 0));

    const steps = [
        <GenderScreen key={0} value={userData.gender!} onSelect={(v) => setUserData(p => ({...p, gender: v}))} />,
        <ObjectiveScreen key={1} value={userData.goal!} onSelect={(v) => setUserData(p => ({...p, goal: v}))} />,
        <WorkoutFrequencyScreen key={2} value={userData.workoutFrequency!} onSelect={(v) => setUserData(p => ({...p, workoutFrequency: v}))} />,
        <ObstaclesScreen key={3} value={userData.obstacle!} onSelect={(v) => setUserData(p => ({...p, obstacle: v}))} />,
        <AllSetScreen key={4} />,
    ];

    const currentStepComponent = steps[step];
    const isLastStep = step === steps.length - 1;
    const isFirstStep = step === 0;

    const handleContinue = () => {
        if (!isLastStep) {
            handleNext();
        } else {
            setIsExiting(true);
            setTimeout(() => {
                onComplete(userData as OnboardingData);
            }, 500);
        }
    };

    return (
        <div className={`bg-[#0C0C0E] min-h-screen text-white transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
            <OnboardingWrapper 
                step={step} 
                totalSteps={steps.length} 
                onBack={handleBack} 
                onContinue={handleContinue}
                isFirstStep={isFirstStep}
            >
                {currentStepComponent}
            </OnboardingWrapper>
        </div>
    );
};

export default OnboardingFlow;