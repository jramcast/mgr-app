import { BackendAPI } from "../../source/Services/MusicGenreClassifier";
import { AudioSegment } from "../../source/Entities/AudioSegment";
import { ClassificationResults } from "../../source/Entities/AudioSegmentClassificationResults";
export class FakeBackendAPI implements BackendAPI {
    public async classifySegment(audioSegment: AudioSegment): Promise<ClassificationResults> {
        return { NaiveBayes: [] };
    }
}
