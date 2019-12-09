
import PlayerEventHandlers from "../../source/Services/PlayerEventHandlers";


describe("PlayerEventHandlers", () => {

    test("when the player starts playing, we start the live genre classification", () => {
        const commands = {
            startLiveGenreClassification: jest.fn()
        };
        const handlers = new PlayerEventHandlers(commands);
        handlers.handlePlayerStartedPlaying("1234");

        expect(commands.startLiveGenreClassification).toHaveBeenCalled();
    });

    test("when the player stops playing, we stop the live genre classification", () => {
        const commands = {
            stopLiveGenreClassification: jest.fn()
        };
        const handlers = new PlayerEventHandlers(commands);
        handlers.handlePlayerStopped();

        expect(commands.stopLiveGenreClassification).toHaveBeenCalled();
    });

});
