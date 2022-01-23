export class Game
{
    players; // массив игроков
    diceNumber;
    curOrder; // нужно хранить, потому что если игрок ткнул не туда, кубик не бросаетс€ снова

    static #slotsNum = 28; // число слотов на доске

    throwDice() {
        const diceSides = 6;
        this.diceNumber = Math.floor(Math.random() * diceSides) + 1;
    }

    static getSlotByIndex(index) {
        return document.querySelector(`div.field>.feildSlot[data-index = "${index}"]`);
    }

    static #getPotentialNewPos(curPos, diceNum) {
        return (curPos + diceNum) % Game.#slotsNum;
    }

    constructor(players) {
        this.players = players;
        this.move = this.move.bind(this);
        this.curOrder = 0;
        this.throwDice();
    }

    move (event) {
        // здесь обработчик EventListener'a
        console.log("curOrder = " + this.curOrder);
        //const diceNumber = Game.throwDice(); // раньше передавал параметром
        console.log("dice" + this.diceNumber);

        const clickedSlotIndex = Number(event.target.dataset?.index); // ! ¬озможно, лучше parseInt

        if (!clickedSlotIndex) {
            // throw new Error("Something's wrong! A slot doesn't have an index!");
            return console.log("„тобы сделать ход необходимо кликнуть по фишке");
        }



        const currentPlayer = this.players[this.curOrder];
        console.log(currentPlayer);
        // если rightTurn = true, кликнута€ пешка принадлежит текущему игроку
        const rightTurn = currentPlayer.hasPawnOnPosition(clickedSlotIndex);
        console.log("rightTurn = " + rightTurn);
        if (!rightTurn) {
            return `“екущий игрок с цветом ${currentPlayer.color}.
                 ликните по фишке этого цвета или пропустите ход`;
        }

        const newPos = Game.#getPotentialNewPos(clickedSlotIndex, this.diceNumber);

        console.log("newPos = " + newPos);

        // ! перед проверкой ниже добавить проверку, не прошли ли круг пешкой

        for (const player of this.players) {
            if (player.hasPawnOnPosition(newPos)) {
                if (player === currentPlayer) {
                    return "’од невозможен. ѕешка встает на вашу другую пешку"
                }
                player.pawnsOnField.delete(newPos);
                event.target.style.backgroundColor = currentPlayer.color;
                return;
                //break;
            }
        }

        currentPlayer.pawnsOnField.delete(clickedSlotIndex);
        currentPlayer.pawnsOnField.add(newPos);

        event.target.style.backgroundColor = "";
        Game.getSlotByIndex(newPos).style.backgroundColor = currentPlayer.color;

        this.curOrder = (this.curOrder + 1) % 4;
        this.throwDice();
    }
}