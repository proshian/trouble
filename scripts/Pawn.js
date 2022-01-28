export class Pawn {
    /** @type {HTMLElement} */
    pawn;

    /** @type {number | null} */
    finishPosition = null;

    get atFinishSlot() {
        return !(finishPosition === null);
    }

    /** @type {number | null} */
    fieldPosition = null;

    get onField() {
        return !(fieldPosition === null);
    }

    get atHome() {
        return finishPosition === null && fieldPosition === null;
    }
}