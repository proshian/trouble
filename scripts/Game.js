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

    putPawnElementToSlot(color, index) {

        Game.getSlotByIndex(index).innerHTML = 
            `<svg class = "pawn" viewBox="0 0 34 59" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path id="pawnSVG" d="M31.5131 48.404H30.3638C30.8694 47.6726 32.4579 44.9449 30.2228 42.215C27.6368 39.056 22.4918 29.5967 24.9236 23.2626H25.1131C25.9699 23.2626 26.6 22.5752 26.6 21.7273V21.5354C26.6 20.6875 25.9699 20 25.1131 20H24.8755C26.9927 17.9914 28.3131 15.1667 28.3131 12.0354C28.3131 5.94077 23.3203 1 17.1615 1C11.0028 1 6.01004 5.94077 6.01004 12.0354C6.01004 15.1667 7.33038 17.9914 9.44761 20H9.0161C8.15927 20 7.4 20.6875 7.4 21.5354V21.7273C7.4 22.5752 8.15927 23.2626 9.0161 23.2626H9.3999C11.8317 29.5967 6.68669 39.056 4.1007 42.215C1.86575 44.9449 3.45411 47.6726 3.95971 48.404H2.6161C1.75927 48.404 1 49.0915 1 49.9394V53.3939C1 54.2418 1.75927 54.9293 2.6161 54.9293H2.74545V58H31.4485V54.9293C32.4182 54.9293 33 54.2418 33 53.3939V49.9394C33 49.0915 32.3699 48.404 31.5131 48.404Z"
                fill="${color}" stroke="black" stroke-width="2"/>
        </svg>`;
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
        /*
        const pawnImg = document.createElement('img');
        pawnImg.src = "img/pawn.svg";
        Game.getSlotByIndex(newPos).appendChild(pawnImg);
        */

        this.putPawnElementToSlot(player.color, newPos);

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