import { API_BASE_URL } from '../constants';
import type { AllDevicesResponse, DeviceStatusResponse, CommandBody, AnySwitchBotDevice, Scene } from '../types/switchbot';
import hmacSHA256 from 'https://esm.sh/crypto-js/hmac-sha256';

import Base64 from 'https://esm.sh/crypto-js/enc-base64';


const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const createSignature = async (token: string, secret: string, t: string, nonce: string): Promise<string> => {
  const data = token + t + nonce;

  if (crypto.subtle) {
    // Use Web Crypto API in secure contexts (HTTPS)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(data);


    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,

      ['sign']
    );


    const signature = await crypto.subtle.sign('HMAC', key, messageData);

    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  } else {

    // Fallback to crypto-js in non-secure contexts (HTTP)

    console.warn('Web Crypto API not available. Falling back to crypto-js. This is less secure and should only be used for development.');
    const signature = hmacSHA256(data, secret);
    return Base64.stringify(signature);
  }
};


const fetchWithAuth = async (endpoint: string, token: string, secret: string, proxyUrl: string, options: RequestInit = {}): Promise<any> => {
  if (!token || !secret) {
    throw new Error("API Token and Secret are required.");
  }
  const t = Date.now().toString();
  const nonce = generateUUID();
  const sign = await createSignature(token, secret, t, nonce);

  const headers = {
    'Authorization': token,
    't': t,
    'nonce': nonce,
    'sign': sign,
    'Content-Type': 'application/json; charset=utf8',
    ...options.headers,
  };


  const finalUrl = proxyUrl ? `${proxyUrl}${API_BASE_URL}${endpoint}` : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(finalUrl, {
    ...options,
    headers,
  });


  if (!response.ok) {
    // Handle non-2xx responses that fetch itself doesn't throw for

    const errorText = await response.text();
    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
  }

  const responseBody = await response.json();
  if (responseBody.statusCode !== 100) {
    throw new Error(responseBody.message || 'SwitchBot API Error');
  }


  return responseBody.body;
};

export const getDevices = async (token: string, secret: string, proxyUrl: string): Promise<AnySwitchBotDevice[]> => {
  const body: AllDevicesResponse = await fetchWithAuth('/v1.1/devices', token, secret, proxyUrl, { method: 'GET' });
  return [...body.deviceList, ...body.infraredRemoteList];
};

export const getDeviceStatus = async (token: string, secret: string, deviceId: string, proxyUrl: string): Promise<DeviceStatusResponse> => {
  return await fetchWithAuth(`/v1.1/devices/${deviceId}/status`, token, secret, proxyUrl, { method: 'GET' });

};

export const sendCommand = async (token: string, secret: string, deviceId: string, command: CommandBody, proxyUrl: string): Promise<any> => {
  return await fetchWithAuth(`/v1.1/devices/${deviceId}/commands`, token, secret, proxyUrl, {
    method: 'POST',
    body: JSON.stringify(command),
  });
};

export const getScenes = async (token: string, secret: string, proxyUrl: string): Promise<Scene[]> => {
  return await fetchWithAuth('/v1.1/scenes', token, secret, proxyUrl, { method: 'GET' });
};

export const executeScene = async (token: string, secret: string, sceneId: string, proxyUrl: string): Promise<any> => {
  return await fetchWithAuth(`/v1.1/scenes/${sceneId}/execute`, token, secret, proxyUrl, {
    method: 'POST',
    body: JSON.stringify({}), // Body is empty but required for POST with Content-Type
  });
};
