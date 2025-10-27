import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { sendCommand, getDeviceStatus } from '../services/switchbotService';
import type { AnySwitchBotDevice, DeviceStatusResponse } from '../types/switchbot';
import { Spinner } from './ui/Spinner';

interface DeviceCardProps {
    device: AnySwitchBotDevice;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
    const { token, secret, proxyUrl } = useContext(SettingsContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<DeviceStatusResponse | null>(null);

    const deviceType = device.deviceType;

    useEffect(() => {
        const fetchStatus = async () => {
            if (!token || !secret) return;
            // Only fetch status for some device types to avoid errors for IR remotes etc.
            if (device.deviceType && ['Bot', 'Curtain', 'Meter', 'Hub Mini', 'Plug'].includes(device.deviceType)) {
                 try {
                    const deviceStatus = await getDeviceStatus(token, secret, device.deviceId, proxyUrl);
                    setStatus(deviceStatus);
                } catch (err: any) {
                    console.error(`Failed to get status for ${device.deviceName}`, err);
                }
            }
        };
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000); // refresh every 30s
        return () => clearInterval(interval);
    }, [token, secret, device.deviceId, device.deviceName, proxyUrl, device.deviceType]);
    
    const handleCommand = async (command: string, parameter: any = 'default', commandType: 'command' | 'customize' = 'command') => {
        if (!token || !secret) {
            setError("Token and Secret not set.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await sendCommand(token, secret, device.deviceId, { command, parameter, commandType });
             // After sending a command, refetch status after a short delay
            setTimeout(async () => {
                 try {
                    if (device.deviceType && ['Bot', 'Curtain', 'Meter', 'Hub Mini', 'Plug'].includes(device.deviceType)) {
                        const deviceStatus = await getDeviceStatus(token, secret, device.deviceId, proxyUrl);
                        setStatus(deviceStatus);
                    }
                } catch (e) {
                    // ignore refetch error, but log it
                    console.error(`Failed to refetch status for ${device.deviceName}`, e);
                }
            }, 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderControls = () => {
        switch (deviceType) {
            case 'Bot':
                return (
                    <div className="flex justify-center mt-4">
                        <button onClick={() => handleCommand('press')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                            Press
                        </button>
                    </div>
                );
            case 'Curtain':
                return (
                    <div className="flex justify-around mt-4">
                        <button onClick={() => handleCommand('turnOn')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Open
                        </button>
                         <button onClick={() => handleCommand('turnOff')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Close
                        </button>
                    </div>
                );
            case 'Plug':
                 return (
                    <div className="flex justify-around mt-4">
                        <button onClick={() => handleCommand('turnOn')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Turn On
                        </button>
                         <button onClick={() => handleCommand('turnOff')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Turn Off
                        </button>
                    </div>
                );
            case 'Air Conditioner':
            case 'TV':
            case 'Light':
            case 'Others': // This is a remoteType for IR remotes
                return <p className="text-center text-sm text-gray-500 mt-4">IR remote controls not implemented yet.</p>;

            default:
                return null;
        }
    }
    
    const renderStatus = () => {
        if (!status) return null;
        
        return (
            <div className="text-sm text-gray-400 mt-2 space-y-1">
                {status.battery !== undefined && <p>Battery: {status.battery}%</p>}
                {status.temperature !== undefined && <p>Temp: {status.temperature}°C</p>}
                {status.humidity !== undefined && <p>Humidity: {status.humidity}%</p>}
                {status.slidePosition !== undefined && <p>Position: {status.slidePosition}%</p>}
                {status.power !== undefined && <p>Power: {status.power}</p>}
            </div>
        )
    }

    return (
        <div className="bg-gray-800 rounded-lg p-4 text-white w-64 h-72 flex flex-col justify-between flex-shrink-0">
            <div>
                <h3 className="text-lg font-bold truncate" title={device.deviceName}>{device.deviceName}</h3>
                <p className="text-sm text-gray-400">{deviceType}</p>
                <div className="mt-4 text-center">
                    {renderStatus()}
                </div>
            </div>

            <div className="flex flex-col justify-end flex-grow">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Spinner />
                    </div>
                ) : (
                    renderControls()
                )}
                {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
            </div>
        </div>
    );
};
