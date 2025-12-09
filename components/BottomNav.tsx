import React from 'react';
import { HomeIcon, AnalyticsIcon, WaterDropIcon, PlusIcon, UserIcon } from './Icons';

interface BottomNavProps {
  activeNav: 'Início' | 'Análises' | 'Drink';
  setActiveNav: (nav: 'Início' | 'Análises' | 'Drink') => void;
  onAddMealClick: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick }) => {
  const color = active ? 'text-white' : 'text-[#9CA3AF]';
  return (
    <button onClick={onClick} className={`relative flex flex-col items-center justify-center space-y-1 ${color} hover:text-white transition-colors duration-200 outline-none w-20`}>
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out`}>
        {active && <div className="w-16 h-8 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-full blur-md"></div>}
      </div>
      <div className={`p-2 transition-transform duration-200 ease-in-out hover:scale-110 ${active ? 'scale-110' : 'scale-100'}`}>
        {icon}
      </div>
      <span className="text-xs font-semibold">{label}</span>
      {active && <div className="absolute -bottom-1 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_theme(colors.cyan.400)]"></div>}
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeNav, setActiveNav, onAddMealClick }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-lg border-t border-white/10 z-50">
      <div className="container mx-auto max-w-lg">
        <nav className="flex justify-around items-center h-20">
          <NavItem icon={<HomeIcon className="w-7 h-7" />} label="Início" active={activeNav === 'Início'} onClick={() => setActiveNav('Início')} />
          <NavItem icon={<AnalyticsIcon className="w-7 h-7" />} label="Análises" active={activeNav === 'Análises'} onClick={() => setActiveNav('Análises')} />

          <NavItem icon={<WaterDropIcon className="w-7 h-7" />} label="Drink" active={activeNav === 'Drink'} onClick={() => setActiveNav('Drink')} />

          <div className="w-20 flex justify-center -mt-8">
            <button
              onClick={onAddMealClick}
              className="w-16 h-16 btn-physical-primary rounded-full flex items-center justify-center text-white border-2 border-[#18181b] relative z-10"
              aria-label="Adicionar nova refeição"
            >
              <PlusIcon className="w-8 h-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            </button>
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default React.memo(BottomNav);