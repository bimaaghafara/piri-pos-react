import { AuthenticationHttpInterceptorService } from './Auth/AuthenticationHttpInterceptorService';
import { AuthenticationHttpService } from './Auth/AuthenticationHttpService';
import { AuthenticationService } from './Auth/AuthenticationService';
import { AuthenticationStorageService } from './Auth/AuthenticationStorageService';
import { EventService } from './Interaction/EventService';
import { HttpVariableService } from './Http/HttpVariableService';
import { HttpVariableSyncService } from './Http/HttpVariableSyncService';

export const authenticationHttpInterceptorService = new AuthenticationHttpInterceptorService;
export const authenticationHttpService = new AuthenticationHttpService;
export const authenticationService = new AuthenticationService;
export const authenticationStorageService = new AuthenticationStorageService;
export const eventService = new EventService;
export const httpVariableService = new HttpVariableService;
export const httpVariableSyncService = new HttpVariableSyncService;
