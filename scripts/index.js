import { slotArray } from './boardCreation.js';
import { Player } from './Player.js';
import { Game } from './Game.js';

//console.log(slotArray);


const players = [];

// ���� ���� ������� �������� ��������� ����
for (let i = 0; i < 4; i++) {
	const color = Array.from(Player.colors)[i];	// ! ��������
	const startPosition = Array.from(Player.startPositions)[i]; // ! ��������
	const player = new Player(startPosition, color, i);
	player.pawnsOnField.add(startPosition);
	const startSlot = Game.getSlotByIndex(startPosition);

	startSlot.style.backgroundColor = color;
	players.push(player);
}

const game = new Game(players);

const field = document.querySelector('.field');



field.addEventListener(
	'click',
	() => game.move(event)		
    
)


