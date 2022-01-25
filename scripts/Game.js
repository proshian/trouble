export class Game {
    players; // массив игроков
    dice; // Dice
    curOrder; // нужно хранить, потому что если игрок ткнул не туда, кубик не бросаетс€ снова

    static #slotsNum = 28; // число слотов на доске

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

    constructor(players, dice, colorIndicator) {
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
    }

    static #movePawnToHome(victimPlayer, attackerPlayer, curPos) { // ! ¬озмжно, лучше сделать методом Player'а
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
        
        if (player != this.players[this.curOrder]) // ! возможно стоит завернуть в get currentPlayer()
            return "you are not the curent player";

        if (player.homePawnsNum === 0) {
            return "you've got no pawns at home"
        }

        // ! 4 - это сколько всего пешек у игрока.
        // ¬озможн, следует импортировтаь класс Player и использовать константу Player.allPawns
        if (player.homePawnsNum != 4 && this.dice.num != 6) { 
            return "you've got a free pawn and the dice number is not 6. Choose another pawn."
        }



        console.log(this);

        const newPos = Game.#getPotentialNewPos(
            Game.#getPreviousPos(player.startPosition),
            this.dice.num
        );
        console.log(newPos);
        for (const playerInstance of this.players) { // ! унифицировать эту проверку ( завести методод attackCheck() )
            if (playerInstance.hasPawnOnPosition(newPos)) {
                if (playerInstance === player) {
                    return "’од невозможен. ѕешка встает на вашу другую пешку"
                }

                Game.#movePawnToHome(playerInstance, player, newPos, event.target);
                Game.#movePawnElementToHome(
                    Game.getSlotByIndex(newPos),
                    playerInstance.home
                );
            }
        }

        
        player.pawnsOnField.add(newPos);
        Game.#movePawnElementFromHomeToFeild(player, newPos);
        /*
        const pawnImg = document.createElement('img');
        pawnImg.src = "img/pawn.svg";
        Game.getSlotByIndex(newPos).appendChild(pawnImg);
        */

        

        this.curOrder = (this.curOrder + 1) % 4;
        this.dice.throwDice();
        this.updateColorIndicator();
        console.log(newPos);
    }

    moveFromField(event) {
        // здесь обработчик EventListener'a

        const clickedSlot = event.target.closest(".feildSlot");

        // сравниваю с любой пустотой на вс€кий случай
        if (clickedSlot == null) {
            return "You clicked an empty area of the field!";
        }

        const clickedSlotIndex = Number(clickedSlot.dataset?.index); // ! ¬озможно, лучше parseInt

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
                Game.#movePawnToHome(player, currentPlayer, newPos, event.target);
                Game.#movePawnElementToHome(
                    Game.getSlotByIndex(newPos),
                    player.home
                );
            }
        }

        currentPlayer.pawnsOnField.delete(clickedSlotIndex); // ! Ёти две аперации можно объединить в одну
        currentPlayer.pawnsOnField.add(newPos);

        Game.#movePawnElement(clickedSlot, Game.getSlotByIndex(newPos));

        this.curOrder = (this.curOrder + 1) % 4;
        this.dice.throwDice();

        this.updateColorIndicator()
    }
}