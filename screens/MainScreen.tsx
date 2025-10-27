import React, { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { DeviceCard } from '../components/DeviceCard';
import { SettingsIcon } from '../components/icons';

interface MainScreenProps {
    onNavigateToSettings: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({ onNavigateToSettings }) => {
    const { allDevices, displayedDeviceIds } = useContext(SettingsContext);

    const devicesToDisplay = allDevices.filter(device => displayedDeviceIds.includes(device.deviceId));

    return (
        <div className="w-screen min-h-screen bg-gray-800 text-white p-4 sm:p-6">
            <header className="flex justify-between items-center mb-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold">SwitchBot Dashboard</h1>
                <button 
                    onClick={onNavigateToSettings} 
                    className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                    aria-label="Go to settings"
                >
                    <SettingsIcon className="h-6 w-6" />
                </button>
            </header>
            <main className="max-w-7xl mx-auto">
                {devicesToDisplay.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {devicesToDisplay.map(device => (
                            <DeviceCard key={device.deviceId} device={device} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-gray-900 p-8 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">No Devices to Display</h2>
                        <p className="text-gray-400 mb-4">
                            Go to settings to fetch your devices and select which ones to show on the dashboard.
                        </p>
                        <button 
                            onClick={onNavigateToSettings} 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Go to Settings
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};
