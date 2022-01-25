export class Game {
    players; // ������ �������
    dice; // Dice
    curOrder; // ����� �������, ������ ��� ���� ����� ����� �� ����, ����� �� ��������� �����

    static #slotsNum = 28; // ����� ������ �� �����

    static getSlotByIndex(index) {
        return document.querySelector(`div.field>.feildSlot[data-index = "${index}"]`);
    }

    static #getPotentialNewPos(curPos, diceNum) {
        return (curPos + diceNum) % Game.#slotsNum;
    }

    static #getPreviousPos(pos) {
        return (pos + Game.#slotsNum - 1) % Game.#slotsNum;
    }

    updateColorIndicator() {
        this.colorIndicator.style.backgroundColor = this.players[this.curOrder].color;
    }

    constructor(players, dice, colorIndicator) {
        this.players = players;
        this.curOrder = 0;
        this.dice = dice;
        this.colorIndicator = colorIndicator;
        this.updateColorIndicator();

        this.moveFromHome = this.moveFromHome.bind(this); // ! �� ������, ��� ��� ��� �����
    }

    static #movePawnToHome(victimPlayer, attackerPlayer, curPos, curPosSlot) { // ! �������, ����� ������� ������� Player'�
        victimPlayer.pawnsOnField.delete(curPos);
        curPosSlot.style.backgroundColor = attackerPlayer.color;
    }


    move(event) {
        for (const player of this.players) {
            if (player.home.contains(event.target)) {
                this.moveFromHome(player);
                return;
            }
        }

        const field = document.querySelector('.field');

        if (field.contains(event.target)) {
            this.moveFromField(event);
        }
    }

    moveFromHome(player) {
        console.log(player);
        player.startPosition;


        if (player != this.players[this.curOrder]) // ! �������� ����� ��������� � get currentPlayer()
            return "you are not the curent player";

        console.log(this);

        const potentialNewPos = Game.#getPotentialNewPos(
            Game.#getPreviousPos(player.startPosition),
            this.dice.num
        );

        console.log(potentialNewPos);
    }

    moveFromField(event) {
        console.log(this.dice);
        // ����� ���������� EventListener'a
        console.log("curOrder = " + this.curOrder);
        //const diceNumber = Game.throwDice(); // ������ ��������� ����������
        console.log("dice" + this.dice.num);

        const clickedSlotIndex = Number(event.target.dataset?.index); // ! ��������, ����� parseInt

        // ����� ���� �� ��������� ������� ���������, ���� ?. � ������ ������� ���������� undefined
        // �� ������ ������ ���� ���������� � ����� ��������
        if (clickedSlotIndex == undefined) {
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

        const newPos = Game.#getPotentialNewPos(clickedSlotIndex, this.dice.num);

        console.log("newPos = " + newPos);

        // ! ����� ��������� ���� �������� ��������, �� ������ �� ���� ������

        for (const player of this.players) {
            if (player.hasPawnOnPosition(newPos)) {
                if (player === currentPlayer) {
                    return "��� ����������. ����� ������ �� ���� ������ �����"
                }
                Game.#movePawnToHome(player, currentPlayer, newPos, event.target);
            }
        }

        currentPlayer.pawnsOnField.delete(clickedSlotIndex); // ! ��� ��� �������� ����� ���������� � ����
        currentPlayer.pawnsOnField.add(newPos);

        event.target.style.backgroundColor = "";
        Game.getSlotByIndex(newPos).style.backgroundColor = currentPlayer.color;

        this.curOrder = (this.curOrder + 1) % 4;
        this.dice.throwDice();

        this.updateColorIndicator()
    }
}