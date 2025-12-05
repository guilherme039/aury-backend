import React from 'react';
import { Meal } from '../types';
import { ProteinIcon, CarbsIcon, FatIcon, FireIcon } from './Icons';

interface MealCardProps {
  meal: Meal;
  onClick: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full bg-[#1A1A1D] p-4 rounded-2xl flex items-start space-x-4 text-left hover:bg-[#252528] transition-all duration-200 active:scale-[0.98] border border-gray-800/50 group animate-fade-in"
      style={{animation: `fade-in 0.5s ease-out forwards`}}>
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-white truncate text-lg">{meal.name}</h4>
          <span className="text-xs text-[#9CA3AF] bg-[#0C0C0E] px-2 py-1 rounded-full flex-shrink-0 ml-2 border border-gray-700">
            {meal.time}
          </span>
        </div>
        
        <div className="flex items-center space-x-1 text-[#9CA3AF] mt-1 text-sm">
            <FireIcon className="w-4 h-4 text-[#F59E0B]" />
            <span>{meal.nutrition.calories} kcal</span>
        </div>
        <p className="text-xs text-cyan-400/50 mt-1">Foto Detectada por IA</p>
        
        <div className="flex items-center justify-between mt-3 text-sm text-[#9CA3AF]">
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-[#F43F5E]"></div>
            <span>{meal.nutrition.protein}g P</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
            <span>{meal.nutrition.carbs}g C</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
            <span>{meal.nutrition.fat}g G</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default React.memo(MealCard);
