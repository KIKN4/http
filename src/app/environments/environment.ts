import { InjectionToken } from '@angular/core';

export interface Environment {
  apiUrl: string;
}

export const ENVIRONMENT_DEFAULT = {
  apiUrl: 'https://api.everrest.educata.dev',
};

export const ENVIRONMENT = new InjectionToken<Environment>('ENVIRONMENT', {
  providedIn: 'root',
  factory: () => ENVIRONMENT_DEFAULT,
});
