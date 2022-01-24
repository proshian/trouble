export class Dice {
	/** @type {HTMLElement} */
	dice;

	/** @type {number} */
	num;

	/** @type {number} */
	static diceSides = 6;

	/** @type {string}  **/
	static diceImgDirectory = './img/dice/';

	/** массив строк **/
	static diceImgNames = ['1.svg', '2.svg', '3.svg', '4.svg', '5.svg', '6.svg'];

	throwDice() {
		this.num = Math.floor(Math.random() * Dice.diceSides) + 1;
		this.dice.style.backgroundImage = `url(${Dice.diceImgDirectory}${Dice.diceImgNames[this.num - 1]})`;
	}

	constructor(dice) {
		this.dice = dice;
		this.throwDice();
    }
}