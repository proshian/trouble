export class Game {
    players; // ������ �������
    dice; // Dice
    curOrder; // ����� �������, ������ ��� ���� ����� ����� �� ����, ����� �� ��������� �����

    static #slotsNum = 28; // ����� ������ �� �����

    static getSlotByIndex(index) {
        //return document.querySelector(`div.field>.feildSlot[data-index = "${index}"]`);
        return document.querySelector(`.feildSlot[data-index = "${index}"]`);
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


        for (const player of this.players) {
            Game.getSlotByIndex(player.startPosition).style.backgroundColor = player.color;
        }
    }

    static #movePawnToHome(victimPlayer, attackerPlayer, curPos) { // ! �������, ����� ������� ������� Player'�
        victimPlayer.pawnsOnField.delete(curPos);
        //curPosSlot.style.backgroundColor = attackerPlayer.color;
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
        
        if (player != this.players[this.curOrder]) // ! �������� ����� ��������� � get currentPlayer()
            return "you are not the curent player";

        if (player.homePawnsNum === 0) {
            return "you've got no pawns at home"
        }

        // ! 4 - ��� ������� ����� ����� � ������.
        // �������, ������� ������������� ����� Player � ������������ ��������� Player.allPawns
        if (player.homePawnsNum != 4 && this.dice.num != 6) { 
            return "you've got a free pawn and the dice number is not 6. Choose another pawn."
        }



        console.log(this);

        const newPos = Game.#getPotentialNewPos(
            Game.#getPreviousPos(player.startPosition),
            this.dice.num
        );
        console.log(newPos);
        for (const playerInstance of this.players) { // ! ������������� ��� �������� ( ������� ������� attackCheck() )
            if (playerInstance.hasPawnOnPosition(newPos)) {
                if (playerInstance === player) {
                    return "��� ����������. ����� ������ �� ���� ������ �����"
                }

                Game.#movePawnToHome(playerInstance, player, newPos, event.target);
            }
        }

        player.pawnsOnField.add(newPos);
        const pawnImg = document.createElement('img');
        pawnImg.src = "img/pawn.svg";
        Game.getSlotByIndex(newPos).appendChild(pawnImg);

        this.curOrder = (this.curOrder + 1) % 4;
        this.dice.throwDice();
        this.updateColorIndicator();
        console.log(newPos);
    }

    moveFromField(event) {
        // ����� ���������� EventListener'a

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