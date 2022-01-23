export class Game
{
    players; // ������ �������
    diceNumber;
    curOrder; // ����� �������, ������ ��� ���� ����� ����� �� ����, ����� �� ��������� �����

    static #slotsNum = 28; // ����� ������ �� �����

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
        // ����� ���������� EventListener'a
        console.log("curOrder = " + this.curOrder);
        //const diceNumber = Game.throwDice(); // ������ ��������� ����������
        console.log("dice" + this.diceNumber);

        const clickedSlotIndex = Number(event.target.dataset?.index); // ! ��������, ����� parseInt

        if (!clickedSlotIndex) {
            // throw new Error("Something's wrong! A slot doesn't have an index!");
            return console.log("����� ������� ��� ���������� �������� �� �����");
        }



        const currentPlayer = this.players[this.curOrder];
        console.log(currentPlayer);
        // ���� rightTurn = true, ��������� ����� ����������� �������� ������
        const rightTurn = currentPlayer.hasPawnOnPosition(clickedSlotIndex);
        console.log("rightTurn = " + rightTurn);
        if (!rightTurn) {
            return `������� ����� � ������ ${currentPlayer.color}.
                �������� �� ����� ����� ����� ��� ���������� ���`;
        }

        const newPos = Game.#getPotentialNewPos(clickedSlotIndex, this.diceNumber);

        console.log("newPos = " + newPos);

        // ! ����� ��������� ���� �������� ��������, �� ������ �� ���� ������

        for (const player of this.players) {
            if (player.hasPawnOnPosition(newPos)) {
                if (player === currentPlayer) {
                    return "��� ����������. ����� ������ �� ���� ������ �����"
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