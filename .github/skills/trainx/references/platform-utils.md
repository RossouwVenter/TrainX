# Platform Utilities

## Storage Wrapper (`src/utils/storage.ts`)

Platform-aware storage: expo-secure-store on native, localStorage on web.

```typescript
import { Platform } from 'react-native';

let SecureStore: typeof import('expo-secure-store') | null = null;
if (Platform.OS !== 'web') {
  SecureStore = require('expo-secure-store');
}

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return SecureStore!.getItemAsync(key);
}

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  return SecureStore!.setItemAsync(key, value);
}

export async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }
  return SecureStore!.deleteItemAsync(key);
}
```

## Alert Wrapper (`src/utils/alert.ts`)

Cross-platform alerts: native Alert on mobile, window.confirm/alert on web.

```typescript
import { Alert, Platform } from 'react-native';

export function showAlert(title: string, message?: string): void {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
  } else {
    Alert.alert(title, message);
  }
}

export function showConfirm(
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
): void {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    } else {
      onCancel?.();
    }
  } else {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel', onPress: onCancel },
      { text: 'OK', onPress: onConfirm },
    ]);
  }
}
```

## API Client (`src/services/api.ts`)

Axios instance with base URL configuration.

```typescript
import axios from 'axios';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (Platform.OS === 'web') return 'http://localhost:3000/api/v1';
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000/api/v1';
  return 'http://localhost:3000/api/v1';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

export default api;
```

## Important Platform Notes

- **Web**: Use Metro bundler (NOT webpack). Set `"bundler": "metro"` in app.json web config.
- **Expo SDK 54**: React 19, React Native 0.81, expo-router ~6.x
- **No `Alert.alert` on web**: Always use `showAlert`/`showConfirm` wrappers
- **No `expo-secure-store` on web**: Always use the storage wrapper
- **Android emulator**: Use `10.0.2.2` instead of `localhost` for API calls
- **Physical device**: Replace localhost with machine's local IP
