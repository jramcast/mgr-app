import Chart from "chart.js";

import { ResultsPresenter } from "../../Services/MusicGenreClassifier";
import { ClassificationResults, ClassificationResultsPerSegment } from "../../Entities/AudioSegmentClassificationResults";


export default class ChartJsPresenter implements ResultsPresenter {

    protected areaCharts: Record<string, Chart>;

    constructor() {
        this.createAreaCharts();
    }

    public refresh(results: ClassificationResults): void {

        const modelNames = Object.keys(results);

        modelNames.forEach((key) => {
            this.updateAreaChart(this.areaCharts[key], results[key][0]);
        });
    }

    public clear(): void {
        throw new Error("Method not implemented.");
    }


    protected createAreaCharts(): void {
        this.areaCharts = {
            NeuralNetworkModel: this.createAreaChart("neural_network"),
            lstm: this.createAreaChart("lstm"),
            naiveBayes: this.createAreaChart("naive_bayes"),
            svm: this.createAreaChart("svm")
        };
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


    protected updateAreaChart(chart: Chart, segmentResults: ClassificationResultsPerSegment): void {
        const dataSetsByLabel = {};

        chart.data.datasets.forEach(function (dataset) {
            dataSetsByLabel[dataset.label] = dataset;
        });

        segmentResults.forEach(function (prediction) {
            dataSetsByLabel[prediction.label].data.push(prediction.score);
        });

        chart.data.labels.push(chart.data.labels[chart.data.labels.length - 1] + 10);

        chart.update();
    }


    protected createAreaDataStructure(): any[] {
        return getLabels().map((label) => {
            return {
                label,
                data: [0],
                fill: true,
                backgroundColor: getRandomColor()
            }
        })
    }


}


function getLabels(): string[] {
    return [
        "Pop music",
        "Hip hop music",
        "Beatboxing",
        "Rock music",
        "Heavy metal",
        "Punk rock",
        "Grunge",
        "Progressive rock",
        "Rock and roll",
        "Psychedelic rock",
        "Rhythm and blues",
        "Soul music",
        "Reggae",
        "Country",
        "Swing music",
        "Bluegrass",
        "Funk",
        "Folk music",
        "Middle Eastern music",
        "Jazz",
        "Disco",
        "Classical music",
        "Opera",
        "Electronic music",
        "House music",
        "Techno",
        "Dubstep",
        "Drum and bass",
        "Electronica",
        "Electronic dance music",
        "Ambient music",
        "Trance music",
        "Music of Latin America",
        "Salsa music",
        "Flamenco",
        "Blues",
        "Music for children",
        "New-age music",
        "Vocal music",
        "A capella",
        "Chant",
        "Mantra",
        "Music of Africa",
        "Afrobeat",
        "Christian music",
        "Gospel music",
        "Music of Asia",
        "Carnatic music",
        "Music of Bollywood",
        "Ska",
        "Traditional music",
        "Independent music"
    ];
}


function getRandomColor(): string {
    const letters = "0123456789ABCDEF".split("");
    let color = "";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
