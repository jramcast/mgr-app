import { ResultsPresenter } from "../../source/Services/MusicGenreClassifier";


export default class ResultsFakePresenter implements ResultsPresenter {

    public refresh(results: any): void {
        return undefined;
    }

    public clear(): void {
        return undefined;
    }

}
