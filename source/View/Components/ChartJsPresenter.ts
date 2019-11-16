import Chart from "chart.js";

import { ResultsPresenter } from "../../Services/MusicGenreClassifier";
import { ClassificationResults } from "../../Entities/ClassificationResultsByModel";
import AudioClipClassificationResults from "../../Entities/AudioClipClassificationResults";


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
        this.createAreaChartDomElements("neural_network");
        this.createAreaChartDomElements("lstm");
        this.createAreaChartDomElements("naive_bayes");
        this.createAreaChartDomElements("svm");

        this.areaCharts = {
            NeuralNetworkModel: this.createAreaChart("neural_network"),
            LSTMRecurrentNeuralNetwork: this.createAreaChart("lstm"),
            NaiveBayesModel: this.createAreaChart("naive_bayes"),
            SVMModel: this.createAreaChart("svm")
        };
    }

    protected createAreaChartDomElements(id: string): void {
        const canvas = document.createElement("canvas");
        canvas.id = id;
        const button = document.createElement("button");
        button.innerHTML = "Download";
        const downloadLink = document.createElement("a");

        button.addEventListener("click", () => {
            const base64Img = this.areaCharts[id].toBase64Image();
            downloadLink.href = base64Img;
            downloadLink.download = `${id}.png`;
            downloadLink.click();
        });
        button.className = "download";
        const chartContainer = document.createElement("div");
        chartContainer.appendChild(canvas);
        chartContainer.appendChild(button);
        chartContainer.appendChild(downloadLink);
        document.body.append(chartContainer);
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
                legend: {
                    display: true
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            display: true,
                            min: 0,
                            stepSize: 10
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

        const topGenres = results.getTopGenres(modelName, 5);
        const data = results.getTopGenresScores(modelName, 5);

        chart.data.datasets = this.createAreaDataStructure(
            topGenres,
            topGenres.map(genre => data[genre])
        );

        // for (const dataset of chart.data.datasets) {
        //     if (dataset.label) {
        //         dataSetsByLabel[dataset.label] = dataset;
        //     }
        // }

        // for (const prediction of segmentResults.labels) {
        //     dataSetsByLabel[prediction.name].data.push(prediction.score);
        // }

        if (chart.data.labels) {
            const SEGMENT_SECONDS = 10;
            const totalSeconds = results.getSegmentCount() * SEGMENT_SECONDS;
            chart.data.labels.push(formatTime(totalSeconds));
        }

        chart.update();

    }


    protected createAreaDataStructure(genres: string[] = [], data?: number[][]): any[] {

        return genres.map((label, index) => ({
            label,
            data: data ? data[index] : [0],
            fill: true,
            backgroundColor: stringToColour(label)
        }));
    }

}


function stringToColour(str): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash); // eslint-disable-line
    }
    let colour = "#";
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF; // eslint-disable-line
        colour += ('00' + value.toString(16)).substr(-2); // eslint-disable-line
    }
    return colour;
}


function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds - (minutes * 60);
    return `${minutes}:${seconds || "00" }`;

}