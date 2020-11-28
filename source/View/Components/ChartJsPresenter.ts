import Chart from "chart.js";

import { ResultsPresenter } from "../../Services/MusicGenreClassifier";
import AudioClipClassificationResults from "../../Entities/AudioClipClassificationResults";


const CHART_FONT_COLOR = "white";
Chart.defaults.global.defaultFontColor = CHART_FONT_COLOR;


export default class ChartJsPresenter implements ResultsPresenter {

    protected areaCharts: Record<string, Chart> = {};

    constructor(protected readonly downloadMode = false) {
        this.initCharts();
    }

    public refresh(results: AudioClipClassificationResults): void {
        results.models.forEach(modelName => {
            this.updateAreaChart(modelName, results);
            this.updateChartStats(modelName, results);
        });
    }

    public clear(): void {
        for (const chart of Object.values(this.areaCharts)) {
            chart.destroy();
        }
        this.createAreaCharts();
    }

    protected initCharts(): void {
        this.createAreaChartDomElements(
            "neural_network", "FeedForwardNetworkModel",
            "Feed-forward neural network"
        );
        this.createAreaChartDomElements(
            "lstm", "LSTMRecurrentNeuralNetwork",
            "Long short-term memory (LSTM) neural network"
        );
        this.createAreaChartDomElements("naive_bayes", "NaiveBayesModel", "Naive Bayes");
        this.createAreaChartDomElements("svm", "SVMModel", "Support Vector Machine");
    }

    protected createAreaCharts(): void {
        this.areaCharts = {
            FeedForwardNetworkModel: this.createAreaChart("neural_network"),
            LSTMRecurrentNeuralNetwork: this.createAreaChart("lstm"),
            NaiveBayesModel: this.createAreaChart("naive_bayes"),
            SVMModel: this.createAreaChart("svm")
        };
    }

    protected createAreaChartDomElements(elementId: string, chartId: string, name: string): void {
        const canvas = document.createElement("canvas");
        canvas.id = elementId;
        canvas.height = 90;
        const button = document.createElement("button");
        button.innerHTML = "Download";
        const downloadLink = document.createElement("a");

        button.addEventListener("click", () => {
            const base64Img = this.areaCharts[chartId].toBase64Image();
            downloadLink.href = base64Img;
            downloadLink.download = `${elementId}.png`;
            downloadLink.click();
        });
        button.className = "download button";

        const title = document.createElement("h3");
        title.className = "title is-4 chart-title";
        title.innerText = name;

        const chartContainer = document.createElement("div");
        chartContainer.className = "chart-container";
        chartContainer.appendChild(title);
        chartContainer.appendChild(canvas);
        if (this.downloadMode) {
            chartContainer.appendChild(button);
        }
        chartContainer.appendChild(downloadLink);

        const statsContainer = document.createElement("div");
        statsContainer.id = chartId + "_stats";
        statsContainer.className = "stats-container";

        const ol = document.createElement("ol");
        ol.className = "stats-list";
        const statsTitle = document.createElement("h4");
        statsTitle.className = "title is-5";
        statsTitle.innerHTML = "Top genres after <span class=\"segment-count\">0</span> processed segments";
        const para = document.createElement("p");
        para.innerText = "The score of each genre is the average value of the genre scores returned by the model in each of the processed segments. " +
        "We also provide the normalized score, which represents the strength that the classifier assigns to each genre.";
        statsContainer.appendChild(statsTitle);
        statsContainer.appendChild(para);
        statsContainer.appendChild(ol);


        const mainContainer = document.getElementById("mainContainer");
        if (mainContainer) {
            mainContainer.append(chartContainer);
            mainContainer.append(statsContainer);
        }
    }


