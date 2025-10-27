import React, { createContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { AnySwitchBotDevice } from '../types/switchbot';

interface SettingsContextType {
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    secret: string;
    setSecret: React.Dispatch<React.SetStateAction<string>>;
    proxyUrl: string;
    setProxyUrl: React.Dispatch<React.SetStateAction<string>>;
    allDevices: AnySwitchBotDevice[];
    setAllDevices: React.Dispatch<React.SetStateAction<AnySwitchBotDevice[]>>;
    displayedDeviceIds: string[];
    setDisplayedDeviceIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SettingsContext = createContext<SettingsContextType>({
    token: '',
    setToken: () => {},
    secret: '',
    setSecret: () => {},
    proxyUrl: '',
    setProxyUrl: () => {},
    allDevices: [],
    setAllDevices: () => {},
    displayedDeviceIds: [],
    setDisplayedDeviceIds: () => {},
});

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
    const [token, setToken] = useLocalStorage<string>('switchbot_token', '');
    const [secret, setSecret] = useLocalStorage<string>('switchbot_secret', '');
    const [proxyUrl, setProxyUrl] = useLocalStorage<string>('switchbot_proxy_url', '');
    const [allDevices, setAllDevices] = useLocalStorage<AnySwitchBotDevice[]>('switchbot_all_devices', []);
    const [displayedDeviceIds, setDisplayedDeviceIds] = useLocalStorage<string[]>('switchbot_displayed_devices', []);

    return (
        <SettingsContext.Provider value={{
            token, setToken,
            secret, setSecret,
            proxyUrl, setProxyUrl,
            allDevices, setAllDevices,
            displayedDeviceIds, setDisplayedDeviceIds,
        }}>
            {children}
        </SettingsContext.Provider>
    );
};