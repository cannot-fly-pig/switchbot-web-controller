import React, { useState } from 'react';
import { AnySwitchBotDevice } from '../types/switchbot';
import { MinusIcon, PlusIcon, PowerIcon, ChevronDownIcon } from './icons';

interface AirConditionerRemoteProps {
    device: AnySwitchBotDevice;
    onCommand: (command: string, parameter?: any) => void;
    isLoading: boolean;
}

// Mode values: 1 (Auto), 2 (Cool), 3 (Dry), 4 (Fan), 5 (Heat)
const modes = [ { value: 1, label: 'Auto' }, { value: 2, label: 'Cool' }, { value: 3, label: 'Dry' }, { value: 4, label: 'Fan' }, { value: 5, label: 'Heat' }];
// Fan speed values: 1 (Auto), 2 (Low), 3 (Medium), 4 (High)
const fanSpeeds = [ { value: 1, label: 'Auto' }, { value: 2, label: 'Low' }, { value: 3, label: 'Medium' }, { value: 4, label: 'High' }];


export const AirConditionerRemote: React.FC<AirConditionerRemoteProps> = ({ device, onCommand, isLoading }) => {
    const [temp, setTemp] = useState(22);
    const [mode, setMode] = useState(1); // Default to Auto
    const [fanSpeed, setFanSpeed] = useState(1); // Default to Auto

    const sendAcCommand = (powerState: 'on' | 'off') => {
        const parameter = `${temp},${mode},${fanSpeed},${powerState}`;
        onCommand('setAll', parameter);
    };

    const handleTempChange = (delta: number) => {
        const newTemp = temp + delta;
        if (newTemp >= 16 && newTemp <= 30) {
            setTemp(newTemp);
            // Changing temp implies turning the AC on with the new setting
            const parameter = `${newTemp},${mode},${fanSpeed},on`;
            onCommand('setAll', parameter);
        }
    };
    
    const handleSettingChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        setter(value);
        let newTemp = temp, newMode = mode, newFanSpeed = fanSpeed;
        if(setter === setMode) newMode = value;
        if(setter === setFanSpeed) newFanSpeed = value;

        const parameter = `${newTemp},${newMode},${newFanSpeed},on`;
        onCommand('setAll', parameter);
    }

    const controlButtonClasses = "p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors disabled:opacity-50";
    
    return (
        <div className="space-y-3">
             <div className="flex justify-between items-center">
                 <span className="font-medium">Power</span>
                 <div className="flex space-x-2">
                     <button onClick={() => sendAcCommand('on')} disabled={isLoading} className={`${controlButtonClasses} text-green-400`}><PowerIcon className="h-5 w-5"/></button>
                     <button onClick={() => sendAcCommand('off')} disabled={isLoading} className={`${controlButtonClasses} text-red-400`}><PowerIcon className="h-5 w-5"/></button>
                 </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium">Temperature</span>
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleTempChange(-1)} disabled={isLoading} className={controlButtonClasses}>
                        <MinusIcon className="h-5 w-5" />
                    </button>
                    <span className="text-lg font-mono w-12 text-center">{temp}°C</span>
                    <button onClick={() => handleTempChange(1)} disabled={isLoading} className={controlButtonClasses}>
                        <PlusIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
             <div className="flex justify-between items-center">
                <label htmlFor="ac-mode" className="font-medium">Mode</label>
                <div className="relative w-28">
                    <select id="ac-mode" value={mode} onChange={(e) => handleSettingChange(setMode, parseInt(e.target.value))} disabled={isLoading} className="w-full appearance-none bg-gray-700 border-gray-600 rounded-md py-1 px-3 text-white pr-8 focus:ring-blue-500 focus:border-blue-500">
                       {modes.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <ChevronDownIcon className="h-4 w-4" />
                    </div>
                </div>
            </div>
             <div className="flex justify-between items-center">
                <label htmlFor="ac-fan" className="font-medium">Fan Speed</label>
                <div className="relative w-28">
                    <select id="ac-fan" value={fanSpeed} onChange={(e) => handleSettingChange(setFanSpeed, parseInt(e.target.value))} disabled={isLoading} className="w-full appearance-none bg-gray-700 border-gray-600 rounded-md py-1 px-3 text-white pr-8 focus:ring-blue-500 focus:border-blue-500">
                       {fanSpeeds.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <ChevronDownIcon className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </div>
    );
};