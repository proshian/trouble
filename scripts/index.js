import { boardCreation } from './boardCreation.js';
import { Player } from './Player.js';
import { Game } from './Game.js';
import { Dice } from './Dice.js';


/*
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
*/


function createPawnElement() {
	useTag = document.createElement('use');
	useTag.href = 'img/pawn.svg#pawn';
	svgPawn = document.createElement('svg');
	svgPawn.classList.add('pawn');
	svgPawn.appendChild(useTag);
	return svgPawn;
}


// этот код позволяет инициализировать интерфейс, если в него добавлены не все пешки
const homeSlots = document.querySelectorAll('.home-slot');
for (const homeSlot of homeSlots) {
	const pawnELement = homeSlot.querySelector('.pawn');
	if (!pawnELement) {
		homeSlot.appendChild(
			createPawnElement()
		);
	}
}



const players = [];

const colors = Array.from(Player.colors)
//shuffleArray(colors);



const startPositions = Array.from(Player.startPositions)
//shuffleArray(startPositions);

const homes = document.querySelectorAll('.home');

console.log(colors);
// цикл ниже - временный способ инициализирвать игру
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

new Game(players, dice, colorIndicator, gameDiv);