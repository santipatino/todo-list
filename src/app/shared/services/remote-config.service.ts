import { Injectable, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { FirebaseRemoteConfig } from '@capacitor-firebase/remote-config';
import { getApps, initializeApp } from 'firebase/app';
import { environment } from '@env/environment';

const FILTER_FLAG_KEY = 'category_filter_enabled';
const REMOTE_CONFIG_DEFAULTS = { [FILTER_FLAG_KEY]: false };
const FETCH_TIMEOUT_SECONDS = 5;
const DEVELOPMENT_FETCH_INTERVAL_SECONDS = 0;
const PRODUCTION_FETCH_INTERVAL_SECONDS = 0;

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  public readonly categoryFilterEnabled = signal(false);

  public async initialize(): Promise<void> {
    if (!environment.firebase.apiKey) {
      return;
    }

    try {
      if (Capacitor.getPlatform() === 'web' && getApps().length === 0) {
        initializeApp(environment.firebase);
      }

      await FirebaseRemoteConfig.setDefaults({
        defaults: REMOTE_CONFIG_DEFAULTS,
      });
      await FirebaseRemoteConfig.setSettings({
        fetchTimeoutInSeconds: FETCH_TIMEOUT_SECONDS,
        minimumFetchIntervalInSeconds: environment.production
          ? PRODUCTION_FETCH_INTERVAL_SECONDS
          : DEVELOPMENT_FETCH_INTERVAL_SECONDS,
      });
      await FirebaseRemoteConfig.fetchAndActivate();

      const { value } = await FirebaseRemoteConfig.getBoolean({
        key: FILTER_FLAG_KEY,
      });
      this.categoryFilterEnabled.set(value);
    } catch {
      this.categoryFilterEnabled.set(false);
    }
  }
}
