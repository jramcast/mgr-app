export default class PlayerEventHandlers {

    constructor(private readonly commands) {}

    public handlePlayerStartedPlaying(mediaUri: string): void {
        this.commands.startLiveGenreClassification(mediaUri);
    }

    public handlePlayerStopped(): void {
        this.commands.stopLiveGenreClassification();
    }

}
