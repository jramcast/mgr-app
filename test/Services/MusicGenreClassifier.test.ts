import MusicGenreClassifier, { BackendAPI } from "../../source/Services/MusicGenreClassifier";
import { Player } from "../../source/View/Player";
import { FakeBackendAPI } from "../_fakes/FakeBackendAPI";
import FakePlayer from "../_fakes/FakePlayer";


describe("MusicGenreClassifier", () => {

    let backendAPI: BackendAPI;
    let player: Player;
    let classifier: MusicGenreClassifier;

    beforeEach(() => {
        player = new FakePlayer();
        backendAPI = new FakeBackendAPI();
        classifier = new MusicGenreClassifier(player, backendAPI);
    });

    // REVIEW
    //
    // test.skip("classify() returns results from backendAPI", async() => {
    //     backendAPI.classifySegment = jest.fn().mockResolvedValue({
    //         NaiveBayes: []
    //     });

    //     const result = await classifier.classifySegment({
    //         mediaUri: "abc1234",
    //         fromSecond: 20,
    //         toSecond: 30
    //     });

    //     expect(result).toEqual({ NaiveBayes: [] });
    // });

    // test.skip("classify() does not allow 2 concurrent calls to backend API", () => {
    //     backendAPI.classifySegment = jest.fn();

    //     const audioSegment = {
    //         mediaUri: "abc1234",
    //         fromSecond: 20,
    //         toSecond: 30
    //     };
    //     classifier.classifySegment(audioSegment);
    //     classifier.classifySegment(audioSegment);

    //     expect(backendAPI.classifySegment).toBeCalledTimes(1);
    // });


    test("startLiveClassification() plays the media", () => {
        player.play = jest.fn();

        classifier.startLiveClassification("abc1234");

        expect(player.play).toHaveBeenCalled();
    });

});
