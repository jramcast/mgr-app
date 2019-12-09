import { Player, PlayerPlayingEventHandler, PlayerStoppedEventHandler } from "../Player";


/**
 * A youtube video player
 */
export default class YouTubePlayer implements Player {

    private player?: YT.Player;
    private onPlayingHandler: PlayerPlayingEventHandler;
    private onStoppedHandler: PlayerStoppedEventHandler;
    private isApiReady: boolean;

    constructor(
        private readonly elementId: string,
        private readonly height = 1024,
        private readonly width = 1280
    ) {
        this.onPlayingHandler = () => { };
        this.onStoppedHandler = () => { };

        this.insertScriptTag();
        this.prepareGlobalReadyFunction();
    }


    public play(videoUri: string): Promise<void> {
        // If Youtube API is not loaded yet, try to retry after some seconds
        if (!this.isApiReady) {
            return this.retryStart(videoUri);
        }

        if (this.player) {
            this.destroy();
        }

        return new Promise(resolve => {
            this.player = new YT.Player(this.elementId, {
                height: this.height,
                width: this.width,
                videoId: videoUri,
                events: {
                    onReady: event => {
                        event.target.playVideo();
                        event.target.unMute();
                        resolve();
                    },
                    onStateChange: this.onPlayerStateChange.bind(this)
                }
            });
        });
    }

    public getCurrentTime(): number {
        if (this.player) {
            return this.player.getCurrentTime();
        }
        return 0;
    }

    public onStartedPlaying(handler): void {
        this.onPlayingHandler = handler;
    }

    public onStopped(handler): void {
        this.onStoppedHandler = handler;
    }

    public destroy(): void {
        if (this.player) {
            this.player.destroy();
        }
    }

    private onPlayerStateChange(event: YT.OnStateChangeEvent): void {
        if (!this.player) {
            return;
        }

        const seconds = this.player.getCurrentTime();
        if (event.data === YT.PlayerState.PLAYING) {
            this.onPlayingHandler(seconds);
        } else if (this.isStopEvent(event)) {
            this.onStoppedHandler(seconds);
        }
    }

    private isStopEvent(event: YT.OnStateChangeEvent): boolean {
        return event.data === YT.PlayerState.ENDED ||
            event.data === YT.PlayerState.PAUSED ||
            event.data === YT.PlayerState.CUED;
    }

    private insertScriptTag(): void {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
            document.body.append(tag);
        }
    }

    private prepareGlobalReadyFunction(): void {
        // Youtube API will invoke this function once loaded
        (window as any).onYouTubeIframeAPIReady = () => {
            this.isApiReady = true;
        };
    }

    private retryStart(videoUri: string): Promise<void> {
        return new Promise(resolve => {
            setTimeout(async () => {
                await this.play(videoUri);
                resolve();
            }, 5 * 1000);
        });
    }

}
