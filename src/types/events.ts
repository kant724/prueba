export type GameEventType = 
    | 'gameStart' 
    | 'numberDrawn' 
    | 'playerJoined' 
    | 'patternSelected'
    | 'playerWon' 
    | 'gameEnd'
    | 'userLoggedIn'
    | 'userLoggedOut'
    | 'wsConnected'
    | 'wsDisconnected'
    | 'wsError';

export interface GameEvent<T = any> {
    type: GameEventType;
    payload: T;
    timestamp: Date;
}

export interface GameEventListener<T = any> {
    (event: GameEvent<T>): void;
}
