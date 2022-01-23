export class Player {

	static allPawns = 4; // у игрока всегда суммарное число пешек равно 4

	static colors = new Set(
		['red', 'green', 'yellow', 'blue']
	);

	static startPositions = new Set(
		[24, 3, 10, 17]	// ! возможно лучше не захардкодить, а сгенерировать
						// это же просто (prevEl+7)%28
	);

	constructor(startPosition, color, order) {
		if (!Player.startPositions.has(startPosition))
			throw new Error(`Incorrect start position value: "${startPosition}"`);

		if (!Player.colors.has(color))
			throw new Error(`Incorrect color value: "${color}"`);

		this.startPosition = startPosition;
		this.color = color;
		this.order = order;
    }

	startPosition;
	color;
	order;

	blockedFinishSlots = new Set(); // занятые слоты финиша // множество number 
	pawnsOnField = new Set();	// номера слотов поля, содержащих пешки данного игрока // множество number
	get homePawnsNum() {  // число пешек в доме // number
		return Player.allPawns - this.blockedFinishSlots.size - this.pawnsOnField.size;
	}

	hasPawnOnPosition(pos) {	// если нужна тотолько ради абстракции
		return pawnsOnField.has(pos);
	}
}