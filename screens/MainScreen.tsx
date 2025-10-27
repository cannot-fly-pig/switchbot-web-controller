
import React, { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { DeviceCard } from '../components/DeviceCard';
import { SettingsIcon } from '../components/icons';

interface MainScreenProps {
  onNavigateToSettings: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({ onNavigateToSettings }) => {
    const { token, secret, allDevices, displayedDeviceIds } = useContext(SettingsContext);
    
    const devicesToShow = allDevices.filter(d => displayedDeviceIds.includes(d.deviceId));

    const hasCredentials = token && secret;

    return (
        <div className="w-screen h-screen bg-gray-900 flex flex-col p-4 overflow-hidden">
            <header className="flex justify-between items-center mb-4 flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">SwitchBot Controller</h1>
                <button onClick={onNavigateToSettings} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                    <SettingsIcon className="w-6 h-6 text-gray-300"/>
                </button>
            </header>
            
            {!hasCredentials ? (
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center bg-gray-800 p-8 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
                        <p className="text-gray-400 mb-4">Please set your API Token and Secret in the settings.</p>
                        <button onClick={onNavigateToSettings} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Go to Settings
                        </button>
                    </div>
                </div>
            ) : devicesToShow.length === 0 ? (
                 <div className="flex-grow flex items-center justify-center">
                    <div className="text-center bg-gray-800 p-8 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">No Devices Selected</h2>
                        <p className="text-gray-400 mb-4">Go to settings to fetch and select devices to display.</p>
                        <button onClick={onNavigateToSettings} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Go to Settings
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-grow flex items-center overflow-x-auto pb-4">
                    <div className="flex items-center space-x-4 px-2">
                        {devicesToShow.map(device => (
                            <DeviceCard key={device.deviceId} device={device} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
