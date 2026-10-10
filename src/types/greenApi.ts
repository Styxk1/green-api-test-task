export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
}

export type StateInstance =
  'notAuthorized' | 'authorized' | 'blocked' | 'starting' | 'suspended' | 'pendingPassword';

export interface StateInstanceResponse {
  stateInstance: StateInstance;
}
