// Common properties for all devices
interface BaseDevice {
    deviceId: string;
    deviceName: string;
    hubDeviceId: string;
}

// For physical devices like Bot, Curtain, Meter, etc.
export interface SwitchBotDevice extends BaseDevice {
    deviceType: string;
    enableCloudService: boolean;
    // other physical device properties
}

// For virtual infrared remote devices
export interface InfraredRemoteDevice extends BaseDevice {
    remoteType: string;
    // According to docs and app usage, IR remotes also have a deviceType.
    deviceType: string; 
}

// A union type that represents any device returned by the API
export type AnySwitchBotDevice = SwitchBotDevice | InfraredRemoteDevice;

// Type for the response body of the get devices endpoint
export interface AllDevicesResponse {
    deviceList: SwitchBotDevice[];
    infraredRemoteList: InfraredRemoteDevice[];
}

// Generic type for a device's status
// Properties are highly dependent on the deviceType
export interface DeviceStatusResponse {
    deviceId: string;
    deviceType: string;
    hubDeviceId: string;
    battery?: number;
    version?: string;
    temperature?: number;
    humidity?: number;
    slidePosition?: number;
    power?: 'on' | 'off';
    [key: string]: any;
}

// Type for the command body sent to a device
export interface CommandBody {
    commandType: 'command' | 'customize';
    command: string;
    parameter?: any;
}
