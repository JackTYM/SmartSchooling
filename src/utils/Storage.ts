import AsyncStorage from '@react-native-async-storage/async-storage';

import storageData from "./storage.json"
var storage: any = storageData;

export async function StoreData(keyPath: string, data: string) {
    const keys = keyPath.split('.');

    let current = storage;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (current[key] === undefined) {
                current[key] = {}; // Initialize a new object if the path doesn't exist
            }
            current = current[key];
        }

        // Set the data on the final key
        current[keys[keys.length - 1]] = data;
    try {
        const jsonValue = JSON.stringify(storage);
        await AsyncStorage.setItem('@FBLAStorage', jsonValue);
    } catch (e) {
        // saving error
        console.error('Error storing data', e);
    }
}

export function GetData(key: string) {
    const keyParts = key.split('.');
    let currentData = storage;

    for (const part of keyParts) {
        currentData = currentData[part];
        if (currentData === undefined) {
            return undefined;
        }
    }

    return currentData;
}

export async function StartData() {
    try {
        const jsonValue = await AsyncStorage.getItem('@FBLAStorage');
        if (jsonValue !== null) {
            storage = JSON.parse(jsonValue);
        }
    } catch (e) {
        // saving error
        console.error('Error getting data', e);
    }
}