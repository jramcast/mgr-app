import YouTubePlayer from "../../../source/View/Components/YouTubePlayer";


describe("View components: YouTubePlayer", () => {

    test("can be played", () => {
        const player = new YouTubePlayer("player");
        player.play("1234");
    });

    test("getCurrentTime() returns the current time of the video in seconds", async() => {
        const player = new YouTubePlayer("player");
        const seconds = player.getCurrentTime();
        expect(seconds).toBe(0);
    });

});
