
import AudioClipClassificationResults from "../../source/Entities/AudioClipClassificationResults";


describe("AudioClipClassificationResults", () => {

    test("allows add and retrieve last segment", () => {

        const results = new AudioClipClassificationResults();
        const segmentResults = {
            labels: [],
            segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
        };
        results.add(segmentResults);

        expect(results.getLastSegment()).toEqual({
            labels: [],
            segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
        });

    });


    test("allows add and retrieve last segment with top N classes", () => {

        const results = new AudioClipClassificationResults();
        const segmentResults = {
            labels: [
                { label: "Pop", score: 0.2 },
                { label: "Rock", score: 0.03 },
                { label: "Electro", score: 0.3 },
                { label: "Jazz", score: 0.9 }
            ],
            segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
        };
        results.add(segmentResults);

        expect(results.getLastSegment({ top: 2 })).toEqual({
            labels: [
                { label: "Jazz", score: 0.9 }
                { label: "Electro", score: 0.3 },
            ],
            segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
        });

    });

});