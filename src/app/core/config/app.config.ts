import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export let APP_CONFIG = new InjectionToken<string>('app.config');
export interface IAppConfig {
    apiEndpoint: string;
    imagePath: string;
    refreshTokenPath: string;
    siteKey: string;
    allowFileExtentions: string[];
    allowAudioExtentions: string[];
    allowImageExtentions: string[];
    allowViedoExtentions: string[];
    fileUploadSize: number;
    videoUploadSize: number;
}

export const AppConfig: IAppConfig = {
    apiEndpoint: environment.apiEndpoint,
    imagePath: environment.imagePath,
    refreshTokenPath: environment.refreshTokenPath,
    siteKey: environment.siteKey,
    allowImageExtentions: ['.png , .jpg ,.jpeg'],
    allowAudioExtentions: ['.3gp', '.mp3', '.ogg', '.wma'],
    allowViedoExtentions: ['.mp4'],
    allowFileExtentions: ['.DOCX', '.PDF', '.TXT'],
    fileUploadSize: 1048578,
    videoUploadSize: 314573400,
}