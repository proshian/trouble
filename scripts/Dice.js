/**
* Игральный кубик
*/
export class Dice {
	/** @type {HTMLElement} */
	dice;

	/** @type {number} */
	num;

	/** @type {number} */
	static diceSides = 6;

	/** @type {string}  **/
	static diceImgDirectory = './img/diceSeparate/';

	/** @type {Array<string>}  **/
	static diceImgNames = ['1.svg', '2.svg', '3.svg', '4.svg', '5.svg', '6.svg'];

	/**
	 * Игральный кубик
	 *
	 * @param {HTMLElement} dice HTML элемент игрального кубика
	 */
	constructor(dice) {
		this.dice = dice;
		this.throwDice();
	}

	/**
	 * записыает в dice слуайное значение от 1 до 6
	 *
	 * @param {string | number} value Новое значение
	 */
	throwDice() {
		this.num = Math.floor(Math.random() * Dice.diceSides) + 1;
		this.dice.style.backgroundImage = `url(${Dice.diceImgDirectory}${Dice.diceImgNames[this.num - 1]})`;
	}
}