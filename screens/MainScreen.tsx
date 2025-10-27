import React, { useState, useEffect, useContext, useCallback } from 'react';
import { SettingsContext, CardSize } from '../context/SettingsContext';
import { getDevices, getScenes } from '../services/switchbotService';
import { AnySwitchBotDevice, Scene } from '../types/switchbot';
import { DeviceCard } from '../components/DeviceCard';
import { SceneCard } from '../components/SceneCard';
import { Spinner } from '../components/ui/Spinner';
import { GearIcon } from '../components/icons';

interface MainScreenProps {
    onNavigateToSettings: () => void;
}

const cardSizeToGridClass: Record<CardSize, string> = {
    sm: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
    md: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    lg: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export const MainScreen: React.FC<MainScreenProps> = ({ onNavigateToSettings }) => {
    const settings = useContext(SettingsContext);
    const [allDevices, setAllDevices] = useState<AnySwitchBotDevice[]>([]);
    const [allScenes, setAllScenes] = useState<Scene[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!settings.token || !settings.secret) {
            setError("API Token and Secret are not set.");
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        setError(null);
        try {
            const [deviceList, sceneList] = await Promise.all([
                getDevices(settings.token, settings.secret, settings.proxyUrl),
                getScenes(settings.token, settings.secret, settings.proxyUrl),
            ]);

            setAllDevices(deviceList);
            setAllScenes(sceneList);
            
            // On first run, select all devices and scenes by default
            if (settings.selectedDevices === null) {
                settings.setSelectedDevices(deviceList.map(d => d.deviceId));
            }
            if (settings.selectedScenes === null) {
                settings.setSelectedScenes(sceneList.map(s => s.sceneId));
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [settings.token, settings.secret, settings.proxyUrl, settings.selectedDevices, settings.selectedScenes, settings.setSelectedDevices, settings.setSelectedScenes]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const visibleDevices = allDevices.filter(device => settings.selectedDevices?.includes(device.deviceId));
    const visibleScenes = allScenes.filter(scene => settings.selectedScenes?.includes(scene.sceneId));

    const renderContent = () => {
        if (isLoading && allDevices.length === 0 && allScenes.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center text-center text-white h-64">
                    <Spinner />
                    <p className="mt-4">Fetching devices and scenes...</p>
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

        if (visibleDevices.length === 0 && visibleScenes.length === 0) {
            return (
                <div className="text-center text-gray-400">
                    <p>No devices or scenes selected to display.</p>
                    <button onClick={onNavigateToSettings} className="mt-2 text-white underline">Select items in Settings</button>
                </div>
            );
        }

        return (
             <>
                {visibleScenes.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">Scenes</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {visibleScenes.map(scene => (
                                <SceneCard key={scene.sceneId} scene={scene} />
                            ))}
                        </div>
                    </div>
                )}
                {visibleDevices.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-3">Devices</h2>
                        <div className={`grid ${cardSizeToGridClass[settings.cardSize]} gap-4`}>
                            {visibleDevices.map(device => (
                                <DeviceCard key={device.deviceId} device={device} />
                            ))}
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <div className="bg-gray-800 min-h-screen text-white p-4">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">SwitchBot Dashboard</h1>
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