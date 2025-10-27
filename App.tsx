
import React, { useState, useEffect } from 'react';
import { SettingsProvider, SettingsContext } from './context/SettingsContext';
import { MainScreen } from './screens/MainScreen';
import { SettingsScreen } from './screens/SettingsScreen';

type Screen = 'main' | 'settings';

const AppContent: React.FC = () => {
    const [screen, setScreen] = useState<Screen>('main');
    const { token, secret } = React.useContext(SettingsContext);

    useEffect(() => {
        // On first load, if no credentials, go to settings
        if (!token || !secret) {
            setScreen('settings');
        }
    }, [token, secret]);

    const navigateToSettings = () => setScreen('settings');
    const navigateToMain = () => setScreen('main');

    return (
        <>
            {screen === 'main' && <MainScreen onNavigateToSettings={navigateToSettings} />}
            {screen === 'settings' && <SettingsScreen onNavigateBack={navigateToMain} />}
        </>
    );
};


const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
};

export default App;
