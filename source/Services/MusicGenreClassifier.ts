import { ClassificationResultsByModel } from "../Entities/ClassificationResultsByModel";
import { AudioSegment } from "../Entities/AudioSegment";
import { Player } from "../View/Player";
import AudioClipClassificationResults from "../Entities/AudioClipClassificationResults";


export default class MusicGenreClassifier {

    private running: boolean;
    private audioSegmentSeconds = 10;
    private classificationInterval;
    private clipResults: AudioClipClassificationResults;

    constructor(
        private readonly player: Player,
        private readonly backendAPI: BackendAPI,
        private readonly presenter: ResultsPresenter
    ) {
        this.running = false;
    }

    public async startLiveClassification(mediaUri: string): Promise<void> {
        this.clipResults = new AudioClipClassificationResults([
            "LSTMRecurrentNeuralNetwork",
            "NaiveBayesModel",
            "NeuralNetworkModel",
            "SVMModel"
        ]);

        this.player.onStartedPlaying(() => this.handlePlayerStartedPlaying(mediaUri));
        this.player.onStopped(() => this.handlePlayerStopped());

        await this.player.play(mediaUri);
    }

    private handlePlayerStartedPlaying(mediaUri: string): void {
        this.classifySegment(mediaUri);
        this.classificationInterval = setInterval(
            () => {
                this.classifySegment(mediaUri);
            },
            this.audioSegmentSeconds * 1000
        );
    }

    private handlePlayerStopped(): void {
        clearInterval(this.classificationInterval);
        this.presenter.clear();
    }

    private async classifySegment(mediaUri: string): Promise<ClassificationResultsByModel> {
        const currentSecond = Math.round(this.player.getCurrentTime());
        const segment = {
            mediaUri,
            fromSecond: currentSecond,
            toSecond: currentSecond + this.audioSegmentSeconds
        };

        let result;
        if (!this.running) {
            try {
                this.running = true;
                result = await this.backendAPI.classifySegment(segment);
                this.clipResults.add(result);
                this.presenter.refresh(this.clipResults);
            } finally {
                this.running = false;
            }
        }
        return result;
    }

}


export interface BackendAPI {

    classifySegment(audioSegment: AudioSegment): Promise<ClassificationResultsByModel>;

}


export interface ResultsPresenter {

    refresh(results: AudioClipClassificationResults): void;
    clear(): void;

}
