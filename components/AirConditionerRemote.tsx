import React, { useState, useEffect } from 'react';
import type { AnySwitchBotDevice } from '../types/switchbot';
import { PowerIcon } from './icons';

interface AirConditionerRemoteProps {
  device: AnySwitchBotDevice;
  status: any;
  onCommand: (command: string, parameter?: any) => void;
  isLoading: boolean;
}

export const AirConditionerRemote: React.FC<AirConditionerRemoteProps> = ({ device, status, onCommand, isLoading }) => {
    // Default state if status is not available
    const powerState = status?.power || 'off';
    const temp = status?.temperature || 22;
    const mode = status?.mode || 1; // 1:auto, 2:cool, 3:dry, 4:fan, 5:heat
    const fanSpeed = status?.fanSpeed || 1; // 1:auto, 2:low, 3:medium, 4:high

    const [localTemp, setLocalTemp] = useState(temp);

    useEffect(() => {
        setLocalTemp(temp);
    }, [temp]);

    const handlePowerToggle = () => {
        const newPowerState = powerState === 'on' ? 'off' : 'on';
        onCommand('setAll', `${localTemp},${mode},${fanSpeed},${newPowerState}`);
    };

    const handleTempChange = (delta: number) => {
        const newTemp = localTemp + delta;
        setLocalTemp(newTemp);
        onCommand('setAll', `${newTemp},${mode},${fanSpeed},${powerState}`);
    };

    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMode = e.target.value;
        onCommand('setAll', `${localTemp},${newMode},${fanSpeed},${powerState}`);
    };

    const handleFanSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFanSpeed = e.target.value;
        onCommand('setAll', `${localTemp},${mode},${newFanSpeed},${powerState}`);
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
                  className={`p-2 rounded-full transition-colors ${powerState === 'on' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'} disabled:opacity-50`}>
                  <PowerIcon className="h-6 w-6" />
                </button>
            </div>
            
            <div className="flex items-center justify-between">
                <span className="font-medium">Temperature</span>
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleTempChange(-1)} disabled={isLoading || powerState === 'off'} className="px-3 py-1 bg-gray-600 rounded-md disabled:opacity-50">-</button>
                    <span className="text-lg font-semibold w-8 text-center">{localTemp}°C</span>
                    <button onClick={() => handleTempChange(1)} disabled={isLoading || powerState === 'off'} className="px-3 py-1 bg-gray-600 rounded-md disabled:opacity-50">+</button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <label htmlFor={`mode-${device.deviceId}`} className="font-medium">Mode</label>
                <select 
                    id={`mode-${device.deviceId}`}
                    value={mode}
                    onChange={handleModeChange}
                    disabled={isLoading || powerState === 'off'}
                    className="bg-gray-700 border border-gray-600 rounded-md p-1 text-white"
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
                    disabled={isLoading || powerState === 'off'}
                    className="bg-gray-700 border border-gray-600 rounded-md p-1 text-white"
                >
                    {Object.entries(fanSpeedOptions).map(([value, name]) => <option key={value} value={value}>{name}</option>)}
                </select>
            </div>
        </div>
    );
};
