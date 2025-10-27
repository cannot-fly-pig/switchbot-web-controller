import React, { useContext, useState } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { getDevices } from '../services/switchbotService';
import type { AnySwitchBotDevice } from '../types/switchbot';
import { Spinner } from '../components/ui/Spinner';

interface SettingsScreenProps {
  onNavigateBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigateBack }) => {
    const { 
        token, setToken, 
        secret, setSecret,
        proxyUrl, setProxyUrl,
        allDevices, setAllDevices,
        displayedDeviceIds, setDisplayedDeviceIds 
    } = useContext(SettingsContext);

    const [localToken, setLocalToken] = useState(token);
    const [localSecret, setLocalSecret] = useState(secret);
    const [localProxyUrl, setLocalProxyUrl] = useState(proxyUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSaveSettings = () => {
        setToken(localToken);
        setSecret(localSecret);
        setProxyUrl(localProxyUrl);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
    };

    const handleFetchDevices = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Use local values so the user doesn't have to save before fetching
            const devices = await getDevices(localToken, localSecret, localProxyUrl);
            setAllDevices(devices);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleToggleDevice = (deviceId: string) => {
        setDisplayedDeviceIds(prevIds => {
            if (prevIds.includes(deviceId)) {
                return prevIds.filter(id => id !== deviceId);
            } else {
                return [...prevIds, deviceId];
            }
        });
    };

    return (
        <div className="w-screen h-screen bg-gray-800 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <button onClick={onNavigateBack} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        &larr; Back to Dashboard
                    </button>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4">API Credentials</h2>
                    <p className="text-sm text-gray-400 mb-4">
                        Your settings are stored in your browser's local storage. Get your Token and Secret from the SwitchBot app under Profile &gt; Preferences &gt; Developer Options.
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="token" className="block text-sm font-medium text-gray-300 mb-1">API Token</label>
                            <input
                                id="token"
                                type="text"
                                value={localToken}
                                onChange={(e) => setLocalToken(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your API Token"
                            />
                        </div>
                        <div>
                            <label htmlFor="secret" className="block text-sm font-medium text-gray-300 mb-1">API Secret</label>
                            <input
                                id="secret"
                                type="password"
                                value={localSecret}
                                onChange={(e) => setLocalSecret(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your API Secret"
                            />
                        </div>
                         <div>
                            <label htmlFor="proxy" className="block text-sm font-medium text-gray-300 mb-1">CORS Proxy URL (Optional)</label>
                             <p className="text-xs text-gray-500 mb-2">
                                If you get a "failed to fetch" error, it's likely due to browser CORS policy. Use a proxy to fix this.
                                 <strong className="text-yellow-400"> Warning:</strong> Public proxies can see your API key. Use a trusted one or host your own.
                            </p>
                            <input
                                id="proxy"
                                type="text"
                                value={localProxyUrl}
                                onChange={(e) => setLocalProxyUrl(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., https://your-proxy.com/"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                             <button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                Save Settings
                            </button>
                            {saveSuccess && <span className="text-green-400">Settings saved!</span>}
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-900 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Device Management</h2>
                     <button onClick={handleFetchDevices} disabled={isLoading || !localToken || !localSecret} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center">
                        {isLoading && <Spinner />}
                        <span className="ml-2">Fetch Devices</span>
                    </button>
                    {error && <p className="text-red-400 mt-4">Error: {error}</p>}
                    
                    <div className="mt-6 space-y-3">
                        {allDevices.length > 0 ? (
                            allDevices.map(device => (
                                <div key={device.deviceId} className="flex items-center justify-between bg-gray-800 p-3 rounded-md">
                                    <div>
                                        <p className="font-medium">{device.deviceName}</p>
                                        <p className="text-sm text-gray-400">{device.deviceType}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={displayedDeviceIds.includes(device.deviceId)}
                                            onChange={() => handleToggleDevice(device.deviceId)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-300">Show</span>
                                    </label>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 mt-4">No devices fetched yet. Enter your credentials, save, then click the button above.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};