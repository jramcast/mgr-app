import Axios from "axios";

import { AudioSegment } from "../Entities/AudioSegment";
import { ClassificationResultsByModel } from "../Entities/ClassificationResultsByModel";
import { BackendAPI } from "../Services/MusicGenreClassifier";


export default class BackendAPIAxiosAdapter implements BackendAPI {

    private apiBaseUrl: string;

    constructor(apiBaseUrl: string) {
        this.apiBaseUrl = apiBaseUrl.replace(/\/$/, "");
    }

    public async classifySegment(
        audioSegment: AudioSegment
    ): Promise<ClassificationResultsByModel> {
        const url = this.buildUrl(audioSegment);

        const response = await Axios.get(url);

        return response.data;
    }

    private buildUrl(audioSegment: AudioSegment): string {
        const { mediaUri, fromSecond } = audioSegment;
        const videoId = this.getVideoIdFromUri(mediaUri);
        return `${this.apiBaseUrl}/segment/classify?clip=${videoId}&from=${fromSecond}`;
    }

    private getVideoIdFromUri(videoUri: string): string {
        try {
            const url = new URL(videoUri);
            return url.searchParams.get("v") || "";
        } catch {
            return videoUri;
        }
    }

}
