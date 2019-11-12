import YouTubePlayer from "./View/Components/YouTubePlayer";
import SongForm from "./View/Components/SongForm";
import BackendAPIAxiosAdapter from "./Backend/BackendAPIAxiosAdapter";
import MusicGenreClassifier from "./Services/MusicGenreClassifier";


// Define DOM element ids
const songFormElementId = "songForm";
const songInputElementId = "songUriInput";
const playerElementId = "player";


// Setup view components
const form = new SongForm(songFormElementId, songInputElementId);
const player = new YouTubePlayer(playerElementId);

// Setup backend api adapter
const backendAPI = new BackendAPIAxiosAdapter("http://localhost:5000/segment/classify?clip=");

// Setup music classifier service
const classifier = new MusicGenreClassifier(player, backendAPI, presenter);

form.onSubmit(() => {
    classifier.startLiveClassification(form.getSongUri());
});
