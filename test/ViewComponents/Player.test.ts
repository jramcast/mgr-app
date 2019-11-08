import YouTubePlayer from "../../source/View/YouTubePlayer";


describe("View components: Player", () => {

    test("can be played", () => {
        const player = new YouTubePlayer("player");
        player.play("1234");
    });

});
