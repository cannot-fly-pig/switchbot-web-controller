
import React, { useState, useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { ArrowLeftIcon } from '../components/icons';

interface SettingsScreenProps {
    onNavigateBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigateBack }) => {
    const settings = useContext(SettingsContext);
    
    // Local state to manage form inputs, initialized from context
    const [localToken, setLocalToken] = useState(settings?.token || '');
    const [localSecret, setLocalSecret] = useState(settings?.secret || '');
    const [localProxyUrl, setLocalProxyUrl] = useState(settings?.proxyUrl || '');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        if (settings) {
            settings.setToken(localToken);
            settings.setSecret(localSecret);
            settings.setProxyUrl(localProxyUrl);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000); // Hide message after 2s
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
            <main className="max-w-md mx-auto">
                <div className="space-y-6 bg-gray-900 p-6 rounded-lg">
                    <div>
                        <label htmlFor="token" className="block text-sm font-medium text-gray-300">API Token</label>
                        <input
                            type="password"
                            id="token"
                            value={localToken}
                            onChange={(e) => setLocalToken(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="secret" className="block text-sm font-medium text-gray-300">API Secret</label>
                        <input
                            type="password"
                            id="secret"
                            value={localSecret}
                            onChange={(e) => setLocalSecret(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="proxyUrl" className="block text-sm font-medium text-gray-300">
                            CORS Proxy URL (Optional)
                        </label>
                        <input
                            type="text"
                            id="proxyUrl"
                            placeholder="e.g. https://my-proxy.com/"
                            value={localProxyUrl}
                            onChange={(e) => setLocalProxyUrl(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                         <p className="mt-2 text-xs text-gray-400">
                           A CORS proxy may be needed to bypass browser restrictions when calling the SwitchBot API directly. Leave empty if not needed.
                        </p>
                    </div>
                    <div className="flex items-center justify-end">
                         <button
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600"
                        >
                            Save Settings
                        </button>
                        {saved && <span className="text-green-400 ml-4 absolute left-1/2 -translate-x-1/2 bottom-10 bg-gray-700 px-3 py-1 rounded-md">Saved!</span>}
                    </div>
                </div>
            </main>
        </div>
    );
};
