
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { getDevices } from '../services/switchbotService';
import { AnySwitchBotDevice } from '../types/switchbot';
import { DeviceCard } from '../components/DeviceCard';
import { Spinner } from '../components/ui/Spinner';
import { GearIcon } from '../components/icons';

interface MainScreenProps {
    onNavigateToSettings: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({ onNavigateToSettings }) => {
    const settings = useContext(SettingsContext);
    const [devices, setDevices] = useState<AnySwitchBotDevice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDevices = useCallback(async () => {
        if (!settings?.token || !settings?.secret) {
            setError("API Token and Secret are not set.");
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        setError(null);
        try {
            const deviceList = await getDevices(settings.token, settings.secret, settings.proxyUrl);
            setDevices(deviceList);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [settings]);

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center text-center text-white h-64">
                    <Spinner />
                    <p className="mt-4">Fetching devices...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center text-red-400 p-4 bg-red-900/50 rounded-lg">
                    <p><strong>Error:</strong> {error}</p>
                    <button onClick={onNavigateToSettings} className="mt-2 text-white underline">Go to Settings</button>
                </div>
            );
        }

        if (devices.length === 0) {
            return (
                <div className="text-center text-gray-400">
                    <p>No devices found.</p>
                    <button onClick={fetchDevices} className="mt-2 text-white underline">Refresh</button>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map(device => (
                    <DeviceCard key={device.deviceId} device={device} />
                ))}
            </div>
        );
    }

    return (
        <div className="bg-gray-800 min-h-screen text-white p-4">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">SwitchBot Control</h1>
                <button onClick={onNavigateToSettings} className="p-2 text-gray-300 hover:text-white">
                    <GearIcon className="h-6 w-6" />
                </button>
            </header>
            <main>
                {renderContent()}
            </main>
        </div>
    );
};
