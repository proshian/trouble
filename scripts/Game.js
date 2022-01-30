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

    /** @type {HTMLElement} */
    messageDisplay;

    /** @type {number} */
    static #slotsNum = 28; // число слотов на доске

    /** @type {number} */
    get currentPlayer() {
        return this.players[this.curOrder];
    }


    /**
     * Игра
     *
     * @param {Array<Player>} players Массив игроков-участников игры
     * @param {Dice} dice Игральный кубик
     * @param {HTMLElement} colorIndicator Цветовой индикатор текущего игрока
     * @param {HTMLElement} gameDiv div, содржащий все элементы игры
     * @param {HTMLElement} messageDisplay Элемент для вывода сообщений для игрока
     */
    constructor(players, dice, colorIndicator, gameDiv, messageDisplay) {
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

        this.messageDisplay = messageDisplay;

        this.gameDiv = gameDiv;

        //console.log(gameDiv);

        this.gameDiv.addEventListener(
            'click',
            () => this.move(event),
        )

        document.querySelector('.skip-move').addEventListener(
            'click',
            () => this.#makeNextPlayerCurrentPlayer(),
        );
    }



    /**
     * Возвращает слот поля, имеющий индекс, который передан как аругмент
     *
     * @param {nuber} index Индекс слота поля
     */
    static getSlotByIndex(index) {
        return document.querySelector(`.feildSlot[data-index = "${index}"]`);
    }

    /**
     * Возвращает индекс слота поля, на который встанет пешка, если ей ничего не помешает
     * 
     * @param {number} curPos Индекс слота поля, на котором стояла перемещаемая пешка до хода
     * @param {diceNum} curPos Число на кубике
     */
    static #getPotentialNewPos(curPos, diceNum) {
        return (curPos + diceNum) % Game.#slotsNum;
    }

    /**
     * Возвращает предыдущий слот поля
     *
     * @param {number} pos Слот поля, для которого ищем предыдущий
     */
    static #getPreviousPos(pos) {
        return (pos + Game.#slotsNum - 1) % Game.#slotsNum;
    }

    /**
     * Выводит сообщение на окно для сообщений
     *
     * @param {string} message Сообщение для пользователя
     */
    setMessage(message) {
        this.messageDisplay.innerText = message;
    }

    /**
     * Обовляет цветовой индикатор текущего игрока
     */
    updateColorIndicator() {
        this.colorIndicator.style.backgroundColor = this.players[this.curOrder].color;
    }


    /**
     * перемещает HTML элемент пешки из старого родителя в новый
     *
     * @param {HTMLElement} source Исходный родитель элемента пешки
     * @param {HTMLElement} dest Новый родитель элемента пешки
     */
    static #movePawnElement(source, dest) {
        //console.log("dest"+dest);
        const pawnElem = source.firstElementChild;

        if (pawnElem == null) {
            throw new Error("Something's wrong! A child was expected!");
        }

        if (!pawnElem.classList.contains('pawn')) {
            throw new Error("Something's wrong: an attempt to move a non-pawn object!");
        }
        // appendChild перенесет элемент в dest, убрав его из исходного места в DOM
        dest.appendChild(pawnElem); 
    }

    /**
     * перемещает HTML элемент пешки из дома в слот поля
     *
     * @param {Player} player Исходный родитель элемента пешки
     * @param {number} index Новый родитель элемента пешки
     */
    static #movePawnElementFromHomeToFeild(player, index) {
        Game.#movePawnElement(
            player.home.querySelector('.pawn').parentElement,
            Game.getSlotByIndex(index)
        );
    }

    

    /**
    * перемещает пешку ("логическую") c поля в дом
    *
    * @param {Player} victimPlayer Игрок, пешка которого будт перемещена в дом
    * @param {number} curPos позиция пешки, которая будет перенесена в дом
    */
    static #movePawnToHome(victimPlayer, curPos) { // ! Возмжно, лучше сделать методом Player'а
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


    static #removeActive(player) {
        player.home.classList.remove('active');
        player.home.classList.add('inactive');
        /*
        for (const index of player.pawnsOnField) {
            const classList = Game.getSlotByIndex(index).classList;
            classList.remove('active');
            classList.add('inactive');
        }
        */
    }

    static #addActive(player) {
        player.home.classList.add('active');
        player.home.classList.remove('inactive');
        /*
        for (const index of player.pawnsOnField) {
            Game.getSlotByIndex(index).classList.add('active');
            const classList = Game.getSlotByIndex(index).classList;
            classList.add('active');
            classList.remove('inactive');
        }
        */
    }


    // передача хода
    #makeNextPlayerCurrentPlayer() {
        Game.#removeActive(this.currentPlayer);
        this.messageDisplay.innerText = "";
        this.curOrder = (this.curOrder + 1) % 4;
        this.dice.throwDice();
        this.updateColorIndicator();
        Game.#addActive(this.currentPlayer);

        /*
        console.log("состояние игры:");
        for (const player of this.players) {
            console.log(player.color, player.pawnsOnField, player.blockedFinishSlots);
        }
        */
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
                Game.#movePawnToHome(player, newPos);
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
        this.messageDisplay.innerText = "";
        if (document.querySelector('.skip-move').contains(event.target)) {
            return this.#makeNextPlayerCurrentPlayer();
        }

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
        if (player != this.currentPlayer) {
            this.setMessage("you are not the curent player");
            return;
        }
         

        if (player.homePawnsNum === 0) {
            this.setMessage("you've got no pawns at home");
            return;
        }

        // ! 4 - это сколько всего пешек у игрока.
        // Возможно, следует импортировтаь класс Player и использовать константу Player.allPawns
        if (player.homePawnsNum != (4 - player.blockedFinishSlots.size) && this.dice.num != 6) {
            this.setMessage("you've got a free pawn and the dice number is not 6. Choose another pawn.");
            return;
        }

        const newPos = Game.#getPotentialNewPos(
            Game.#getPreviousPos(player.startPosition),
            this.dice.num
        );
        //console.log(newPos);

        const attackResult = this.#curPlayerAattackHandler(newPos);
        if (attackResult.standsOnOwnPawn) {
            this.setMessage(attackResult.message);
            return;
        }
        
        player.pawnsOnField.add(newPos);
        Game.#movePawnElementFromHomeToFeild(player, newPos);
        /*
        const pawnImg = document.createElement('img');
        pawnImg.src = "img/pawn.svg";
        Game.getSlotByIndex(newPos).appendChild(pawnImg);
        */


        this.#makeNextPlayerCurrentPlayer();
    }

    // ! Возможно, лучше передавать event.target
    moveFromField(event) {
        // ближайший родительский элемент (или сам элемент), явящийся слтоом поля
        const clickedSlot = event.target.closest(".feildSlot");

        // сравниваю с любой пустотой на всякий случай
        if (clickedSlot == null) {
            this.setMessage("You clicked an empty area of the field. Please click a pawn.");
            return;
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
            this.setMessage(
                `Текущий игрок с цветом ${currentPlayer.color}. Кликните по фишке этого цвета или пропустите ход`
            );
            return;
        }

        const newPos = Game.#getPotentialNewPos(clickedSlotIndex, this.dice.num);



        // мы перешагнули старт, если количество клеток от стартовой позиции по часовой стрелки
        // до предыдущего положения больше, чем до следующего
        const newDistance = (Game.#slotsNum + newPos - currentPlayer.startPosition) % Game.#slotsNum;
        const oldDistance = (Game.#slotsNum + clickedSlotIndex - currentPlayer.startPosition) % Game.#slotsNum;

        //console.log(`new ${newDistance},old ${oldDistance}`)

        if (newDistance < oldDistance) {
            if (newDistance > 3) {
                this.setMessage("Пешка перепрыгнула финиш");
                return;
            }
            if (currentPlayer.blockedFinishSlots.has(newDistance)) {
                this.setMessage(`На финешном слоте ${newDistance + 1} уже есть пешка`);
                return;
            }
            currentPlayer.blockedFinishSlots.add(newDistance);
            currentPlayer.pawnsOnField.delete(clickedSlotIndex);
            const finishSlotEl = currentPlayer.finish.querySelector(`.finish-slot[data-index="${newDistance}"]`);
            //console.log(`.finishSlot[data-index = "${newDistance}"]`);
            Game.#movePawnElement(clickedSlot, finishSlotEl);
            this.#makeNextPlayerCurrentPlayer();

            if (currentPlayer.blockedFinishSlots.size === 4) {
                location.href = "youWon.html";
            }

            return;


        }
        
        

        const attackResult = this.#curPlayerAattackHandler(newPos);
        if (attackResult.standsOnOwnPawn) {
            this.setMessage(attackResult.message);
            return;
        }
        

        Game.#movePawnFromFToF(currentPlayer, clickedSlotIndex, newPos);

        Game.#movePawnElement(clickedSlot, Game.getSlotByIndex(newPos));

        this.#makeNextPlayerCurrentPlayer();
    }
}