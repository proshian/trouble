import { boardCreation } from './boardCreation.js';
import { Player } from './Player.js';
import { Game } from './Game.js';
import { Dice } from './Dice.js';



function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

//console.log(slotArray);

boardCreation();
const players = [];

const colors = Array.from(Player.colors)
shuffleArray(colors);

const startPositions = Array.from(Player.startPositions)
shuffleArray(startPositions);

// цикл ниже создает имитацию состояния игры
for (let i = 0; i < 4; i++) {
	const color = colors[i];	// ! изменить
	const startPosition = startPositions[i]; // ! изменить
	const player = new Player(startPosition, color, i);
	/*player.pawnsOnField.add(startPosition);
	const startSlot = Game.getSlotByIndex(startPosition);

	startSlot.style.backgroundColor = color;*/
	players.push(player);
}

const diceElement = document.querySelector('.dice');
const dice = new Dice(diceElement);
const colorIndicator = document.querySelector('.current-player-color-indicator');

const game = new Game(players, dice, colorIndicator);

const gameElement = document.querySelector('.game');

const field = document.querySelector('.field');



gameElement.addEventListener(
	'click',
	() => game.move(event)		
    
)


