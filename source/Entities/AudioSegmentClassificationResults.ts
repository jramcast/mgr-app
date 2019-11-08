import { AudioSegment } from "./AudioSegment";


export interface ClassificationResults {
    [modelName: string]: ClassificationResultsPerSegment[];
}

export interface ClassificationResultsPerSegment {
    segment: AudioSegment;
    labels: LabelClassificationScore[];
}

export interface LabelClassificationScore {
    label: string;
    score: number;
}
