
import React from 'react';
import { AnySwitchBotDevice } from '../types/switchbot';

interface LightRemoteProps {
    device: AnySwitchBotDevice;
    onCommand: (command: string, parameter?: any) => void;
    isLoading: boolean;
}

export const LightRemote: React.FC<LightRemoteProps> = ({ device, onCommand, isLoading }) => {
    return (
        <div className="flex gap-2">
            <button
                onClick={() => onCommand('turnOn')}
                disabled={isLoading}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600"
            >
                Turn On
            </button>
            <button
                onClick={() => onCommand('turnOff')}
                disabled={isLoading}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600"
            >
                Turn Off
            </button>
        </div>
    );
};
