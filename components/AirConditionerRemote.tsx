
import React from 'react';
import { AnySwitchBotDevice } from '../types/switchbot';

interface AirConditionerRemoteProps {
    device: AnySwitchBotDevice;
    onCommand: (command: string, parameter?: any) => void;
    isLoading: boolean;
}

export const AirConditionerRemote: React.FC<AirConditionerRemoteProps> = ({ device, onCommand, isLoading }) => {
    
    // Example state for AC controls. The API uses a complex parameter string.
    // e.g., "30,2,1,on" for 30°C, Auto, Fan speed 1, Power On.
    // For simplicity, we'll offer basic commands.

    const handleAcCommand = (power: 'on' | 'off') => {
        // A very basic example. Real implementation would need to build the parameter string.
        // Assuming default values for temp, mode, fan speed.
        const parameter = `25,2,1,${power}`; 
        onCommand('setAll', parameter);
    };

    return (
        <div className="space-y-2">
            <p className="text-sm text-gray-400">Basic AC Controls:</p>
            <div className="flex gap-2">
                <button
                    onClick={() => handleAcCommand('on')}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600"
                >
                    Turn On
                </button>
                <button
                    onClick={() => handleAcCommand('off')}
                    disabled={isLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600"
                >
                    Turn Off
                </button>
            </div>
            <p className="text-xs text-gray-500">Note: AC remote implementation is simplified. Uses default settings (25°C, Auto).</p>
        </div>
    );
};
