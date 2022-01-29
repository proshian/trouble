// !!!!!!! сообщения в move'ах нужно отрисовывать на табло для сообщений, а не возвращать
// тут важно не забыть сообщение в attakHandler


export class Game {
    /** @type {Array<Player>} */
    players;

    /** @type {Dice} */
    dice;

    /** @type {number} */
    curOrder; // нужно хранить, потому что если игрок ткнул не туда, кубик не бросается снова

    /** @type {HTMLElement} */
    gameDiv;

    /** @type {number} */
    static #slotsNum = 28; // число слотов на доске

    /** @type {number} */
    get currentPlayer() {
        return this.players[this.curOrder];
    }

    constructor(players, dice, colorIndicator, gameDiv) {
        this.players = players;
        this.curOrder = 0;
        this.dice = dice;

        this.colorIndicator = colorIndicator;
        this.updateColorIndicator();

        this.moveFromHome = this.moveFromHome.bind(this); // ! не уверен, что все еще нужно


        for (const player of this.players) {
            Game.getSlotByIndex(player.startPosition).style.backgroundColor = player.color;

            const allPawns = player.home.querySelectorAll('.pawn');
            for (const pawn of allPawns) {
                pawn.style.fill = player.color;
            }
        }



        this.gameDiv = gameDiv;

        //console.log(gameDiv);

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

    static #movePawnElement(source, dest) {
        const pawnElem = source.firstElementChild;
        if (!pawnElem.classList.contains('pawn')) {
            throw new Error("Something's wrong: an attempt to move a non pawn object!");
        }

        dest.appendChild(source.removeChild(pawnElem));
    }

    static #movePawnElementFromHomeToFeild(player, index) {
        Game.#movePawnElement(
            player.home.querySelector('.pawn').parentElement,
            Game.getSlotByIndex(index)
        );
    }

    

    

    static #movePawnToHome(victimPlayer, attackerPlayer, curPos) { // ! Возмжно, лучше сделать методом Player'а
        victimPlayer.pawnsOnField.delete(curPos);
        //curPosSlot.style.backgroundColor = attackerPlayer.color;
    }


    static #movePawnElementToHome(fieldSlot, home) {
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

    // передача хода
    makeNextPlayerCurrentPlayer() {
        this.curOrder = (this.curOrder + 1) % 4;
        this.dice.throwDice();
        this.updateColorIndicator();
    }

    #curPlayerAattackHandler(newPos) {
        const currentPlayer = this.currentPlayer;
        for (const player of this.players) {
            if (player.hasPawnOnPosition(newPos)) {
                if (player === currentPlayer) {
                    return {
                        message: "Ход невозможен. Пешка встает на вашу другую пешку",
                        standsOnOwnPawn: true
                    }
                }
                Game.#movePawnToHome(player, currentPlayer, newPos);
                Game.#movePawnElementToHome(
                    Game.getSlotByIndex(newPos),
                    player.home
                );
                return {
                    message: `пешка игрока с цветом ${player.color} была съедена`,
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
            // если клкнули по дому или дочернему элементу дома игрока player
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

        // ! 4 - это сколько всего пешек у игрока.
        // Возможно, следует импортировтаь класс Player и использовать константу Player.allPawns
        if (player.homePawnsNum != 4 && this.dice.num != 6) { 
            return "you've got a free pawn and the dice number is not 6. Choose another pawn."
        }

        const newPos = Game.#getPotentialNewPos(
            Game.#getPreviousPos(player.startPosition),
            this.dice.num
        );
        console.log(newPos);

        const attackResult = this.#curPlayerAattackHandler(newPos);
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

    // ! Возможно, лучше передавать event.target
    moveFromField(event) {
        // ближайший родительский элемент (или сам элемент), явящийся слтоом поля
        const clickedSlot = event.target.closest(".feildSlot");

        // сравниваю с любой пустотой на всякий случай
        if (clickedSlot == null) {
            return "You clicked an empty area of the field!";
        }

        const clickedSlotIndex = Number(clickedSlot.dataset?.index); // ! Возможно, лучше parseInt

        // можно было бы поставить строгое сравнение, ведь ?. в случае неудачи возвращает undefined
        // на всякий случай решил сравнивать с любой пустотой
        if (clickedSlotIndex == undefined) {
            throw new Error("Something's wrong! A slot doesn't have an index!");
        }


        const currentPlayer = this.currentPlayer;
        // если rightTurn = true, кликнутая пешка принадлежит текущему игроку
        const rightTurn = currentPlayer.hasPawnOnPosition(clickedSlotIndex);
        
        if (!rightTurn) {
            return `Текущий игрок с цветом ${currentPlayer.color}.
                Кликните по фишке этого цвета или пропустите ход`;
        }

        const newPos = Game.#getPotentialNewPos(clickedSlotIndex, this.dice.num);

        // ! перед проверкой ниже добавить проверку, не прошли ли круг пешкой


        const attackResult = this.#curPlayerAattackHandler(newPos);
        if (attackResult.standsOnOwnPawn) {
            return attackResult.message;
        }
        

        Game.#movePawnFromFToF(currentPlayer, clickedSlotIndex, newPos);

        Game.#movePawnElement(clickedSlot, Game.getSlotByIndex(newPos));

        this.makeNextPlayerCurrentPlayer();
    }
}