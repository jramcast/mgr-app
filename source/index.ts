import "./styles.css";
import YouTubePlayer from "./View/Components/YouTubePlayer";
import SongForm from "./View/Components/SongForm";
import BackendAPIAxiosAdapter from "./Backend/BackendAPIAxiosAdapter";
import MusicGenreClassifier from "./Services/MusicGenreClassifier";
import ChartJsPresenter from "./View/Components/ChartJsPresenter";

// Injected by webpack
declare const API_URL;

// Define DOM element ids
const songFormElementId = "songForm";
const songInputElementId = "songUriInput";
const playerElementId = "player";


// Setup view components
const form = new SongForm(songFormElementId, songInputElementId);
const player = new YouTubePlayer(playerElementId);

// Setup backend api adapter
const backendAPI = new BackendAPIAxiosAdapter(API_URL);

// Setup results presenter
const presenter = new ChartJsPresenter();

// Setup music classifier service
const classifier = new MusicGenreClassifier(player, backendAPI, presenter);

form.onSubmit(() => {
    classifier.startLiveClassification(form.getSongUri());
});
