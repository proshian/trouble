/**
	* Игрок
*/
export class Player {
	/** @type { number } */
	static allPawns = 4; // у игрока всегда суммарное число пешек равно 4

	/** @type { Set<number> } */
	static colors = new Set(
		['blue', 'yellow', 'green', 'red']
	);

	/** @type { Set<number> } */
	static startPositions = new Set(
		[0, 7, 14, 21]	// ! возможно лучше не хардкодить, а генерировать
						// это же просто (prevEl+7)%28
	);

	/** @type { number } */
	startPosition;

	/** @type { number } */
	get endPosition() {
		const slotsNum = 28; // число слотов поля // ! возможно, стоит импортировать Game и оттуда slotsNum
		return (this.startPosition + slotsNum - 1) % slotsNum;
    }

	/** @type { string } */
	color;

	/** @type { number } */
	order;

	/** @type {HTMLElement} */
	home;

	/** @type {HTMLElement} */
	finish;

	/** @type {Set<number>} */
	blockedFinishSlots = new Set(); // занятые слоты финиша // множество number 
	pawnsOnField = new Set();	// номера слотов поля, содержащих пешки данного игрока // множество number
	get homePawnsNum() {  // число пешек в доме // number
		return Player.allPawns - this.blockedFinishSlots.size - this.pawnsOnField.size;
	}

	/**
	 * Игрок
	 *
	 * @param {number} startPosition стартовая позиция
	 * @param {string} color Цвет (подставляется в HTML элементы, имеющие отношение к игроку)
	 * @param {number} order Очередность в игре
	 * @param {HTMLElement} home HTML элемент дома грока
	 * @param {HTMLElement} finish HTML элемент финиша грока
	 */
	constructor(startPosition, color, order, home, finish) {
		if (!Player.startPositions.has(startPosition))
			throw new Error(`Incorrect start position value: "${startPosition}"`);

		if (!Player.colors.has(color))
			throw new Error(`Incorrect color value: "${color}"`);

		this.startPosition = startPosition;
		this.color = color;
		this.order = order;
		this.home = home;
		this.home.style.backgroundColor = this.color;

		this.hasPawnOnPosition = this.hasPawnOnPosition.bind(this);

    }

	/**
	 * Проверяет наличие пешки на позиции
	 *
	 * @param {number} pos Проверяемая позиция
	 */
	hasPawnOnPosition(pos) {	// если нужна то только ради абстракции
		return this.pawnsOnField.has(pos);
	}
}