export class Player {

	static allPawns = 4; // у игрока всегда суммарное число пешек равно 4

	static colors = new Set(
		['red', 'green', 'yellow', 'blue']
	);

	static startPositions = new Set(
		[24, 3, 10, 17]	// ! возможно лучше не хардкодить, а генерировать
						// это же просто (prevEl+7)%28
	);

	/** @type { number } */
	startPosition;

	/** @type { string } */
	color;

	/** @type { number } */
	order;

	/** @type {HTMLElement} */
	home;

	/** @type {Array<Pawn>} */
	pawns;

	constructor(startPosition, color, order, home, pawns) {
		if (!Player.startPositions.has(startPosition))
			throw new Error(`Incorrect start position value: "${startPosition}"`);

		/*
		if (!Player.colors.has(color))
			throw new Error(`Incorrect color value: "${color}"`);
		*/

		this.startPosition = startPosition;
		this.color = color;
		this.order = order;

		this.pawns = pawns;
		for (const pawn of this.pawns) {
			console.log(pawn.style);
			pawn.pawn.style.fill = this.color;
        }

		this.home = home;
		this.home.style.backgroundColor = this.color;

		this.hasPawnOnPosition = this.hasPawnOnPosition.bind(this);

    }

	allPawnsAtHome() {
		for (const pawnObj of pawns) {
			if (!pawnObj.atHome) {
				return false;
            }
		}
		return true;
    }

	hasPawnOnPosition(pos) {	// если нужна то только ради абстракции
		//return this.pawns.feildPositionhas(pos);
		for (const pawn of this.pawns) {
			if (pawn.fieldPosition === pos)
				return true;
		}
		return false;
	}

	// аналогична hasPawnOnPosition
	getPawnWithPos(pos) {
		for (const pawn of this.pawns) {
			if (pawn.fieldPosition === pos)
				return pawn;
		}
		return null;
    }
}