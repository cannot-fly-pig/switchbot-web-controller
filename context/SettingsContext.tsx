import React, { createContext, ReactNode, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type CardSize = 'sm' | 'md' | 'lg';

interface SettingsContextType {
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    secret: string;
    setSecret: React.Dispatch<React.SetStateAction<string>>;
    proxyUrl: string;
    setProxyUrl: React.Dispatch<React.SetStateAction<string>>;
    selectedDevices: string[] | null;
    setSelectedDevices: React.Dispatch<React.SetStateAction<string[] | null>>;
    cardSize: CardSize;
    setCardSize: React.Dispatch<React.SetStateAction<CardSize>>;
}

export const SettingsContext = createContext<SettingsContextType>({
    token: '',
    setToken: () => {},
    secret: '',
    setSecret: () => {},
    proxyUrl: '',
    setProxyUrl: () => {},
    selectedDevices: [],
    setSelectedDevices: () => {},
    cardSize: 'md',
    setCardSize: () => {},
});

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
    const [token, setToken] = useLocalStorage<string>('switchbot-token', '');
    const [secret, setSecret] = useLocalStorage<string>('switchbot-secret', '');
    const [proxyUrl, setProxyUrl] = useLocalStorage<string>('switchbot-proxy', '');
    const [selectedDevices, setSelectedDevices] = useLocalStorage<string[] | null>('switchbot-selected-devices', null);
    const [cardSize, setCardSize] = useLocalStorage<CardSize>('switchbot-card-size', 'md');

    const value = useMemo(() => ({
        token,
        setToken,
        secret,
        setSecret,
        proxyUrl,
        setProxyUrl,
        selectedDevices,
        setSelectedDevices,
        cardSize,
        setCardSize,
    }), [token, secret, proxyUrl, selectedDevices, cardSize, setToken, setSecret, setProxyUrl, setSelectedDevices, setCardSize]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
