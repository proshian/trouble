export function boardCreation(players) {
	const field = document.querySelector('.field');

	const fragment = document.createDocumentFragment();

	const radius = 35; //halfFieldHeight - halfFieldSlotHeight;

	const finishRadius = 19.5;//halfFieldHeight + 2 * halfFieldSlotHeight;

	const slotsNum = 28; // число слотов

	// начальный угол. Сдвигаю так, что последняя позиция игрока players[0] находится на горизонтали
	// затем сдвигаю еще на 45 градусов. Теперь конечные позиции на "диагонали"
	const offset = players[0].endPosition * 2 * Math.PI / slotsNum + Math.PI / 4;


	for (let i = 0; i < slotsNum; i++) {
		// угол
		// отрицателен, чтобы слоты расположились "по часовой стрелке"
		const theta = -2 * Math.PI * i / slotsNum + offset;

		//console.log(`i=${i}, thta = ${theta}`);
		
		const slot = createFieldSlot(
			i,
			radius + 'vmin',
			theta,
		);

		fragment.appendChild(slot);
	}


	// словарь хранит конечные позиции игроков (ключ) и цвета игроков (значение)
	const endPositions = new Map();
	for (const player of players) {
		endPositions.set(player.endPosition, player.color);
	}

	
	for (const [endPos, color] of endPositions) {
		const theta = -2 * Math.PI * endPos / slotsNum + offset;

		//console.log(endPos);

		const finish = createFinishAndSlots(theta, finishRadius, color);

		for (const player of players) {
			if (player.color === color) {
				player.finish = finish;
				break;
			}
		}
		
		fragment.appendChild(finish);
    }
	
	field.appendChild(fragment);
}

function createFieldSlot(index, radius, theta) {
	const slot = document.createElement('button');
	slot.type = "button";
	slot.classList.add('feildSlot'); // ! возможно, лучше className
	slot.classList.add('slot');
	slot.dataset.index = index;	// добавляет атрибут data-index, i приводится к строке
	//slot.innerText = index;
	slot.style.transform = `rotate(${-theta}rad) translate(${radius}) rotate(${theta}rad)`;
	return slot;
}


function createFinishAndSlots(theta, finishRadius, color) {
	const finish = document.createElement('div');
	finish.classList.add('finish');

	for (let i = 0; i < 4; i++) {
		const finishSlot = document.createElement('div');
		finishSlot.classList.add('slot');
		finishSlot.classList.add('finish-slot');
		finishSlot.style.backgroundColor = color;
		finishSlot.style.transform = `rotate(${theta - Math.PI / 2}rad)`;
		finishSlot.dataset.index = i;

		finish.appendChild(finishSlot);
	}

	finish.style.transform = `rotate(${-theta}rad) translate(${finishRadius + 'vmin'}) rotate(${90}deg)`;
	return finish;
}