
export interface TapeData {
  url: string;
  title: string;
  artist?: string;
  color: string;
  cover?: string;
}

export enum PlayerState {
  STOPPED = 'STOPPED',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  EJECTED = 'EJECTED'
}
