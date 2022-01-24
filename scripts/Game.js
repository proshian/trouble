export class Game {
    players; // массив игроков
    dice; // Dice
    curOrder; // нужно хранить, потому что если игрок ткнул не туда, кубик не бросаетс€ снова

    static #slotsNum = 28; // число слотов на доске

    //update

    

    static getSlotByIndex(index) {
        return document.querySelector(`div.field>.feildSlot[data-index = "${index}"]`);
    }

    static #getPotentialNewPos(curPos, diceNum) {
        return (curPos + diceNum) % Game.#slotsNum;
    }

    updateColorIndicator() {
        this.colorIndicator.style.backgroundColor = this.players[this.curOrder].color;
    }

    constructor(players, dice, colorIndicator) {
        this.players = players;
        this.curOrder = 0;
        this.dice = dice;
        this.colorIndicator = colorIndicator;
        this.updateColorIndicator()
    }

    static movePawnToHome(victimPlayer, attackerPlayer, curPos, curPosSlot) { // ! ¬озмжно, лучше сделать методом Player'а
        victimPlayer.pawnsOnField.delete(curPos);
        curPosSlot.style.backgroundColor = attackerPlayer.color;
    }

    move(event) {
        console.log(this.dice);
        // здесь обработчик EventListener'a
        console.log("curOrder = " + this.curOrder);
        //const diceNumber = Game.throwDice(); // раньше передавал параметром
        console.log("dice" + this.dice.num);

        const clickedSlotIndex = Number(event.target.dataset?.index); // ! ¬озможно, лучше parseInt

        // можно было бы поставить строгое сравнение, ведь ?. в случае неудачи возвращает undefined
        // на вс€кий случай ешил сравнивать с любой пустотой
        if (clickedSlotIndex == undefined) {
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

        const newPos = Game.#getPotentialNewPos(clickedSlotIndex, this.dice.num);

        console.log("newPos = " + newPos);

        // ! перед проверкой ниже добавить проверку, не прошли ли круг пешкой

        for (const player of this.players) {
            if (player.hasPawnOnPosition(newPos)) {
                if (player === currentPlayer) {
                    return "’од невозможен. ѕешка встает на вашу другую пешку"
                }
                Game.movePawnToHome(player, currentPlayer, newPos, event.target);
            }
        }

        currentPlayer.pawnsOnField.delete(clickedSlotIndex); // ! Ёти две аперации можно объединить в одну
        currentPlayer.pawnsOnField.add(newPos);

        event.target.style.backgroundColor = "";
        Game.getSlotByIndex(newPos).style.backgroundColor = currentPlayer.color;

        this.curOrder = (this.curOrder + 1) % 4;
        this.dice.throwDice();

        this.updateColorIndicator()
    }
}