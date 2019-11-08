import YouTubePlayer from "./View/YouTubePlayer";
import SongForm from "./View/Components/SongForm";


const form = new SongForm("songForm", "songUri");
const player = new YouTubePlayer("player");

form.onSubmit(() => {
    player.play(form.getSongUri());
});

