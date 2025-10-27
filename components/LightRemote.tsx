import React from 'react';
import type { AnySwitchBotDevice } from '../types/switchbot';
import { PowerIcon } from './icons';

interface LightRemoteProps {
  device: AnySwitchBotDevice;
  status: any;
  onCommand: (command: string, parameter?: any) => void;
  isLoading: boolean;
}

export const LightRemote: React.FC<LightRemoteProps> = ({ device, status, onCommand, isLoading }) => {
  const power = status?.power;
  const brightness = status?.brightness;

  const handleTogglePower = () => {
    onCommand(power === 'on' ? 'turnOff' : 'turnOn');
  };

  const handleSetBrightness = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBrightness = parseInt(e.target.value, 10);
    onCommand('setBrightness', newBrightness);
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
      {typeof brightness !== 'undefined' && (
        <div className="flex flex-col">
          <label htmlFor={`brightness-${device.deviceId}`} className="mb-2 font-medium">Brightness: {brightness}%</label>
          <input
            id={`brightness-${device.deviceId}`}
            type="range"
            min="1"
            max="100"
            value={brightness}
            onMouseUp={handleSetBrightness} // Send command when user releases the slider
            onTouchEnd={handleSetBrightness}
            disabled={isLoading || power !== 'on'}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
      )}
    </div>
  );
};
