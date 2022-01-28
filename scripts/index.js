import { boardCreation } from './boardCreation.js';
import { Player } from './Player.js';
import { Game } from './Game.js';
import { Dice } from './Dice.js';
import { Pawn } from './Pawn.js';

/*
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
*/


boardCreation();




function createPawnElement() {
	useTag = document.createElement('use');
	useTag.href = 'img/pawn.svg#pawn';
	svgPawn = document.createElement('svg');
	svgPawn.classList.add('pawn');
	svgPawn.appendChild(useTag);
	return svgPawn;
}

const players = [];

const colors = Array.from(Player.colors)
//shuffleArray(colors);

const startPositions = Array.from(Player.startPositions)
//shuffleArray(startPositions);

const homes = document.querySelectorAll('.home');
const homesArray = Array.from(homes);

// заполнение массива игроков
for (let i = 0; i < 4; i++) {
	//const pawns = home.querySelectorAll('.pawn');
	const pawns = [];
	const color = colors[i];	// ! изменить
	const startPosition = startPositions[i]; // ! изменить
	const home = homes[i];

	const homeSlots = home.querySelectorAll('.home-slot');

	// в интерфейсе могут быть пешки, а можно реализовать интерфейс без пешек
	// на случай, если пешек нет добавим проверку и добавление пешек в этой проверке
	for (const homeSlot of homeSlots) {
		let pawnELement = homeSlot.querySelector('.pawn');
		if (!pawnELement) {
			pawnELement = createPawnElement();
			homeSlot.appendChild(pawnELement);
        }
		pawns.push(new Pawn(pawnELement));
	}

	console.log(pawns);
	const player = new Player(startPosition, color, i, home, pawns);

	

	players.push(player);
}

const diceElement = document.querySelector('.dice');
const dice = new Dice(diceElement);


const colorIndicator = document.querySelector('.current-player-color-indicator');
const gameDiv = document.querySelector('.game');

new Game(players, dice, colorIndicator, gameDiv);