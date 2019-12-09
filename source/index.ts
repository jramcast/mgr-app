import "./styles.css";
import YouTubePlayer from "./View/Components/YouTubePlayer";
import SongForm from "./View/Components/SongForm";
import BackendAPIAxiosAdapter from "./Backend/BackendAPIAxiosAdapter";
import MusicGenreClassifier from "./Services/MusicGenreClassifier";
import ChartJsPresenter from "./View/Components/ChartJsPresenter";


// Define DOM element ids
const songFormElementId = "songForm";
const songInputElementId = "songUriInput";
const playerElementId = "player";


// Setup view components
const form = new SongForm(songFormElementId, songInputElementId);
const player = new YouTubePlayer(playerElementId);

// Setup backend api adapter
let apiBaseUrl;
if (process.env.BUILD_ENV === "production") {
    apiBaseUrl = "https://9f1a5f0e-03f3-4dd4-b222-a314c9eea74d.pub.cloud.scaleway.com";
} else {
    apiBaseUrl = "http://localhost:5000";
}
const backendAPI = new BackendAPIAxiosAdapter(apiBaseUrl);

// Setup results presenter
const presenter = new ChartJsPresenter();

// Setup music classifier service
const classifier = new MusicGenreClassifier(player, backendAPI, presenter);

form.onSubmit(() => {
    classifier.startLiveClassification(form.getSongUri());
});
