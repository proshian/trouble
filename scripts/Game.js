export class Game {
    players; // массив игроков
    dice; // Dice
    curOrder; // нужно хранить, потому что если игрок ткнул не туда, кубик не бросается снова

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

    constructor(players, dice, colorIndicator) {
        this.players = players;
        this.curOrder = 0;
        this.dice = dice;
        this.colorIndicator = colorIndicator;
        this.updateColorIndicator();

        this.moveFromHome = this.moveFromHome.bind(this); // ! не уверен, что все еще нужно


        for (const player of this.players) {
            Game.getSlotByIndex(player.startPosition).style.backgroundColor = player.color;
        }
    }

    static #movePawnToHome(victimPlayer, attackerPlayer, curPos) { // ! Возмжно, лучше сделать методом Player'а
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
        
        if (player != this.players[this.curOrder]) // ! возможно стоит завернуть в get currentPlayer()
            return "you are not the curent player";

        if (player.homePawnsNum === 0) {
            return "you've got no pawns at home"
        }

        // ! 4 - это сколько всего пешек у игрока.
        // Возможн, следует импортировтаь класс Player и использовать константу Player.allPawns
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
                    return "Ход невозможен. Пешка встает на вашу другую пешку"
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
        // здесь обработчик EventListener'a

        const clickedSlotIndex = Number(event.target.dataset?.index); // ! Возможно, лучше parseInt

        // можно было бы поставить строгое сравнение, ведь ?. в случае неудачи возвращает undefined
        // на всякий случай ешил сравнивать с любой пустотой
        if (clickedSlotIndex == undefined) {
            // throw new Error("Something's wrong! A slot doesn't have an index!");
            return console.log("Чтобы сделать ход необходимо кликнуть по фишке");
        }


        const currentPlayer = this.players[this.curOrder];
        console.log(currentPlayer);
        // если rightTurn = true, кликнутая пешка принадлежит текущему игроку
        const rightTurn = currentPlayer.hasPawnOnPosition(clickedSlotIndex);
        console.log("rightTurn = " + rightTurn);
        if (!rightTurn) {
            return `Текущий игрок с цветом ${currentPlayer.color}.
                Кликните по фишке этого цвета или пропустите ход`;
        }

        const newPos = Game.#getPotentialNewPos(clickedSlotIndex, this.dice.num);

        console.log("newPos = " + newPos);

        // ! перед проверкой ниже добавить проверку, не прошли ли круг пешкой

        for (const player of this.players) {
            if (player.hasPawnOnPosition(newPos)) {
                if (player === currentPlayer) {
                    return "Ход невозможен. Пешка встает на вашу другую пешку"
                }
                Game.#movePawnToHome(player, currentPlayer, newPos, event.target);
            }
        }

        currentPlayer.pawnsOnField.delete(clickedSlotIndex); // ! Эти две аперации можно объединить в одну
        currentPlayer.pawnsOnField.add(newPos);

        event.target.style.backgroundColor = "";
        Game.getSlotByIndex(newPos).style.backgroundColor = currentPlayer.color;

        this.curOrder = (this.curOrder + 1) % 4;
        this.dice.throwDice();

        this.updateColorIndicator()
    }
}