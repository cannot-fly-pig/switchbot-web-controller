import React, { useState } from 'react';
import type { AnySwitchBotDevice } from '../types/switchbot';
import { PowerIcon, PlusIcon, MinusIcon } from './icons';

interface AirConditionerRemoteProps {
  device: AnySwitchBotDevice;
  onCommand: (command: string, parameter?: any) => void;
  isLoading: boolean;
}

export const AirConditionerRemote: React.FC<AirConditionerRemoteProps> = ({ device, onCommand, isLoading }) => {
    const [power, setPower] = useState<'on' | 'off'>('off');
    const [temp, setTemp] = useState(22);
    const [mode, setMode] = useState(1); // 1:auto, 2:cool, 3:dry, 4:fan, 5:heat
    const [fanSpeed, setFanSpeed] = useState(1); // 1:auto, 2:low, 3:medium, 4:high

    const sendAcCommand = (newTemp: number, newMode: number, newFanSpeed: number, newPower: 'on' | 'off') => {
        onCommand('setAll', `${newTemp},${newMode},${newFanSpeed},${newPower}`);
    };

    const handlePowerToggle = () => {
        const newPowerState = power === 'on' ? 'off' : 'on';
        setPower(newPowerState);
        sendAcCommand(temp, mode, fanSpeed, newPowerState);
    };

    const handleTempChange = (delta: number) => {
        const newTemp = temp + delta;
        setTemp(newTemp);
        sendAcCommand(newTemp, mode, fanSpeed, power);
    };

    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMode = parseInt(e.target.value, 10);
        setMode(newMode);
        sendAcCommand(temp, newMode, fanSpeed, power);
    };

    const handleFanSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFanSpeed = parseInt(e.target.value, 10);
        setFanSpeed(newFanSpeed);
        sendAcCommand(temp, mode, newFanSpeed, power);
    };

    const modeOptions = { '1': 'Auto', '2': 'Cool', '3': 'Dry', '4': 'Fan', '5': 'Heat' };
    const fanSpeedOptions = { '1': 'Auto', '2': 'Low', '3': 'Medium', '4': 'High' };

    return (
        <div className="space-y-4">
             <div className="flex items-center justify-between">
                <span className="font-medium">Power</span>
                <button 
                  onClick={handlePowerToggle} 
                  disabled={isLoading}
                  className={`p-2 rounded-full transition-colors ${power === 'on' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'} disabled:opacity-50`}>
                  <PowerIcon className="h-6 w-6" />
                </button>
            </div>
            
            <div className="flex items-center justify-between">
                <span className="font-medium">Temperature</span>
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleTempChange(-1)} disabled={isLoading || power === 'off'} className="p-1 bg-gray-600 rounded-md disabled:opacity-50">
                        <MinusIcon className="h-5 w-5" />
                    </button>
                    <span className="text-lg font-semibold w-12 text-center">{temp}°C</span>
                    <button onClick={() => handleTempChange(1)} disabled={isLoading || power === 'off'} className="p-1 bg-gray-600 rounded-md disabled:opacity-50">
                        <PlusIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <label htmlFor={`mode-${device.deviceId}`} className="font-medium">Mode</label>
                <select 
                    id={`mode-${device.deviceId}`}
                    value={mode}
                    onChange={handleModeChange}
                    disabled={isLoading || power === 'off'}
                    className="bg-gray-700 border border-gray-600 rounded-md p-1 text-white disabled:opacity-50"
                >
                    {Object.entries(modeOptions).map(([value, name]) => <option key={value} value={value}>{name}</option>)}
                </select>
            </div>

            <div className="flex items-center justify-between">
                <label htmlFor={`fan-${device.deviceId}`} className="font-medium">Fan Speed</label>
                <select 
                    id={`fan-${device.deviceId}`}
                    value={fanSpeed}
                    onChange={handleFanSpeedChange}
                    disabled={isLoading || power === 'off'}
                    className="bg-gray-700 border border-gray-600 rounded-md p-1 text-white disabled:opacity-50"
                >
                    {Object.entries(fanSpeedOptions).map(([value, name]) => <option key={value} value={value}>{name}</option>)}
                </select>
            </div>
        </div>
    );
};