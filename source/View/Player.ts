export type PlayerPlayingEventHandler = (second: number) => any;
export type PlayerStoppedEventHandler = (second: number) => any;

/**
 * A media player
 */
export interface Player {

    play(mediaUri: string): Promise<void>;
    getCurrentTime(): number;
    onStartedPlaying(handler: PlayerPlayingEventHandler): void;
    onStopped(handler: PlayerStoppedEventHandler): void;
    destroy(): void;

}
