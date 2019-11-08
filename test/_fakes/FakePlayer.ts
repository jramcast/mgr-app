import { Player, PlayerPlayingEventHandler, PlayerStoppedEventHandler } from "../../source/View/Player";


export default class FakePlayer implements Player {

    public play(videoUri: string): Promise<void> {
        return Promise.resolve();
    }

    public getCurrentTime(): number {
        return 0;
    }

    public onStartedPlaying(handler: PlayerPlayingEventHandler): void {
        return undefined;
    }

    public onStopped(handler: PlayerStoppedEventHandler): void {
        return undefined;
    }

    public destroy(): void {
        return undefined;
    }

}
