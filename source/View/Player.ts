export type PlayerPlayingEventHandler = (second: number) => any;
export type PlayerStoppedEventHandler = (second: number) => any;

/**
 * A media player
 */
export interface Player {

    play(videoUri: string): Promise<void>;
    onPlaying(handler: PlayerPlayingEventHandler): void;
    onStopped(handler: PlayerStoppedEventHandler): void;
    destroy(): void;

}
