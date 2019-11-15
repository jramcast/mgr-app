import { ClassificationResultsPerSegment } from "./AudioSegmentClassificationResults";


export default class AudioClipClassificationResults {

    private storage: ClassificationResultsPerSegment[] = [];

    public add(segmentResults: ClassificationResultsPerSegment): void {
        this.storage.push(segmentResults);
    }

    public getLastSegment({ top }: { top: number }): ClassificationResultsPerSegment {

        const totals = {};
        for (const segment of this.storage) {
            for (const label of segment.labels) {
                totals[label.label] = (totals[label.label] || 0) + label.score;
            }
        }

        const topNLabelNames = Object.keys(totals)
            .sort((a, b) => totals[a] - totals[b])
            .slice(0, top);

        const lastIndex = this.storage.length - 1;
        const segment = this.storage[lastIndex];


        return Object.keys(segment.labels)
            .filter(labelName => topNLabelNames.includes(labelName))
            .map(labelName => segment.labels[labelName])
    }


}
