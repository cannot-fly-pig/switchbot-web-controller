
import React, { createContext, ReactNode, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SettingsContextType {
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    secret: string;
    setSecret: React.Dispatch<React.SetStateAction<string>>;
    proxyUrl: string;
    setProxyUrl: React.Dispatch<React.SetStateAction<string>>;
}

// Providing a default value that matches the type to avoid undefined checks in consumers
export const SettingsContext = createContext<SettingsContextType>({
    token: '',
    setToken: () => {},
    secret: '',
    setSecret: () => {},
    proxyUrl: '',
    setProxyUrl: () => {},
});

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
    const [token, setToken] = useLocalStorage<string>('switchbot-token', '');
    const [secret, setSecret] = useLocalStorage<string>('switchbot-secret', '');
    const [proxyUrl, setProxyUrl] = useLocalStorage<string>('switchbot-proxy', '');

    const value = useMemo(() => ({
        token,
        setToken,
        secret,
        setSecret,
        proxyUrl,
        setProxyUrl,
    // Note: setters from useLocalStorage (via useState) are stable and don't need to be in deps array
    }), [token, secret, proxyUrl]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
