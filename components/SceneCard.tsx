import React, { useState, useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { executeScene } from '../services/switchbotService';
import { Scene } from '../types/switchbot';
import { Spinner } from './ui/Spinner';
import { PlayIcon, CheckIcon } from './icons';

interface SceneCardProps {
    scene: Scene;
}

type ExecuteStatus = 'idle' | 'loading' | 'success' | 'error';

export const SceneCard: React.FC<SceneCardProps> = ({ scene }) => {
    const { token, secret, proxyUrl } = useContext(SettingsContext);
    const [status, setStatus] = useState<ExecuteStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleExecute = async () => {
        setStatus('loading');
        setError(null);
        try {
            await executeScene(token, secret, scene.sceneId, proxyUrl);
            setStatus('success');
            setTimeout(() => setStatus('idle'), 2000); // Reset after 2 seconds
        } catch (err: any) {
            setError(err.message);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000); // Reset after 4 seconds
        }
    };

    const renderButtonContent = () => {
        switch (status) {
            case 'loading':
                return <Spinner />;
            case 'success':
                return <CheckIcon className="h-6 w-6 text-green-400" />;
            case 'error':
                 return 'Retry';
            case 'idle':
            default:
                return (
                    <>
                        <PlayIcon className="h-6 w-6" />
                        <span className="ml-2 font-semibold">Run</span>
                    </>
                );
        }
    };

    return (
        <div className="bg-gray-900 p-3 rounded-lg shadow-lg text-white flex flex-col justify-between h-full">
            <div>
                <h3 className="text-sm font-medium truncate">{scene.sceneName}</h3>
                {status === 'error' && <p className="text-red-400 text-xs mt-1 break-words">Error: {error}</p>}
            </div>
            <button
                onClick={handleExecute}
                disabled={status === 'loading' || status === 'success'}
                className="mt-3 w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-2 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {renderButtonContent()}
            </button>
        </div>
    );
};