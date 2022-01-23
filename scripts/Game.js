export class Game
{
    players; // массив игроков

    static #slotsNum = 28; // число слотов на доске

    static #getPotentialNewPos(curPos, diceNum) {
        return (curPos + diceNum) % Game.#slotsNum;
    }

    constructor(players) {
        this.players = players;
        this.move = this.move.bind(this);
    }

    move(order, diceNumber, event) {
        // здесь обработчик EventListener'a

        const clickedSlotIndex = event.target?.index;

        if (!clickedSlotIndex) {
            throw new Error("Something's wrong! A slot doesn't have an index!");
        }

        const currentPlayer = this.players[order];

        // если rightTurn = true, кликнута€ пешка принадлежит текущему игроку
        const rightTurn = currentPlayer.hasPawnOnPosition(clickedSlotIndex);

        if (!rightTurn) {
            return `“екущий игрок с цветом ${currentPlayer.color}.
                 ликните по фишке этого цвета или пропустите ход`;
        }

        const newPos = Game.#getPotentialNewPos(clickedSlotIndex, diceNumber);

        // ! перед проверкой ниже добавить проверку, не прошли ли круг пешкой

        for (player of players) {
            if (player.hasPawnOnPosition(newPos)) {
                if (player === currentPlayer) {
                    return "’од невозможен. ѕешка встает на вашу другую пешку"
                }
                player.pawnsOnField.delete(newPos);

                break;
            }
        }
    }
}