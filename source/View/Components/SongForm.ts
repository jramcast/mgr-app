export default class SongForm {

    public element: HTMLFormElement;
    public songInputElement: HTMLInputElement;

    constructor(elementId: string, inputSongId: string) {
        const form = document.getElementById(elementId);
        if (!form) {
            throw new Error("Form element not found");
        }
        this.element = form as HTMLFormElement;

        const songInput = document.getElementById(inputSongId);
        if (!songInput) {
            throw new Error("Input element for song in form not found");
        }
        this.songInputElement = songInput as HTMLInputElement;
    }

    public onSubmit(handler: EventHandlerNonNull): void {
        this.element.addEventListener("submit", (event) => {
            handler(event);
            event.preventDefault();
        });
    }

    public getSongUri(): string {
        return this.songInputElement.value;
    }

}
