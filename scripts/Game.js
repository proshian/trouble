export class Game
{
    players; // ������ �������

    static #slotsNum = 28; // ����� ������ �� �����

    static #getPotentialNewPos(curPos, diceNum) {
        return (curPos + diceNum) % Game.#slotsNum;
    }

    constructor(players) {
        this.players = players;
        this.move = this.move.bind(this);
    }

    move(order, diceNumber, event) {
        // ����� ���������� EventListener'a

        const clickedSlotIndex = event.target?.index;

        if (!clickedSlotIndex) {
            throw new Error("Something's wrong! A slot doesn't have an index!");
        }

        const currentPlayer = this.players[order];

        // ���� rightTurn = true, ��������� ����� ����������� �������� ������
        const rightTurn = currentPlayer.hasPawnOnPosition(clickedSlotIndex);

        if (!rightTurn) {
            return `������� ����� � ������ ${currentPlayer.color}.
                �������� �� ����� ����� ����� ��� ���������� ���`;
        }

        const newPos = Game.#getPotentialNewPos(clickedSlotIndex, diceNumber);

        // ! ����� ��������� ���� �������� ��������, �� ������ �� ���� ������

        for (player of players) {
            if (player.hasPawnOnPosition(newPos)) {
                if (player === currentPlayer) {
                    return "��� ����������. ����� ������ �� ���� ������ �����"
                }
                player.pawnsOnField.delete(newPos);

                break;
            }
        }
    }
}