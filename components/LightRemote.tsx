import React from 'react';
import { AnySwitchBotDevice } from '../types/switchbot';
import { MoonIcon, PlusIcon, MinusIcon, PowerIcon } from './icons';

interface LightRemoteProps {
    device: AnySwitchBotDevice;
    onCommand: (command: string, parameter?: any) => void;
    isLoading: boolean;
}

export const LightRemote: React.FC<LightRemoteProps> = ({ device, onCommand, isLoading }) => {
    
    const buttonBaseClasses = "flex-1 flex justify-center items-center py-2 px-3 rounded-lg transition-colors disabled:bg-gray-600 disabled:text-gray-400";
    
    return (
        <div className="space-y-3">
             <div className="flex gap-2">
                <button
                    onClick={() => onCommand('turnOn')}
                    disabled={isLoading}
                    className={`${buttonBaseClasses} bg-yellow-500 hover:bg-yellow-600 text-black font-bold`}
                >
                    <PowerIcon className="h-5 w-5 mr-1"/> On
                </button>
                <button
                    onClick={() => onCommand('turnOff')}
                    disabled={isLoading}
                    className={`${buttonBaseClasses} bg-gray-700 hover:bg-gray-600 text-white font-bold`}
                >
                    <PowerIcon className="h-5 w-5 mr-1"/> Off
                </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
                 <button
                    onClick={() => onCommand('brightnessDown')}
                    disabled={isLoading}
                    className={`${buttonBaseClasses} bg-gray-700 hover:bg-gray-600 text-white`}
                >
                    <MinusIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onCommand('brightnessUp')}
                    disabled={isLoading}
                    className={`${buttonBaseClasses} bg-gray-700 hover:bg-gray-600 text-white`}
                >
                    <PlusIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onCommand('setAll', '1')} // Assume brightness 1 for night light
                    disabled={isLoading}
                    className={`${buttonBaseClasses} bg-gray-700 hover:bg-gray-600 text-white`}
                    title="Night Light"
                >
                    <MoonIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};
