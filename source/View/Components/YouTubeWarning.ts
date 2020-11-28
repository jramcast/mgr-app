export function show() {
    const warning = document.getElementById("youtube-warning");
    const warningCloseButton = document.getElementById("youtube-warning-close");
    if (warning && warningCloseButton) {
        warningCloseButton.addEventListener("click", () => {
            warning.style.display = 'none';
        });
    }
    setDisplayValue('block');
    setTimeout(hide, 5000);
}

export function hide() {
    setDisplayValue('none');
}

function setDisplayValue(value: string) {
    const warning = document.getElementById("youtube-warning");

    if (warning) {

        warning.style.display = value;
    }
}
