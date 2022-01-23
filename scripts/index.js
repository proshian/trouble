//import { slotArray } from './boardCreation.js';
import { Player } from './Player.js';
import { Game } from './Game.js';

console.log(slotArray);


const players = [];

for (let i = 0; i < 4; i++) {
	const color = Player.colors[i];
	const startPosition = Player.startPositions[i];
	players.push(new Player(startPosition, color, i));
}

const game = new Game(players);

const field = document.querySelector('.field');





function throwDice() {
	return Math.floor(Math.random() * 6) + 1;
}