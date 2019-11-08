import { JSDOM } from "jsdom";

import SongForm from "../../../source/View/Components/SongForm";


describe("View components: SongForm", () => {

    beforeAll(async () => {
        const dom = await JSDOM.fromFile("./source/index.html");
        Object.defineProperty(window, "document", {
            writable: true,
            value: dom.window.document
        });
    });

    test("can be created", () => {
        const form = new SongForm("songForm", "songUriInput");
    });

});
