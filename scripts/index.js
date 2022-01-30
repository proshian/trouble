import { boardCreation } from './boardCreation.js';
import { Player } from './Player.js';
import { Game } from './Game.js';
import { Dice } from './Dice.js';

gameInitialization();

function gameInitialization() {
	// во все слоты всех домов добавить пешки, если их нет
	fillEmptyHomeSolts()

	const players = [];

	const colors = Array.from(Player.colors);	// получим массив цветов игроков
	//shuffleArray(colors);
	const startPositions = Array.from(Player.startPositions); // массив стартовых позиций
	//shuffleArray(startPositions);

	const homes = document.querySelectorAll('.home');

	//console.log(colors);
	// цикл ниже - временный способ инициализирвать игроков
	for (let i = 0; i < 4; i++) {
		const color = colors[i];	// ! изменить

		const startPosition = startPositions[i]; // ! изменить
		const player = new Player(startPosition, color, i, homes[i]);
		/*player.pawnsOnField.add(startPosition);
		const startSlot = Game.getSlotByIndex(startPosition);
	
		startSlot.style.backgroundColor = color;*/
		players.push(player);
	}



	boardCreation(players);

	const diceElement = document.querySelector('.dice');
	const dice = new Dice(diceElement);


	const colorIndicator = document.querySelector('.current-player-color-indicator');
	const gameDiv = document.querySelector('.game');

	new Game(
		players,
		dice,
		colorIndicator,
		gameDiv,
		document.querySelector('.message'),
	);
}


function createPawnElement() {
	const useTag = document.createElement('use');
	useTag.href = "img/pawn.svg#pawn";
	const svgPawn = document.createElement('svg');
	svgPawn.classList.add('pawn');
	svgPawn.appendChild(useTag);

	return svgPawn;

}

function fillEmptyHomeSolts() {
	const homeSlots = document.querySelectorAll('.home-slot');
	for (const homeSlot of homeSlots) {
		const pawnELement = homeSlot.querySelector('.pawn');
		if (pawnELement == null) {
			homeSlot.appendChild(
				createPawnElement()
			);
		}
	}
}



/*
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
*/