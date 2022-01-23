import { slotArray } from './boardCreation.js';
import { Player } from './Player.js';
import { Game } from './Game.js';

console.log(slotArray);



const a = new Player(3, 'green', 0);
console.log(a);




function throwDice() {
	return Math.floor(Math.random() * 6) + 1;
}