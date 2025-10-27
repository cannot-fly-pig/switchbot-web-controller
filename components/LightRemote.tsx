import React, { useState } from 'react';
import type { AnySwitchBotDevice } from '../types/switchbot';
import { PowerIcon, PlusIcon, MinusIcon } from './icons';

interface LightRemoteProps {
  device: AnySwitchBotDevice;
  onCommand: (command: string, parameter?: any) => void;
  isLoading: boolean;
}

export const LightRemote: React.FC<LightRemoteProps> = ({ device, onCommand, isLoading }) => {
  const [power, setPower] = useState<'on' | 'off'>('off');

  const handleTogglePower = () => {
    const newCommand = power === 'on' ? 'turnOff' : 'turnOn';
    onCommand(newCommand);
    setPower(p => p === 'on' ? 'off' : 'on'); // Optimistically update UI
  };

  const handleBrightnessUp = () => {
    onCommand('brightnessUp');
  };

  const handleBrightnessDown = () => {
    onCommand('brightnessDown');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">Power</span>
        <button 
          onClick={handleTogglePower} 
          disabled={isLoading}
          className={`p-2 rounded-full transition-colors ${power === 'on' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'} disabled:opacity-50`}>
          <PowerIcon className="h-6 w-6" />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="font-medium">Brightness</span>
        <div className="flex items-center space-x-2">
            <button onClick={handleBrightnessDown} disabled={isLoading || power === 'off'} className="p-1 bg-gray-600 rounded-md disabled:opacity-50">
                <MinusIcon className="h-5 w-5" />
            </button>
            <button onClick={handleBrightnessUp} disabled={isLoading || power === 'off'} className="p-1 bg-gray-600 rounded-md disabled:opacity-50">
                <PlusIcon className="h-5 w-5" />
            </button>
        </div>
      </div>
    </div>
  );
};