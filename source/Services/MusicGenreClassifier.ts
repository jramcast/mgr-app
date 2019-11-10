import { ClassificationResults } from "../Entities/AudioSegmentClassificationResults";
import { AudioSegment } from "../Entities/AudioSegment";
import { Player } from "../View/Player";


export default class MusicGenreClassifier {

    private running: boolean;
    private audioSegmentSeconds = 10;
    private classificationInterval;

    constructor(
        private readonly player: Player,
        private readonly backendAPI: BackendAPI,
        private readonly presenter: ResultsPresenter
    ) {
        this.running = false;
    }

    public async startLiveClassification(mediaUri: string): Promise<void> {
        this.player.onStartedPlaying(() => this.handlePlayerStartedPlaying(mediaUri));
        this.player.onStopped(() => this.handlePlayerStopped());

        await this.player.play(mediaUri);
    }

    private handlePlayerStartedPlaying(mediaUri: string): void {

        const currentSecond = Math.round(this.player.getCurrentTime());
        const segment = {
            mediaUri,
            fromSecond: currentSecond,
            toSecond: currentSecond + this.audioSegmentSeconds
        };

        this.classifySegment(segment);
        this.classificationInterval = setInterval(
            () => { this.classifySegment(segment); },
            this.audioSegmentSeconds * 1000
        );
    }

    private handlePlayerStopped(): void {
        clearInterval(this.classificationInterval);
    }

    private async classifySegment(audioSegment: AudioSegment): Promise<ClassificationResults> {
        let result;
        if (!this.running) {
            try {
                this.running = true;
                result = await this.backendAPI.classifySegment(audioSegment);
            } finally {
                this.running = false;
            }
        }
        return result;
    }

}


export interface BackendAPI {

    classifySegment(audioSegment: AudioSegment): Promise<ClassificationResults>;

}


export interface ResultsPresenter {

    refresh(results): void;

}
