// !!!!!!! ��������� � move'�� ����� ������������ �� ����� ��� ���������, � �� ����������
// ��� ����� �� ������ ��������� � attakHandler


export class Game {
    /** @type {Array<Player>} */
    players;

    /** @type {Dice} */
    dice;

    /** @type {number} */
    curOrder; // ����� �������, ������ ��� ���� ����� ����� �� ����, ����� �� ��������� �����

    /** @type {HTMLElement} */
    gameDiv;

    /** @type {number} */
    static #slotsNum = 28; // ����� ������ �� �����

    /** @type {Player} */
    get currentPlayer() {
        return this.players[this.curOrder];
    }

    constructor(players, dice, colorIndicator, gameDiv) {
        this.players = players;
        this.curOrder = 0;
        this.dice = dice;

        this.colorIndicator = colorIndicator;
        this.updateColorIndicator();

        this.moveFromHome = this.moveFromHome.bind(this); // ! �� ������, ��� ��� ��� �����


        // ���������� ��������� ������� ������������� � �� �����
        for (const player of this.players) {
            Game.getSlotByIndex(player.startPosition).style.backgroundColor = player.color;
        }

        this.gameDiv = gameDiv;

        this.gameDiv.addEventListener(
            'click',
            () => this.move(event),
        )
    }


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

    static #movePawnElement(source, dest) { // ! ������ �����, ����� ��������
        const pawnElem = source.firstElementChild;
        if (!pawnElem.classList.contains('pawn')) {
            throw new Error("Something's wrong: an attempt to move a non pawn object!");
        }

        dest.appendChild(source.removeChild(pawnElem));
    }

    static #movePawnElementFromHomeToFeild(player, index) { // ! �������, ����� ��������
        Game.#movePawnElement(
            player.home.querySelector('.pawn').parentElement,
            Game.getSlotByIndex(index)
        );
    }

    

    

    static #movePawnToHome(victimPlayer, curPos) { // ! �������, ����� ������� ������� Player'�
        //victimPlayer.pawnsOnField.delete(curPos);
        const pawnObj = victimPlayer.getPawnWithPos(curPos);
        pawnObj.fieldPosition = null;
        Game.#movePawnElementToHome(pawnObj.pawn);
        pawnObj.pawn;
    }


    static #movePawnElementToHome(fieldSlot, home) { // ! ��������, ����� ��������
        const homeSlots = home.children;
        let lastEmptySlot;
        for (const slot of homeSlots) {
            if (slot.childElementCount) {
                break;
            }
            lastEmptySlot = slot;
        }

        Game.#movePawnElement(fieldSlot, lastEmptySlot);
    }

    // �������� ����
    makeNextPlayerCurrentPlayer() {
        this.curOrder = (this.curOrder + 1) % 4;
        this.dice.throwDice();
        this.updateColorIndicator();
    }

    #attackHandler(newPos) {
        const currentPlayer = this.currentPlayer;
        for (const player of this.players) {
            if (player.hasPawnOnPosition(newPos)) {
                if (player === currentPlayer) {
                    return {
                        message: "��� ����������. ����� ������ �� ���� ������ �����",
                        standsOnOwnPawn: true
                    }
                }
                Game.#movePawnToHome(player, currentPlayer, newPos);
                Game.#movePawnElementToHome(
                    Game.getSlotByIndex(newPos),
                    player.home
                );
                return {
                    message: `����� ������ � ������ ${player.color} ���� �������`,
                    standsOnOwnPawn: false
                }
            }
        }

        return {
            message: null,
            standsOnOwnPawn: false
        }
    }


    static #movePawnFromFToF(player, oldPos, newPos) {
        player.pawnsOnField.delete(oldPos);
        player.pawnsOnField.add(newPos);
    }


    move(event) {
       
        for (const player of this.players) {
            // ���� ������� �� ���� ��� ��������� �������� ���� ������ player
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
        if (player != this.currentPlayer)
            return "you are not the curent player";

        if (player.homePawnsNum === 0) {
            return "you've got no pawns at home"
        }

        // ! 4 - ��� ������� ����� ����� � ������.
        // �������, ������� ������������� ����� Player � ������������ ��������� Player.allPawns
        if (player.allPawnsAtHome() && this.dice.num != 6) { 
            return "you've got a free pawn and the dice number is not 6. Choose another pawn."
        }

        const newPos = Game.#getPotentialNewPos(
            Game.#getPreviousPos(player.startPosition),
            this.dice.num
        );
        //console.log(newPos);

        const attackResult = this.#attackHandler(newPos);
        if (attackResult.standsOnOwnPawn) {
            return attackResult.message;
        }
        
        player.pawnsOnField.add(newPos);
        Game.#movePawnElementFromHomeToFeild(player, newPos);
        /*
        const pawnImg = document.createElement('img');
        pawnImg.src = "img/pawn.svg";
        Game.getSlotByIndex(newPos).appendChild(pawnImg);
        */


        this.makeNextPlayerCurrentPlayer();
    }

    // ! ��������, ����� ���������� event.target
    moveFromField(event) {
        // ��������� ������������ ������� (��� ��� �������), �������� ������ ����
        const clickedSlot = event.target.closest(".feildSlot");

        // ��������� � ����� �������� �� ������ ������
        if (clickedSlot == null) {
            return "You clicked an empty area of the field!";
        }

        const clickedSlotIndex = Number(clickedSlot.dataset?.index); // ! ��������, ����� parseInt

        // ����� ���� �� ��������� ������� ���������, ���� ?. � ������ ������� ���������� undefined
        // �� ������ ������ ����� ���������� � ����� ��������
        if (clickedSlotIndex == undefined) {
            throw new Error("Something's wrong! A slot doesn't have an index!");
        }


        const currentPlayer = this.currentPlayer;
        // ���� rightTurn = true, ��������� ����� ����������� �������� ������
        const rightTurn = currentPlayer.hasPawnOnPosition(clickedSlotIndex);
        
        if (!rightTurn) {
            return `������� ����� � ������ ${currentPlayer.color}.
                �������� �� ����� ����� ����� ��� ���������� ���`;
        }

        const newPos = Game.#getPotentialNewPos(clickedSlotIndex, this.dice.num);

        // ! ����� ��������� ���� �������� ��������, �� ������ �� ���� ������


        const attackResult = this.#attackHandler(newPos);
        if (attackResult.standsOnOwnPawn) {
            return attackResult.message;
        }
        

        Game.#movePawnFromFToF(currentPlayer, clickedSlotIndex, newPos);

        Game.#movePawnElement(clickedSlot, Game.getSlotByIndex(newPos));

        this.makeNextPlayerCurrentPlayer();
    }
}