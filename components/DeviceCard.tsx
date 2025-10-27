import React, { useState, useEffect, useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { getDeviceStatus, sendCommand } from '../services/switchbotService';
import { AnySwitchBotDevice, CommandBody, DeviceStatusResponse, isInfraredRemoteDevice } from '../types/switchbot';
import { Spinner } from './ui/Spinner';
import { RefreshIcon, LightBulbIcon, AirConditionerIcon, BotIcon, ThermometerIcon } from './icons';
import { AirConditionerRemote } from './AirConditionerRemote';
import { LightRemote } from './LightRemote';

interface DeviceCardProps {
    device: AnySwitchBotDevice;
}

const DeviceTypeIcon: React.FC<{ device: AnySwitchBotDevice, className?: string }> = ({ device, className }) => {
    const type = device.deviceType || (device as any).remoteType;
    switch (type) {
        case 'Light':
        case 'Color Bulb':
        case 'Strip Light':
            return <LightBulbIcon className={className} />;
        case 'Air Conditioner':
            return <AirConditionerIcon className={className} />;
        case 'Bot':
            return <BotIcon className={className} />;
        case 'Meter':
        case 'MeterPlus':
            return <ThermometerIcon className={className} />;
        default:
            return null;
    }
}


export const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
    const { token, secret, proxyUrl } = useContext(SettingsContext);
    const [status, setStatus] = useState<DeviceStatusResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = async () => {
        // Do not fetch status for IR devices as it's not supported
        if (isInfraredRemoteDevice(device)) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const newStatus = await getDeviceStatus(token, secret, device.deviceId, proxyUrl);
            setStatus(newStatus);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [device, token, secret, proxyUrl]);

    const handleSendCommand = async (command: string, parameter: any = 'default') => {
        setIsLoading(true);
        setError(null);
        try {
            const commandBody: CommandBody = {
                commandType: 'command',
                command,
                parameter,
            };
            await sendCommand(token, secret, device.deviceId, commandBody, proxyUrl);
            // After sending a command, wait a bit and refresh status for non-IR devices
             if (!isInfraredRemoteDevice(device)) {
                setTimeout(fetchStatus, 1500); 
             } else {
                setIsLoading(false);
             }
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const renderControls = () => {
        const type = device.deviceType || (device as any).remoteType;
        
        switch (type) {
            case 'Air Conditioner':
                return <AirConditionerRemote device={device} onCommand={handleSendCommand} isLoading={isLoading} />;
            case 'Light':
            case 'Color Bulb':
            case 'Strip Light':
                 return <LightRemote device={device} onCommand={handleSendCommand} isLoading={isLoading} />;
            case 'Bot':
                return (
                    <button 
                        onClick={() => handleSendCommand('press')} 
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600"
                    >
                        Press
                    </button>
                );
            default:
                return <p className="text-gray-400">Controls not available for this device type ({type}).</p>;
        }
    };

    const renderStatusInfo = () => {
        if (!status) return null;
        const statusItems = [];
        if (typeof status.temperature !== 'undefined') {
            statusItems.push(`🌡️ ${status.temperature}°C`);
        }
        if (typeof status.humidity !== 'undefined') {
            statusItems.push(`💧 ${status.humidity}%`);
        }
        if (typeof status.battery !== 'undefined') {
            statusItems.push(`🔋 ${status.battery}%`);
        }
        if (typeof status.power !== 'undefined') {
            statusItems.push(`⚡ ${status.power}`);
        }
        if (statusItems.length === 0) return null;

        return <div className="text-sm text-gray-300 flex flex-wrap gap-x-4 gap-y-1">{statusItems.map((item, i) => <span key={i}>{item}</span>)}</div>
    }

    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg text-white flex flex-col space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center space-x-2">
                        <DeviceTypeIcon device={device} className="h-5 w-5 text-gray-400" />
                        <h2 className="text-lg font-bold">{device.deviceName}</h2>
                    </div>
                    {renderStatusInfo()}
                </div>
                <div className="flex items-center space-x-2">
                    {isLoading && <Spinner />}
                    {!isInfraredRemoteDevice(device) && (
                      <button onClick={fetchStatus} disabled={isLoading} className="p-1 text-gray-400 hover:text-white disabled:text-gray-600">
                          <RefreshIcon className="h-5 w-5" />
                      </button>
                    )}
                </div>
            </div>
            
            {error && <p className="text-red-400 text-sm">Error: {error}</p>}

            <div>
                {isLoading && !status && !isInfraredRemoteDevice(device) ? (
                    <p className="text-gray-400">Loading status...</p>
                ) : (
                    renderControls()
                )}
            </div>
        </div>
    );
};