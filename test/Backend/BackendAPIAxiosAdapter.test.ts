import Axios from "axios";

import BackendAPIAxiosAdapter from "../../source/Backend/BackendAPIAxiosAdapter";


jest.mock("axios");

describe("BackendAPIAxiosAdapter", () => {

    let api: BackendAPIAxiosAdapter;

    beforeEach(() => {
        (Axios.get as jest.Mock).mockResolvedValue({
            data: {
                results: {}
            }
        });
        api = new BackendAPIAxiosAdapter("http://localhost");
    });


    test("returns data returned by request to backend", async () => {
        (Axios.get as jest.Mock).mockResolvedValue({
            data: {
                NaiveBayes: [{
                    segment: {},
                    labels: [{ label: "Pop music", score: 0.2 }]
                }]
            }
        });

        const result = await api.classifySegment({
            mediaUri: "http://youtube.com/abc123",
            fromSecond: 10,
            toSecond: 20
        });

        expect(result).toEqual({
            NaiveBayes: [{
                segment: {},
                labels: [{ label: "Pop music", score: 0.2 }]
            }]
        });
    });

    test("calls the right url", async() => {
        await api.classifySegment({
            mediaUri: "abc123",
            fromSecond: 10,
            toSecond: 20
        });

        expect(Axios.get).toHaveBeenLastCalledWith("http://localhost/segment/classify?clip=abc123&from=10");
    });

});