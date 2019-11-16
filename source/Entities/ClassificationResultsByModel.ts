import { AudioSegment } from "./AudioSegment";


export interface ClassificationResultsByModel {
    [modelName: string]: ClassificationResults;
}

export interface ClassificationResults {
    segment: AudioSegment;
    labels: LabelClassificationScore[];
}

export interface LabelClassificationScore {
    name: string;
    score: number;
}