    protected createAreaChart(elementId): Chart {
        const element: any = document.getElementById(elementId);

        if (!element) {
            throw new Error("Element for chart not found");
        }

        const ctx = element.getContext("2d");

        return new Chart(ctx, {
            type: "line",
            data: {
                datasets: this.createAreaDataStructure(),
                labels: ["0"]
            },
            options: {
                elements: {
                    line: {
                        fill: "bottom" // By default, fill lines to the previous dataset
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            display: true,
                            min: 0,
                            stepSize: 10,
                            fontSize: 12
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            fontSize: 12
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Score (stacked)"
                        }
                    }]
                }
            }

        });
    }


    protected updateAreaChart(modelName: string, results: AudioClipClassificationResults): void {
        const chart = this.areaCharts[modelName];

        const topGenres = results.getTopGenres(modelName, 10);
        const data = results.getTopGenresScores(modelName, 10);

        chart.data.datasets = this.createAreaDataStructure(
            topGenres,
            topGenres.map(genre => data[genre])
        );

        const segments = results.getSegments(modelName);
        const lastSegment = segments[segments.length - 1];

        if (chart.data.labels) {
            chart.data.labels.push(formatTime(lastSegment.segment.toSecond));
        }

        chart.update();
    }

    protected updateChartStats(modelName: string, results: AudioClipClassificationResults): void {
        const statsContainer = getStatsContainer(modelName);
        const listsElements = statsContainer?.getElementsByClassName("stats-list");
        const counterElements = statsContainer?.getElementsByClassName("segment-count");

        if (listsElements && listsElements.length > 0){
            const ol = listsElements[0];
            const genres = results.getTopGenres(modelName, 10);
            const scores = results.getTopGenresAverageScore(modelName, 10);
            const normalizedScores = results.getTopGenresNormalizedAverageScore(modelName, 10);
            results.getSegmentCount();

            ol.innerHTML = "";
            genres.forEach(genre => {
                ol.innerHTML +=`<li>
                    <strong>${genre}</strong>: ${scores[genre].toFixed(5)}
                    (normalized: ${normalizedScores[genre].toFixed(2)})
                </li>`;
            });
        }

        if (counterElements && counterElements.length > 0) {
            counterElements[0].innerHTML = `${results.getSegmentCount()}`;
        }

    }


    protected createAreaDataStructure(genres: string[] = [], data?: number[][]): any[] {
        return genres.map((label, index) => ({
            label,
            data: data ? [0].concat(data[index]) : [0],
            fill: "origin",
            backgroundColor: this.getGenreColor(label)
        }));
    }

    protected getGenreColor(genre: string): string {
        if (this.downloadMode) {
            return getGenreColorForDownload(genre);
        }
        return `${getGenreColorForDownload(genre)}DD`;
    }


}


function formatTime(totalSeconds: number): string {
    const secondsPerMinute = 60;
    const minutes = Math.floor(totalSeconds / secondsPerMinute);
    const seconds = totalSeconds - (minutes * secondsPerMinute);
    return `${minutes}:${seconds || "00"}`;
}

function getStatsContainer(modelName: string): HTMLElement | null {
    return document.getElementById(modelName + "_stats");
}

function getGenreColorForDownload(genre: string): string {
    const colors = {
        "Pop music": "#5ede83",
        "Hip hop music": "#8038be",
        Beatboxing: "#4bd85b",
        "Rock music": "#ab0096",
        "Heavy metal": "#90be06",
        "Punk rock": "#8373ff",
        Grunge: "#409600",
        "Progressive rock": "#ec5ddd",
        "Rock and roll": "#018c3a",
        "Psychedelic rock": "#db82ff",
        "Rhythm and blues": "#316200",
        "Soul music": "#0153ca",
        Reggae: "#f68e09",
        Country: "#718dff",
        "Swing music": "#c29200",
        Bluegrass: "#264da8",
        Funk: "#ee5527",
        "Folk music": "#41a5ff",
        "Middle Eastern music": "#d50330",
        Jazz: "#00b97c",
        Disco: "#e10074",
        "Classical music": "#71d9b7",
        Opera: "#ff3564",
        "Electronic music": "#02602c",
        "House music": "#ff7bda",
        Techno: "#888100",
        Dubstep: "#cb97ff",
        "Drum and bass": "#805700",
        Electronica: "#60c1ff",
        "Electronic dance music": "#992b03",
        "Ambient music": "#92c0ff",
        "Trance music": "#a24d00",
        "Music of Latin America": "#d0afff",
        "Salsa music": "#a5121d",
        Flamenco: "#00806e",
        Blues: "#ff5b54",
        "Music for children": "#3f5086",
        "New-age music": "#bcce7e",
        "Vocal music": "#a70074",
        "A capella": "#d4c778",
        Chant: "#a80136",
        Mantra: "#ecbf77",
        "Music of Africa": "#704372",
        Afrobeat: "#ff8d75",
        "Christian music": "#6f5989",
        "Gospel music": "#7e4315",
        "Music of Asia": "#997cae",
        "Carnatic music": "#daaa82",
        "Music of Bollywood": "#86375a",
        Ska: "#e5a0be",
        "Traditional music": "#92504f",
        "Independent music": "#ff87b9"
    };

    return colors[genre] || "#000000";
}
