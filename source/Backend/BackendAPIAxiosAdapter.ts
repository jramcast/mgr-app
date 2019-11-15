import Axios from "axios";

import { AudioSegment } from "../Entities/AudioSegment";
import { ClassificationResults } from "../Entities/AudioSegmentClassificationResults";
import { BackendAPI } from "../Services/MusicGenreClassifier";


export default class BackendAPIAxiosAdapter implements BackendAPI {

    private apiBaseUrl: string;

    constructor(apiBaseUrl: string) {
        this.apiBaseUrl = apiBaseUrl.replace(/\/$/, "");
    }

    public async classifySegment(
        audioSegment: AudioSegment
    ): Promise<ClassificationResults> {
        const url = this.buildUrl(audioSegment);

        const response = await Axios.get(url);

        return response.data;
    }

    private buildUrl(audioSegment: AudioSegment): string {
        return `${this.apiBaseUrl}/segment/classify?clip=${audioSegment.mediaUri}&from=${audioSegment.fromSecond}`;
    }

}
