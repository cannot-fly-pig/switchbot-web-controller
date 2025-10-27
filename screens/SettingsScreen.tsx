import React, { useState, useContext, useEffect } from 'react';
import { SettingsContext, CardSize } from '../context/SettingsContext';
import { ArrowLeftIcon } from '../components/icons';
import { AnySwitchBotDevice } from '../types/switchbot';
import { getDevices } from '../services/switchbotService';
import { Spinner } from '../components/ui/Spinner';

interface SettingsScreenProps {
    onNavigateBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigateBack }) => {
    const settings = useContext(SettingsContext);
    
    const [localToken, setLocalToken] = useState(settings.token || '');
    const [localSecret, setLocalSecret] = useState(settings.secret || '');
    const [localProxyUrl, setLocalProxyUrl] = useState(settings.proxyUrl || '');
    const [saved, setSaved] = useState(false);

    const [allDevices, setAllDevices] = useState<AnySwitchBotDevice[]>([]);
    const [isLoadingDevices, setIsLoadingDevices] = useState(false);
    const [deviceError, setDeviceError] = useState<string | null>(null);

    const fetchDevices = async () => {
        if (!localToken || !localSecret) {
            setDeviceError("Please enter API Token and Secret to fetch devices.");
            return;
        }
        setIsLoadingDevices(true);
        setDeviceError(null);
        try {
            const deviceList = await getDevices(localToken, localSecret, localProxyUrl);
            setAllDevices(deviceList);
        } catch (err: any) {
            setDeviceError(err.message);
        } finally {
            setIsLoadingDevices(false);
        }
    };

    useEffect(() => {
        // Fetch devices automatically if credentials are provided
        if (settings.token && settings.secret) {
            fetchDevices();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount


    const handleSaveCredentials = () => {
        settings.setToken(localToken);
        settings.setSecret(localSecret);
        settings.setProxyUrl(localProxyUrl);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        // After saving new credentials, try fetching devices
        fetchDevices();
    };

    const handleDeviceSelection = (deviceId: string) => {
        const currentSelection = settings.selectedDevices || [];
        const isSelected = currentSelection.includes(deviceId);
        if (isSelected) {
            settings.setSelectedDevices(currentSelection.filter(id => id !== deviceId));
        } else {
            settings.setSelectedDevices([...currentSelection, deviceId]);
        }
    };

    return (
        <div className="bg-gray-800 min-h-screen text-white p-4">
            <header className="flex items-center mb-6">
                <button onClick={onNavigateBack} className="p-2 mr-2 text-gray-300 hover:text-white">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold">Settings</h1>
            </header>
            <main className="max-w-2xl mx-auto space-y-8">
                {/* API Credentials */}
                <div className="bg-gray-900 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">API Credentials</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="token" className="block text-sm font-medium text-gray-300">API Token</label>
                            <input type="password" id="token" value={localToken} onChange={(e) => setLocalToken(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="secret" className="block text-sm font-medium text-gray-300">API Secret</label>
                            <input type="password" id="secret" value={localSecret} onChange={(e) => setLocalSecret(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="proxyUrl" className="block text-sm font-medium text-gray-300">CORS Proxy URL (Optional)</label>
                            <input type="text" id="proxyUrl" placeholder="e.g. https://my-proxy.com/" value={localProxyUrl} onChange={(e) => setLocalProxyUrl(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="flex items-center justify-end">
                            {saved && <span className="text-green-400 mr-4">Saved!</span>}
                            <button onClick={handleSaveCredentials} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Save & Fetch Devices</button>
                        </div>
                    </div>
                </div>

                {/* Device Visibility */}
                <div className="bg-gray-900 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Device Visibility</h2>
                    {isLoadingDevices ? <Spinner /> : deviceError ? <p className="text-red-400">{deviceError}</p> : 
                        allDevices.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {allDevices.map(device => (
                                    <label key={device.deviceId} className="flex items-center space-x-3 p-2 bg-gray-800 rounded-md">
                                        <input type="checkbox" checked={settings.selectedDevices?.includes(device.deviceId) || false} onChange={() => handleDeviceSelection(device.deviceId)} className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-600"/>
                                        <span>{device.deviceName}</span>
                                    </label>
                                ))}
                            </div>
                        ) : <p className="text-gray-400">No devices found. Please check your credentials and click "Save & Fetch Devices".</p>
                    }
                </div>
                
                 {/* Appearance Settings */}
                <div className="bg-gray-900 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Card Size</label>
                        <div className="flex space-x-2">
                            {(['sm', 'md', 'lg'] as CardSize[]).map(size => (
                                <button
                                    key={size}
                                    onClick={() => settings.setCardSize(size)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${settings.cardSize === size ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
