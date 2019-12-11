import MusicGenreClassifier, { BackendAPI } from "../../source/Services/MusicGenreClassifier";
import { Player } from "../../source/View/Player";
import { FakeBackendAPI } from "../_fakes/FakeBackendAPI";
import FakePlayer from "../_fakes/FakePlayer";
import ResultsFakePresenter from "../_fakes/ResultsFakePresenter";


describe("MusicGenreClassifier", () => {

    let backendAPI: BackendAPI;
    let player: Player;
    let resultsPresenter: ResultsFakePresenter;
    let classifier: MusicGenreClassifier;

    beforeEach(() => {
        player = new FakePlayer();
        backendAPI = new FakeBackendAPI();
        resultsPresenter = new ResultsFakePresenter();
        classifier = new MusicGenreClassifier(player, backendAPI, resultsPresenter);
    });


    test("startLiveClassification() plays the media", async() => {
        player.play = jest.fn();

        await classifier.startLiveClassification("abc1234");

        expect(player.play).toHaveBeenCalled();
    });

});
