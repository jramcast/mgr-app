import Chart from "chart.js";

import { ResultsPresenter } from "../../Services/MusicGenreClassifier";
import AudioClipClassificationResults from "../../Entities/AudioClipClassificationResults";


const CHART_FONT_COLOR = "white";
Chart.defaults.global.defaultFontColor = CHART_FONT_COLOR;


export default class ChartJsPresenter implements ResultsPresenter {

    protected areaCharts: Record<string, Chart>;

    constructor() {
        this.createAreaCharts();
    }

    public refresh(results: AudioClipClassificationResults): void {
        results.models.forEach(modelName => {
            this.updateAreaChart(modelName, results);
        });
    }

    public clear(): void {
        // TODO: clear
    }


    protected createAreaCharts(): void {
        this.createAreaChartDomElements("neural_network", "FeedForwardNetworkModel", "Feed-forward network");
        this.createAreaChartDomElements("lstm", "LSTMRecurrentNeuralNetwork", "LSTM Network");
        this.createAreaChartDomElements("naive_bayes", "NaiveBayesModel", "Naive Bayes");
        this.createAreaChartDomElements("svm", "SVMModel", "Support Vector Machine");

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
        canvas.height = 100;
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
        title.className = "title is-3 chart-title";
        title.innerText = name;

        const chartContainer = document.createElement("div");
        chartContainer.className = "chart-container";
        chartContainer.appendChild(title);
        chartContainer.appendChild(canvas);
        chartContainer.appendChild(button);
        chartContainer.appendChild(downloadLink);
        const mainContainer = document.getElementById("mainContainer");
        if (mainContainer) {
            mainContainer.append(chartContainer);
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
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            display: true,
                            min: 0,
                            stepSize: 10,
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Score"
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


    protected createAreaDataStructure(genres: string[] = [], data?: number[][]): any[] {
        return genres.map((label, index) => ({
            label,
            data: data ? [0].concat(data[index]) : [0],
            fill: true,
            backgroundColor: getGenreColor(label)
        }));
    }

}


function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds - (minutes * 60);
    return `${minutes}:${seconds || "00"}`;

}

function getGenreColor(genre: string): string {
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
