import { ClassificationResults, LabelClassificationScore, ClassificationResultsByModel } from "./ClassificationResultsByModel";


type ModelName = string;

export default class AudioClipClassificationResults {

    private storage: Record<ModelName, ClassificationResults[]>;

    constructor(public readonly models: ModelName[]) {
        this.storage = {};

        for (const model of models) {
            this.storage[model] = [];
        }
    }

    public add(segmentResults: ClassificationResultsByModel): void {
        for (const model of this.models) {
            // Suppose received segment length is always 0
            this.storage[model].push(segmentResults[model]);
        }
    }


    public getLastSegment({ top = 5 } = {}): ClassificationResultsByModel {
        const byModel = {};

        for (const model of this.models) {
            byModel[model] = this.getLastSegmentPerModel(model, { top });
        }

        return byModel;
    }

    public getTopGenres(model: ModelName, top = 5): string[] {
        const totals = {};

        for (const segment of this.storage[model]) {
            for (const label of segment.labels) {
                totals[label.name] = (totals[label.name] || 0) + label.score;
            }
        }

        return Object.keys(totals)
            .sort((a, b) => totals[b] - totals[a])
            .slice(0, top);
    }

    public getTopGenresScores(model: ModelName, top = 5): Record<ModelName, number[]> {
        const topGenres = this.getTopGenres(model, top);
        const scores = {};
        for (const genre of topGenres) {
            scores[genre] = [];

            for (const segment of this.storage[model]) {
                const label = segment.labels.find(each => each.name === genre);
                let score = label ? label.score : 0;
                if (score < 0) {
                    score = 0;
                }
                scores[genre].push(score);
            }
        }

        return scores;
    }

    public getSegments(model: ModelName): ClassificationResults[] {
        return this.storage[model];
    }

    public getSegmentCount(): number {
        return this.storage[this.models[0]].length;
    }

    private getLastSegmentPerModel(model: ModelName, { top = 5 } = {}): ClassificationResults {
        const topNLabelNames = this.getTopGenres(model, top);

        const lastIndex = this.storage[model].length - 1;
        const segment = this.storage[model][lastIndex];

        const allLabelNames = segment.labels.map(label => label.name);


        const labels = allLabelNames
            .filter(labelName => topNLabelNames.includes(labelName))
            .map(labelName => segment.labels.find(label => label.name === labelName))
            .filter(label => label) as LabelClassificationScore[];

        return {
            segment: segment.segment,
            labels
        };
    }


}
