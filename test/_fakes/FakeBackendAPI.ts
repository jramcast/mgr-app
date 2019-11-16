import { BackendAPI } from "../../source/Services/MusicGenreClassifier";
import { AudioSegment } from "../../source/Entities/AudioSegment";
import { ClassificationResultsByModel } from "../../source/Entities/ClassificationResultsByModel";


export class FakeBackendAPI implements BackendAPI {

    public async classifySegment(segment: AudioSegment): Promise<ClassificationResultsByModel> {
        return {
            NaiveBayes: {
                labels: [],
                segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
            }
        };
    }

}
