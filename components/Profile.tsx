import React, { useState, useRef, ChangeEvent } from 'react';
import { UserIcon, PencilIcon, CakeIcon, ScaleIcon, RulerIcon } from './Icons';
import { UserProfileData } from '../types';

const initialProfile: UserProfileData = {
    name: 'John Doe',
    photoUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    goal: 'Definição Muscular',
    age: 28,
    weight: 75,
    height: 180,
}

const Header = () => (
    <div className="flex items-center space-x-3">
        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 shadow-inner">
            <UserIcon className="w-6 h-6 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold">Perfil</h1>
    </div>
);

const ProfilePhoto = ({ isEditing, photoUrl, onPhotoChange, fileInputRef }: { isEditing: boolean, photoUrl: string, onPhotoChange: (e: ChangeEvent<HTMLInputElement>) => void, fileInputRef: React.RefObject<HTMLInputElement>}) => (
    <div className="relative w-28 h-28 mx-auto z-10">
        <img src={photoUrl} alt="Foto do Perfil" className="w-full h-full rounded-full border-4 border-[#1A1B1E] object-cover" />
        {isEditing && (
            <>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={onPhotoChange} className="hidden" />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white text-xs font-semibold opacity-0 hover:opacity-100 transition-opacity"
                >
                    Alterar Foto
                </button>
            </>
        )}
    </div>
);

const StatCard = ({ icon, label, value, unit, name, isEditing, onChange }: {icon: React.ReactNode, label: string, value: number | string, unit: string, name: string, isEditing: boolean, onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="bg-[#1A1B1E]/80 p-4 rounded-2xl text-center space-y-2 border border-gray-800/80">
        {icon}
        <p className="text-xs text-gray-400">{label}</p>
        {isEditing ? (
             <input 
                type="number"
                name={name}
                value={value}
                onChange={onChange}
                className="text-xl font-bold bg-gray-700/50 text-center rounded-lg p-1 w-full"
             />
        ) : (
            <p className="text-xl font-bold">{value || '-'} <span className="text-sm text-gray-500">{value ? unit : ''}</span></p>
        )}
    </div>
);


const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfileData>(initialProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<UserProfileData>(initialProfile);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEditToggle = () => {
        if (isEditing) {
            setEditData(profile);
        }
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        // Validate inputs before saving
        const newAge = parseInt(String(editData.age), 10);
        const newWeight = parseFloat(String(editData.weight));
        const newHeight = parseInt(String(editData.height), 10);

        const updatedData = { ...editData };

        if (isNaN(newAge) || newAge < 1 || newAge > 120) {
            updatedData.age = profile.age; // Revert if invalid
        } else {
            updatedData.age = newAge;
        }

        if (isNaN(newWeight) || newWeight <= 0) {
            updatedData.weight = profile.weight; // Revert if invalid
        } else {
            updatedData.weight = newWeight;
        }

        if (isNaN(newHeight) || newHeight <= 0) {
            updatedData.height = profile.height; // Revert if invalid
        } else {
            updatedData.height = newHeight;
        }
        
        setProfile(updatedData);
        setEditData(updatedData);
        setIsEditing(false);
    };


    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({...prev, [name]: value}));
    }

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const newPhotoUrl = URL.createObjectURL(file);
            setEditData(prev => ({...prev, photoUrl: newPhotoUrl}));
        }
    }
    
  return (
    <div 
        className="text-white p-2 space-y-6 animate-fade-in"
    >
      <Header />
      
      <div className="space-y-6">
        <ProfilePhoto 
            isEditing={isEditing} 
            photoUrl={editData.photoUrl} 
            onPhotoChange={handlePhotoChange} 
            fileInputRef={fileInputRef}
        />
        
        <div className="text-center -mt-12 pt-14 bg-[#1A1B1E]/80 backdrop-blur-lg border border-gray-800/80 rounded-2xl p-4 shadow-xl shadow-black/40">
            {isEditing ? (
                 <input 
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    className="text-2xl font-bold bg-gray-700/50 text-center rounded-lg p-1 w-full"
                 />
            ) : (
                <h2 className="text-2xl font-bold">{profile.name}</h2>
            )}

            {isEditing ? (
                <input
                    type="text"
                    name="goal"
                    value={editData.goal}
                    onChange={handleInputChange}
                    className="text-sm text-cyan-400 bg-gray-700/50 text-center rounded-lg p-1 mt-1 w-3/4"
                />
            ) : (
                <p className="text-sm text-cyan-400">Meta: {profile.goal}</p>
            )}
        </div>

        <div className="grid grid-cols-3 gap-4">
            <StatCard 
                icon={<CakeIcon className="w-6 h-6 text-purple-400"/>} 
                label="Idade" 
                value={isEditing ? editData.age : profile.age}
                unit="anos"
                name="age"
                isEditing={isEditing}
                onChange={handleInputChange}
            />
            <StatCard 
                icon={<ScaleIcon className="w-6 h-6 text-green-400"/>} 
                label="Peso" 
                value={isEditing ? editData.weight : profile.weight}
                unit="kg"
                name="weight"
                isEditing={isEditing}
                onChange={handleInputChange}
            />
             <StatCard 
                icon={<RulerIcon className="w-6 h-6 text-yellow-400"/>} 
                label="Altura" 
                value={isEditing ? editData.height : profile.height}
                unit="cm"
                name="height"
                isEditing={isEditing}
                onChange={handleInputChange}
            />
        </div>

        <div className="flex gap-4">
            {isEditing ? (
                <>
                    <button onClick={handleEditToggle} className="flex-1 bg-gray-700/80 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors border border-gray-600">Cancelar</button>
                    <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-500 transition-colors">Salvar</button>
                </>
            ) : (
                <button onClick={handleEditToggle} className="w-full flex items-center justify-center gap-2 border-2 border-blue-500/30 text-blue-400/80 font-bold py-3 rounded-xl hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-400 transition-colors">
                    <PencilIcon className="w-5 h-5" />
                    Editar Perfil
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Profile;