
import AudioClipClassificationResults from "../../source/Entities/AudioClipClassificationResults";


describe("AudioClipClassificationResults", () => {

    test("allows add and retrieve last segment", () => {

        const results = new AudioClipClassificationResults(["SVMModel", "NeuralNetworkModel"]);
        const segmentResults = {
            SVMModel: {
                labels: [],
                segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
            },
            NeuralNetworkModel: {
                labels: [],
                segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
            }
        };
        results.add(segmentResults);

        expect(results.getLastSegment()).toEqual({
            SVMModel: {
                labels: [],
                segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
            },
            NeuralNetworkModel: {
                labels: [],
                segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
            }
        });

    });


    test("allows add and retrieve last segment with top N classes", () => {

        const results = new AudioClipClassificationResults(["NeuralNetworkModel"]);
        const segmentResults = {
            NeuralNetworkModel: {
                labels: [
                    { name: "Pop", score: 0.2 },
                    { name: "Rock", score: 0.03 },
                    { name: "Electro", score: 0.3 },
                    { name: "Jazz", score: 0.9 }
                ],
                segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
            }
        };
        results.add(segmentResults);

        expect(results.getLastSegment({ top: 2 })).toEqual({
            NeuralNetworkModel: {
                labels: [
                    { name: "Electro", score: 0.3 },
                    { name: "Jazz", score: 0.9 }
                ],
                segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
            }
        });

    });


    test("returns top genres", () => {
        const results = new AudioClipClassificationResults(["NeuralNetworkModel"]);
        const segmentResults = {
            NeuralNetworkModel: {
                labels: [
                    { name: "Pop", score: 0.2 },
                    { name: "Rock", score: 0.03 },
                    { name: "Electro", score: 0.3 },
                    { name: "Jazz", score: 0.9 }
                ],
                segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
            }
        };
        results.add(segmentResults);

        expect(results.getTopGenres("NeuralNetworkModel", 2)).toEqual(["Jazz", "Electro"]);
    });

    test("returns number of segments", () => {
        const results = new AudioClipClassificationResults(["NeuralNetworkModel"]);
        const segmentResults = {
            NeuralNetworkModel: {
                labels: [
                    { name: "Pop", score: 0.2 },
                    { name: "Rock", score: 0.03 },
                    { name: "Electro", score: 0.3 },
                    { name: "Jazz", score: 0.9 }
                ],
                segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
            }
        };
        results.add(segmentResults);
        results.add(segmentResults);
        results.add(segmentResults);

        expect(results.getSegmentCount()).toBe(3);
    });

    test("returns all segments for a model", () => {
        const results = new AudioClipClassificationResults(["NeuralNetworkModel"]);
        const segmentResults = {
            NeuralNetworkModel: {
                labels: [
                    { name: "Pop", score: 0.2 },
                    { name: "Rock", score: 0.03 },
                    { name: "Electro", score: 0.3 },
                    { name: "Jazz", score: 0.9 }
                ],
                segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
            }
        };
        results.add(segmentResults);
        results.add(segmentResults);


        expect(results.getSegments("NeuralNetworkModel")).toEqual([
            {
                labels: [
                    { name: "Pop", score: 0.2 },
                    { name: "Rock", score: 0.03 },
                    { name: "Electro", score: 0.3 },
                    { name: "Jazz", score: 0.9 }
                ],
                segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
            },
            {
                labels: [
                    { name: "Pop", score: 0.2 },
                    { name: "Rock", score: 0.03 },
                    { name: "Electro", score: 0.3 },
                    { name: "Jazz", score: 0.9 }
                ],
                segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
            }
        ]);
    });


    test.only("returns scores for top genres", () => {
        const results = new AudioClipClassificationResults(["NeuralNetworkModel"]);
        const segmentResults = {
            NeuralNetworkModel: {
                labels: [
                    { name: "Pop", score: 0.2 },
                    { name: "Rock", score: 0.03 },
                    { name: "Electro", score: 0.3 },
                    { name: "Jazz", score: 0.9 }
                ],
                segment: { mediaUri: "", fromSecond: 0, toSecond: 10 }
            }
        };
        results.add(segmentResults);
        results.add(segmentResults);


        expect(results.getTopGenresScores("NeuralNetworkModel", 2)).toEqual({
            Jazz: [0.9, 0.9],
            Electro: [0.3, 0.3]
        });
    });

});
